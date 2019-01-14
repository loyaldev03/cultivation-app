module Cultivation
  class UpdateTask
    prepend SimpleCommand

    REFTYPE_CHILDREN = 'children'.freeze
    REFTYPE_DEPENDENT = 'dependent'.freeze

    attr_reader :args, :task, :array

    def initialize(args = nil, current_user = nil, activate_batch = false)
      @args = args
      @current_user = current_user
      @activate_batch = activate_batch
    end

    def call
      task = Cultivation::Task.includes(:batch).find(@args[:id])
      if @args[:type] == 'resource'
        task.update(user_ids: @args[:user_ids])
      else
        batch = task.batch
        batch_tasks = Cultivation::QueryTasks.call(batch).result
        task = batch_tasks.detect { |t| t.id == task.id }
        if valid_batch? batch
          # Remember original start_date
          original_start_date = task.start_date
          # Set batch to active
          batch.is_active = true if @activate_batch
          # Update task with args and re-calculate end_date
          task = map_args_to_task(task, batch_tasks, @args)
          # Move subtasks's start date & save changes
          adjust_children_dates(task, batch_tasks, original_start_date)
          # Extend / contract parent duration & end_date
          adjust_parent_dates(task, batch_tasks)
          # Save if no errors
          task.save! if errors.empty?

          # opt = {
          #   facility_id: batch.facility_id,
          #   batch_id: batch.id,
          #   quantity: batch.quantity,
          # }

          # TODO::ANDY - valid_data when updating tasks

          # TODO::ANDY: Estimated Hours are not calculating
          # Extend end date to Category and Phas

          # Update batch
          update_batch(batch, batch_tasks&.first)
        end
      end
      task
    end

    private

    def cascade_changes?(task)
      # Update child and dependents tasks's start & end dates except
      # when task is Clean - doesn't effect parent or dependent tasks
      task.indelible != 'cleaning'
    end

    def map_args_to_task(task, batch_tasks, args)
      # Only allow non-indelible task change these field
      if !task.indelible?
        task.name = args[:name]
        task.depend_on = args[:depend_on].present? ? args[:depend_on].to_bson_id : nil
        task.task_type = args[:task_type] || []
      end
      task.start_date = decide_start_date(task, batch_tasks, args[:start_date])
      if !task.have_children?(batch_tasks)
        # Parent duration should derived from sub-tasks
        task.duration = args[:duration].present? ? args[:duration].to_i : 1
        # Parent estimated_hours should derived from sub-tasks
        task.estimated_hours = args[:estimated_hours].to_f
        # TODO: Calc estimated cost
        task.estimated_cost = args[:estimated_cost].to_f
      end
      task.end_date = task.start_date + task.duration.days
      task.user_ids = if args[:user_ids].present?
                        args[:user_ids].map(&:to_bson_id)
                      else
                        []
                      end
      task
    end

    def decide_start_date(task, batch_tasks, args_start_date)
      parent = task.parent(batch_tasks)
      # First subtask should have same start_date as parent task
      if task.first_child?
        return parent.start_date
      end
      # Subtask should be be set ealier than parent start_date
      if args_start_date
        if parent && args_start_date < parent.start_date
          return parent.start_date
        end
        return args_start_date
      end
      # Use parent start date if not available
      task.start_date || parent.start_date
    end

    def decide_duration(task, parent, children)
      if parent.end_date < task.end_date
        # Extend parent duration / end_date
        (task.end_date - parent.start_date) / 1.day
      else
        # Contract parent duration / end_date
        max_child_date = children.map(&:end_date).compact.max
        (max_child_date - parent.start_date) / 1.day
      end
    end

    def decide_estimated_hours(children, batch_tasks)
      children.reduce(0) do |sum, e|
        if !e.have_children?(batch_tasks) && e.estimated_hours
          sum + e.estimated_hours
        else
          sum
        end
      end
    end

    def adjust_children_dates(task, batch_tasks, original_start_date)
      days_diff = (task.start_date - original_start_date) / 1.day
      children = task.children(batch_tasks)
      move_children(children, batch_tasks, days_diff)
      children.each(&:save)
    end

    def adjust_parent_dates(task, batch_tasks)
      parent = task.parent(batch_tasks)
      while parent.present?
        children = parent.children(batch_tasks)
        parent.estimated_hours = decide_estimated_hours(children, batch_tasks)
        parent.duration = decide_duration(task, parent, children)
        parent.end_date = parent.start_date + parent.duration.days
        parent.save
        parent = parent.parent(batch_tasks)
      end
    end

    def move_children(tasks, batch_tasks, number_of_days = 0)
      if tasks.present? && number_of_days != 0
        tasks.each do |t|
          new_start_date = t.start_date + number_of_days.days
          t.start_date = decide_start_date(t, batch_tasks, new_start_date)
          t.duration ||= 1
          t.end_date = t.start_date + t.duration.days
        end
      end
    end

    def update_batch(batch, first_task)
      # Here we assume estimated harvest date is the start date of :dry phase
      # (or :cure, when :dry not found)
      harvest_phase = Cultivation::Task.
        where(batch_id: batch.id,
              is_phase: true,
              :phase.in => [Constants::CONST_DRY,
                            Constants::CONST_CURE]).first
      batch.estimated_harvest_date = harvest_phase.start_date if harvest_phase
      batch.start_date = first_task.start_date if first_task.start_date
      batch.save!
    end

    # Find all subtasks
    def get_dependents(task, batch_tasks)
      batch_tasks.select do |t|
        t.depend_on &&
          # Dependent tasks should have depends on set to current task
          t.depend_on.to_s == task.id.to_s
      end
    end

    def valid_batch?(batch)
      if batch.facility_id.nil?
        errors.add(:facility_id, 'Missing Facility in Batch')
      end
      if batch.quantity.nil?
        errors.add(:quantity, 'Missing Quantity in Batch. Did you skipped quanity location selection?')
      end
      errors.empty? # No Errors => Valid
    end

    def valid_data?(tasks, opt = {})
      # max_date = tasks.pluck(:end_date).compact.max
      # min_date = tasks.pluck(:start_date).compact.min
      # overlap_batch = false
      # overlap_batch_name = ''
      # Find "Phase" tasks that has changes
      phase_tasks = get_phase_tasks(tasks)
      phase_tasks.each do |t|
        # Rails.logger.debug ">>> phase_tasks, #{t.name} - #{t.phase}"
        # Rails.logger.debug ">>> phase_dates, #{t.start_date} - #{t.end_date}"
        args = {
          facility_id: opt[:facility_id],
          exclude_batch_id: opt[:batch_id],
          phase: t.phase,
          start_date: t.start_date,
          end_date: t.end_date,
        }
        available_capacity = QueryAvailableCapacity.call(args).result
        # Rails.logger.debug "required capacity: #{opt[:quantity]}"
        # Rails.logger.debug "available capacity: #{available_capacity}"
        if opt[:quantity] > available_capacity
          error_message = "Not enough capacity on selected dates in #{t.name}. "
          existing_plans = QueryPlannedTrays.call(t.start_date,
                                                  t.end_date,
                                                  opt[:facility_id],
                                                  opt[:batch_id]).result
          if !existing_plans.empty?
            existing_plans = existing_plans.select { |p| p.phase == t.phase }
            batch_ids = existing_plans.pluck(:batch_id).uniq
            # overlapping_phase = existing_plans.pluck(:phase).uniq
            # Rails.logger.debug batch_ids
            # Rails.logger.debug overlapping_phase
            batch_nos = Cultivation::Batch.
              where(:id.in => batch_ids).
              pluck(:batch_no)
            if !batch_nos.empty?
              error_message += 'Overlapping tray planning with batch: '
              error_message += batch_nos.join(', ') if !batch_nos.empty?
            end
            errors.add(:end_date, error_message)
          end
          break
        end
      end
      errors.empty?
    end

    def get_phase_tasks(tasks)
      # Find "Phase" tasks only
      tasks.select do |t|
        t.phase && Constants::CULTIVATION_PHASES_3V.include?(t.phase)
      end
    end
  end
end
