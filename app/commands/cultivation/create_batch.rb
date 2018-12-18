module Cultivation
  class CreateBatch
    prepend SimpleCommand

    attr_reader :args

    def initialize(current_user, args)
      @current_user = current_user
      @args = args
    end

    def call
      if valid_permission? && valid_data?
        batch = create_new_batch(args)
        create_tasks_from_template(batch, get_tasks_from_template)
        batch
      else
        args
      end
    end

    private

    def valid_permission?
      # TODO: Add current_user permission check
      true
    end

    def valid_data?
      if Inventory::FacilityStrain.find(args[:facility_strain_id]).nil?
        errors.add(:facility_strain_id, 'Facility strain is required.')
      end
      if args[:grow_method].blank?
        errors.add(:grow_method, 'Grow method is required.')
      end
      if args[:batch_source].blank?
        errors.add(:batch_source, 'Batch source is required.')
      end
      if args[:facility_id].blank?
        errors.add(:facility_id, 'Facility is required.')
      end
      errors.empty?
    end

    def create_new_batch(args)
      batch = Cultivation::Batch.new
      batch.facility_id = args[:facility_id]
      batch.batch_source = args[:batch_source]
      batch.facility_strain_id = args[:facility_strain_id]
      # Default start_date to tomorrow
      batch.start_date = Time.now + 1.days
      batch.grow_method = args[:grow_method]
      batch.quantity = args[:quantity]
      batch.batch_no = get_next_batch_no
      batch.name = batch.batch_no
      batch.current_growth_stage = Constants::CONST_CLONE
      batch.save!
      batch
    end

    def create_tasks_from_template(batch, template_tasks)
      # Temporary variables
      phase_id = nil
      category_id = nil
      new_tasks = []
      start_date = batch.start_date
      end_date = nil

      # Loop through each task from template
      template_tasks.each do |task|
        new_task_id = BSON::ObjectId.new
        new_task = build_task(new_task_id,
                              batch,
                              start_date,
                              end_date,
                              task,
                              phase_id,
                              category_id)
        # Set a default task_type for Moving Plants task
        if new_task[:name].start_with?('Move Plants')
          set_move_task_defaults(new_task)
        end
        # Collect all new tasks in an array
        new_tasks << new_task
        # Set the fields data for the next task in the template
        if task[:is_phase]
          phase_id = new_task_id
          category_id = nil
          start_date = new_task[:start_date]
          end_date = new_task[:end_date]
        elsif task[:is_category]
          category_id = new_task_id
        end
      end

      # TODO: Use insert_many to create multiple task with a single db call.
      # But this only works with auto-generated ObjectId
      # E.g. Cultivation::Task.collection.insert_many(new_tasks)
      Cultivation::Task.create(new_tasks)

      batch.estimated_harvest_date = get_harvest_date(new_tasks, start_date)
      batch.save!
      batch
    end

    def get_tasks_from_template
      template_path = 'lib/cultivation_templates/template2.json'
      JSON.parse(File.read(template_path), symbolize_names: true)
    end

    def build_task(task_id, batch, phase_start_date, phase_end_date, task, phase_id, category_id)
      raise ArgumentError, 'start_date is required' if phase_start_date.nil?
      parent_id = get_parent_id(task, phase_id, category_id)
      depend_on = get_depend_on(task, phase_id, category_id)
      duration = task[:duration]&.to_i || 1
      task_start_date = if task[:is_phase]
                          phase_end_date || phase_start_date
                        else
                          phase_start_date
                        end
      end_date = task_start_date + (duration - 1).days
      record = {
        id: task_id,
        batch_id: batch.id,
        phase: task[:phase],
        task_category: task[:task_category],
        name: task[:name],
        duration: duration,
        start_date: task_start_date,
        end_date: end_date,
        days_from_start_date: task[:days_from_start_date],
        estimated_hours: task[:estimated_hours],
        is_phase: task[:is_phase] || false,
        is_category: task[:is_category] || false,
        is_growing_period: task[:is_growing_period] || false,
        is_unbound: task[:is_unbound] || false,
        indelible: task[:indelible] || false,
        parent_id: parent_id,
        depend_on: depend_on,
      }
      record
    end

    def get_harvest_date(tasks, fallback_date)
      harvest_task = tasks.detect do |t|
        t[:is_phase] && t[:phase] == Constants::CONST_HARVEST
      end
      # Incase 'harvest' phase not found, try dry, then cure
      harvest_task ||= tasks.detect do |t|
        t[:is_phase] && t[:phase] == Constants::CONST_DRY
      end
      harvest_task ||= tasks.detect do |t|
        t[:is_phase] && t[:phase] == Constants::CONST_CURE
      end
      harvest_task[:start_date] || fallback_date
    end

    def set_move_task_defaults(task)
      task[:task_type] = ['move_plant']
    end

    def get_next_batch_no
      last_batch_no = Cultivation::Batch.last&.batch_no
      NextFacilityCode.call(:batch, last_batch_no).result
    end

    # For Phase task, parent_id is nil
    # For Category task, parent_id is the phase
    # For Normal task, parent_id is either the category or the phase
    def get_parent_id(task, phase_id, category_id)
      if task[:is_phase]
        # Phase task
        nil
      elsif task[:is_category]
        # Category task
        phase_id
      else
        # Normal task
        category_id || phase_id
      end
    end

    # For Phase task, depend_on is the other phase (if any prior phase)
    # For Category task, depend_on is the sibling category under the same phase
    # For Normal task, there is no depend_on
    def get_depend_on(task, phase_id, category_id)
      if task[:is_phase]
        # Phase task
        phase_id
      elsif task[:is_category]
        # Category task
        category_id
      end
    end
  end
end
