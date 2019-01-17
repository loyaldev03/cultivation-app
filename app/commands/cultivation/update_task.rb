module Cultivation
  class UpdateTask
    prepend SimpleCommand

    REFTYPE_CHILDREN = 'children'.freeze
    REFTYPE_DEPENDENT = 'dependent'.freeze

    def initialize(args = nil, current_user = nil, activate_batch = false)
      @args = args
      @current_user = current_user
      @activate_batch = activate_batch
    end

    def call
      task = Cultivation::Task.includes(:batch).find_by(id: @args[:id])
      if @args[:type] == 'resource'
        task.update(user_ids: @args[:user_ids])
      else
        batch = task.batch
        if valid_batch? batch
          batch_tasks = Cultivation::QueryTasks.call(batch).result
          task = batch_tasks.detect { |t| t.id == task.id }
          facility_users = get_facility_users(batch.facility_id)
          # Remember original start_date
          original_start_date = task.start_date
          # Set batch to active
          batch.is_active = true if @activate_batch
          # Update task with args and re-calculate end_date
          task = map_args_to_task(task, batch_tasks, @args)
          # Move subtasks's start date & save changes
          adjust_children_dates(task, batch_tasks, original_start_date)
          # Update estimated cost
          update_estimated_cost(task, facility_users)
          # Extend / contract parent duration & end_date
          update_parent_cascade(task, batch_tasks)
          # Save if no errors
          task.save! if errors.empty?
          # TODO::ANDY - valid_data when updating tasks
          # Update batch
          update_batch(batch, batch_tasks&.first)
        end
      end
      task
    end

    private

    def get_facility_users(facility_id)
      User.in(facilities: facility_id).where(is_active: true).to_a
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

    def cascade_changes?(task)
      # Update child and dependents tasks's start & end dates except
      # when task is Clean - doesn't effect parent or dependent tasks
      task.indelible != 'cleaning'
    end

    def map_args_to_task(task, batch_tasks, args)
      # Only allow non-indelible task change these field
      if !task.indelible?
        task.name = args[:name]
        task.task_type = args[:task_type] || []
      end
      task.start_date = decide_start_date(task, batch_tasks, args[:start_date], args[:depend_on])
      task.depend_on = decide_depend_on(task, batch_tasks, args[:depend_on])
      if !task.have_children?(batch_tasks)
        # Parent duration should derived from sub-tasks
        task.duration = args[:duration].present? ? args[:duration].to_i : 1
        task.user_ids = decide_assigned_users(args[:user_ids])
        # Parent estimated_hours should derived from sub-tasks
        task.estimated_hours = args[:estimated_hours].to_f
      else
        # Clear data not relevant to parent task
        task.user_ids = []
      end
      task.end_date = task.start_date + task.duration.days
      task
    end

    def decide_depend_on(task, batch_tasks, args_depend_on)
      if args_depend_on.present?
        predecessor = batch_tasks.detect { |t| t.id == args_depend_on.to_bson_id }
        if predecessor.present? && task.child_of?(predecessor.wbs, batch_tasks)
          errors.add(:depend_on, 'Cannot set parent node as predecessor')
          return nil
        end
        args_depend_on.to_bson_id
      end
    end

    def decide_start_date(task, batch_tasks, args_start_date, args_depend_on = nil)
      # TODO::ANDY if task is a first child, it should also change the parent start_date
      if args_depend_on.present? && task.depend_on != args_depend_on
        predecessor = batch_tasks.detect { |t| t.id == args_depend_on.to_bson_id }
        if predecessor.present? && !task.child_of?(predecessor.wbs, batch_tasks)
          return predecessor.end_date
        end
      end
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

    def decide_assigned_users(args_user_ids)
      if args_user_ids.present?
        args_user_ids.uniq.map(&:to_bson_id)
      else
        []
      end
    end

    def update_estimated_cost(task, users)
      if task.estimated_hours && task.duration && task.user_ids.present?
        hours_per_person = task.estimated_hours / task.user_ids.length
        estimated_cost = 0.00
        task.user_ids.each do |user_id|
          user = users.detect { |u| u.id == user_id }
          if user.present?
            estimated_cost += user.hourly_rate * hours_per_person
          else
            # Remove user from task if not found
            task.user_ids.delete_if { |i| i == user_id }
          end
        end
        task.estimated_cost = estimated_cost
      else
        task.estimated_cost = 0
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

    def adjust_children_dates(task, batch_tasks, original_start_date)
      days_diff = (task.start_date - original_start_date) / 1.day
      children = task.children(batch_tasks)
      move_children(children, batch_tasks, days_diff)
      children.each(&:save)
    end

    def sum_children_hours(children, batch_tasks)
      children.reduce(0) do |sum, e|
        if !e.have_children?(batch_tasks) && e.estimated_hours
          sum + e.estimated_hours
        else
          sum
        end
      end
    end

    def sum_children_cost(children, batch_tasks)
      children.reduce(0.0) do |sum, e|
        if !e.have_children?(batch_tasks) && e.estimated_cost
          sum + e.estimated_cost
        else
          sum
        end
      end
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

    def update_parent_cascade(task, batch_tasks)
      parent = task.parent(batch_tasks)
      while parent.present?
        children = parent.children(batch_tasks)
        parent.estimated_hours = sum_children_hours(children, batch_tasks)
        parent.estimated_cost = sum_children_cost(children, batch_tasks)
        parent.duration = decide_duration(task, parent, children)
        parent.end_date = parent.start_date + parent.duration.days
        parent.save
        parent = parent.parent(batch_tasks)
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
