module Cultivation
  class UpdateTask
    prepend SimpleCommand

    REFTYPE_CHILDREN = 'children'.freeze
    REFTYPE_DEPENDENT = 'dependent'.freeze

    attr_accessor :args, :current_user, :cascade_change_tasks, :schedule_batch,
      :original_user_ids

    def initialize(current_user = nil, args = nil, schedule_batch = false)
      self.current_user = current_user
      self.args = args
      self.schedule_batch = schedule_batch
      self.cascade_change_tasks = []
    end

    def call
      task = Cultivation::Task.includes(:batch).find_by(id: args[:id])
      @original_user_ids = task.user_ids.blank? ? [] : task.user_ids.map(&:to_s)
      batch = task.batch
      if valid_batch? batch
        batch_tasks = Cultivation::QueryTasks.call(batch, [:modifier, :users]).result
        task = get_task(batch_tasks, task.id)
        facility_users = QueryUsers.call(batch.facility_id).result
        # Remember original start_date
        original_start_date = task.start_date
        # Update task with args and re-calculate end_date
        task = map_args_to_task(task, batch_tasks)
        # Move subtasks's start date & save changes
        days_diff = (task.start_date - original_start_date) / 1.day
        adjust_children_dates(task, batch_tasks, days_diff)
        # Update estimated cost of current task
        update_estimated_cost(task, batch_tasks, facility_users)
        # Extend / contract parent duration & end_date
        update_parent_cascade(task, batch_tasks)
        # Cascade changes to root node's siblings (if current node is root)
        update_root_siblings(task, batch_tasks, days_diff)
        # Save if no errors
        detect_cascade_changes(task, batch_tasks)
        task.modifier = current_user
        task.facility = batch.facility
        task.save! if errors.empty?
        perform_cascade_change_tasks
        # TODO::ANDY - validate_capacity when updating tasks
        # Update batch
        update_batch(batch, batch_tasks&.first, schedule_batch)
      end
      action_notify(task)
      task
    end

    private

    def action_notify(task)
      if args[:action] == 'edit_assignees'
        new_user_ids = args[:user_ids].blank? ? [] : args[:user_ids].map(&:to_s)
        unassigned = original_user_ids - new_user_ids
        assigned = new_user_ids - original_user_ids

        create_notifications(task, 'task_assigned', assigned) unless assigned.blank?
        create_notifications(task, 'task_unassigned', unassigned) unless unassigned.blank?
      end
    end

    def create_notifications(task, action, user_ids)
      CreateNotificationsWorker.perform_async(
        current_user.id.to_s,
        action,
        user_ids,
        task.id.to_s,
        Constants::NOTIFY_TYPE_TASK,
        task.name,
        task.batch_id.to_s,
        Constants::NOTIFY_TYPE_BATCH,
        task.batch.name,
      )
    end

    def detect_cascade_changes(task, batch_tasks)
      if task.changes['end_date'].present?
        dependents = task.dependents(batch_tasks)
        if dependents.present?
          cascade_change_tasks.push(*dependents)
        end
      end
    end

    def perform_cascade_change_tasks
      if cascade_change_tasks.present?
        cascade_change_tasks.each do |t|
          UpdateTask.call(current_user, t)
        end
      end
    end

    def update_batch(batch, first_task, schedule_batch)
      # Here we assume estimated harvest date is the start date of :dry phase
      # (or :cure, when :dry not found)
      harvest_phase = Cultivation::Task.
        where(batch_id: batch.id,
              indent: 0,
              :phase.in => [Constants::CONST_HARVEST,
                            Constants::CONST_DRY,
                            Constants::CONST_CURE]).first
      # Set batch to active
      if schedule_batch
        batch.status = Constants::BATCH_STATUS_SCHEDULED
      end
      batch.estimated_harvest_date = harvest_phase&.start_date
      batch.start_date = first_task&.start_date
      batch.save!

      # NOTE: Background job would activate all scheduled batch
      # if batch.start_date <= Time.current
      ActivateBatchWorker.new.perform

      update_tray_plans(batch)
      batch
    end

    def update_tray_plans(batch)
      cmd = Cultivation::UpdateTrayPlans.call(current_user, batch_id: batch.id)
      if !cmd.success?
        self.errors = cmd.errors
      end
    end

    def map_args_to_task(task, batch_tasks)
      # Only allow non-indelible task change these field
      if !task.indelible? || task.indelible == 'add_nutrient'
        task.name = args[:name]
      end
      task.start_date = decide_start_date(task, batch_tasks, args[:start_date], args[:depend_on])
      task.depend_on = decide_depend_on(task, batch_tasks, args[:depend_on])
      if !task.have_children?(batch_tasks)
        task.duration = args[:duration].present? ? args[:duration].to_i : 1
        task.user_ids = decide_assigned_users(args[:user_ids])
        task.estimated_hours = args[:estimated_hours].to_f
      else
        # Clear data not relevant to parent task
        task.user_ids = []
      end
      task.end_date = task.start_date + task.duration.days

      # Map location info to task
      if task.indelible != 'clip_mother_plant'
        task.location_id = args[:location_id].to_bson_id if args[:location_id].present?
        task.location_type = args[:location_type] if args[:location_type].present?
      end
      task
    end

    def decide_depend_on(task, batch_tasks, args_depend_on)
      if args_depend_on.present?
        predecessor = get_task(batch_tasks, args_depend_on)
        if predecessor.present? && task.child_of?(predecessor.wbs, batch_tasks)
          errors.add(:depend_on, 'Cannot set parent node as predecessor')
          return nil
        end
        args_depend_on.to_bson_id
      end
    end

    def decide_start_date(task, batch_tasks, args_start_date, args_depend_on = nil)
      # Start Date decided by depend_on task
      if args_depend_on.present? && task.depend_on != args_depend_on
        predecessor = get_task(batch_tasks, args_depend_on)
        if predecessor.present? && !task.child_of?(predecessor.wbs, batch_tasks)
          return predecessor.end_date
        end
      end

      if task.depend_on.present?
        predecessor = get_task(batch_tasks, task.depend_on)
        if predecessor.present?
          return predecessor.end_date
        end
      end

      # Start Date decided by child's predecessor end date
      children = task.children(batch_tasks)
      if children.present?
        first_child = children[0]
        if first_child.depend_on.present?
          predecessor = get_task(batch_tasks, first_child.depend_on)
          if predecessor.present?
            return predecessor.end_date
          end
        end
      end

      # Start Date decided by parent task
      parent = task.parent(batch_tasks)
      # First subtask should have same start_date as parent task
      if task.first_child?
        return parent.start_date
      end
      # Subtask should not be set ealier than parent start_date
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

    def update_estimated_cost(task, batch_tasks, users)
      if task.have_children?(batch_tasks)
        # Task with children task would deduce from child tasks.
        children = task.children(batch_tasks)
        task.estimated_hours = sum_children_hours(children, batch_tasks)
        task.estimated_labor_cost = sum_children_labor_cost(children, batch_tasks)

        # TASK 980 - not sure should we call this because caller of this command
        # is usually when there is a task assigned or date changed.
        #
        task.estimated_material_cost = sum_children_est_material_cost(children, batch_tasks)
        return
      end

      if task.estimated_hours && task.duration && task.user_ids.present?
        hours_per_person = task.estimated_hours / task.user_ids.length
        estimated_labor_cost = 0.00
        task.user_ids.each do |user_id|
          user = users.detect { |u| u.id == user_id }
          if user.present?
            estimated_labor_cost += user.hourly_rate * hours_per_person
          else
            # Remove user from task if not found
            task.user_ids.delete_if { |i| i == user_id }
          end
        end
        task.estimated_labor_cost = estimated_labor_cost
      else
        task.estimated_labor_cost = 0
      end
    end

    def adjust_children_dates(task, batch_tasks, days_diff)
      children = task.children(batch_tasks)
      cascade_indelible(task, children)
      move_children(children, batch_tasks, days_diff)
      children.each(&:save)
    end

    def move_children(tasks, batch_tasks, number_of_days = 0)
      if tasks.present? && number_of_days != 0
        tasks.each do |t|
          move_task(t, batch_tasks, number_of_days)
        end
      end
    end

    def cascade_indelible(task, children)
      if task.indelible? && task.indelible == 'add_nutrient'
        children.each do |t|
          t.indelible = task.indelible
        end
      end
    end

    def move_task(task, batch_tasks, number_of_days = 0)
      new_start_date = task.start_date + number_of_days.days
      task.start_date = decide_start_date(task, batch_tasks, new_start_date)
      task.duration ||= 1
      task.end_date = task.start_date + task.duration.days
    end

    def update_root_siblings(task, batch_tasks, days_diff)
      if task.indent.zero?
        siblings = batch_tasks.select { |t| t.indent.zero? && t.position > task.position }
        siblings.each do |node|
          move_task(node, batch_tasks, days_diff)
          adjust_children_dates(node, batch_tasks, days_diff)
        end
        siblings.each(&:save)
      end
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

    def sum_children_labor_cost(children, batch_tasks)
      children.reduce(0.0) do |sum, e|
        if !e.have_children?(batch_tasks) && e.estimated_labor_cost
          sum + e.estimated_labor_cost
        else
          sum
        end
      end
    end

    # TASK 980
    def sum_children_est_material_cost(children, batch_tasks)
      children.reduce(0.0) do |sum, e|
        if !e.have_children?(batch_tasks) && e.estimated_material_cost
          sum + e.estimated_material_cost
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
        update_parent_fields(task, parent, batch_tasks)
        parent = parent.parent(batch_tasks)
      end
    end

    def update_parent_fields(task, parent, batch_tasks)
      children = parent.children(batch_tasks)
      parent.estimated_hours = sum_children_hours(children, batch_tasks)
      parent.estimated_labor_cost = sum_children_labor_cost(children, batch_tasks)
      parent.estimated_material_cost = sum_children_est_material_cost(children, batch_tasks)

      if task.first_child? && task.depend_on.present?
        parent.start_date = task.start_date
      end
      parent.duration = decide_duration(task, parent, children)
      parent.end_date = parent.start_date + parent.duration.days
      parent.save
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

    def validate_capacity?(tasks, opt = {})
      # max_date = tasks.pluck(:end_date).compact.max
      # min_date = tasks.pluck(:start_date).compact.min
      # overlap_batch = false
      # overlap_batch_name = ''
      # Find "Phase" tasks that has changes
      phase_tasks = tasks.select do |t|
        t.phase && Constants::REQUIRED_BOOKING_PHASES.include?(t.phase)
      end

      phase_tasks.each do |t|
        args = {
          facility_id: opt[:facility_id],
          exclude_batch_id: opt[:batch_id],
          purpose: t.phase,
          start_date: t.start_date,
          end_date: t.end_date,
        }
        available_capacity = QueryAvailableCapacity.call(args).result
        if opt[:quantity] > available_capacity
          error_message = "Not enough capacity on selected dates in #{t.name}. "
          existing_plans = QueryPlannedTrays.call(t.start_date,
                                                  t.end_date,
                                                  opt[:facility_id],
                                                  opt[:batch_id]).result
          if !existing_plans.empty?
            existing_plans = existing_plans.select { |p| p.phase == t.phase }
            batch_ids = existing_plans.pluck(:batch_id).uniq
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

    def get_task(tasks, task_id)
      tasks.detect { |t| t.id == task_id.to_bson_id }
    end
  end
end
