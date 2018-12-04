module Cultivation
  class CreateBatch
    prepend SimpleCommand

    attr_reader :user, :args

    def initialize(user, args)
      @user = user
      @args = args
    end

    def call
      if valid_permission? && valid_data?
        save_record(args)
      else
        args
      end
    end

    private

    def task_templates
      template_path = 'lib/cultivation_templates/template2.json'
      JSON.parse(File.read(template_path), symbolize_names: true)
    end

    def valid_permission?
      # TODO: Add user permission check
      true
    end

    def valid_data?
      errors.add(:facility_strain_id, 'Facility strain is required.') if Inventory::FacilityStrain.find(args[:facility_strain_id]).nil?
      errors.add(:start_date, 'Start date is required.') if args[:start_date].blank?
      errors.add(:grow_method, 'Grow method is required.') if args[:grow_method].blank?
      errors.add(:batch_source, 'Batch source is required.') if args[:batch_source].blank?
      errors.add(:quantity, 'Quantity is required.') if args[:quantity].blank?
      errors.add(:facility_id, 'Facility is required.') if args[:facility_id].blank?
      errors.add(:phase_duration, 'Phase duration is required.') if args[:phase_duration].blank?
      errors.empty?
    end

    def save_record(args)
      # build a phase schedule hash
      phase_schedule = build_phase_schedule(args[:start_date],
                                            args[:phase_duration])

      batch = Cultivation::Batch.new
      batch.facility_id = args[:facility_id]
      batch.batch_source = args[:batch_source]
      batch.facility_strain_id = args[:facility_strain_id]
      batch.start_date = args[:start_date]
      # Start Day of Dry is the Harvest Date
      batch.estimated_harvest_date = phase_schedule[Constants::CONST_DRY][0]
      batch.grow_method = args[:grow_method]
      batch.quantity = args[:quantity]
      batch.batch_no = get_next_batch_no
      batch.name = batch.batch_no
      batch.current_growth_stage = Constants::CONST_CLONE
      batch.save!

      phase_id = nil
      category_id = nil
      new_tasks = []
      start_date = batch.start_date
      end_date = nil
      task_templates.each do |task|
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

      Cultivation::Task.create(new_tasks)
      batch
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
        indelible: task[:indelible] || false,
        parent_id: parent_id,
        depend_on: depend_on,
      }
      record
    end

    def set_move_task_defaults(task)
      task[:task_type] = ['move_plant']
    end

    def build_phase_schedule(start_date, phase_duration)
      b_start_date = Time.parse(start_date)

      clone_start_date = b_start_date
      clone_end_date = clone_start_date +
                       phase_duration[Constants::CONST_CLONE].to_i.days

      veg_start_date = clone_end_date + 1
      veg_end_date = veg_start_date +
                     phase_duration[Constants::CONST_VEG].to_i.days

      veg1_start_date = clone_end_date + 1
      veg1_end_date = veg1_start_date +
                      phase_duration[Constants::CONST_VEG1].to_i.days

      veg2_start_date = veg1_end_date + 1
      veg2_end_date = veg2_start_date +
                      phase_duration[Constants::CONST_VEG2].to_i.days

      flower_start_date = veg2_end_date + 1
      flower_end_date = flower_start_date +
                        phase_duration[Constants::CONST_FLOWER].to_i.days

      dry_start_date = flower_end_date + 1
      dry_end_date = dry_start_date +
                     phase_duration[Constants::CONST_DRY].to_i.days

      cure_start_date = dry_end_date + 1
      cure_end_date = cure_start_date +
                      phase_duration[Constants::CONST_CURE].to_i.days

      {
        Constants::CONST_CLONE => [clone_start_date,
                                   clone_end_date,
                                   phase_duration[Constants::CONST_CLONE].to_i],
        Constants::CONST_VEG => [veg_start_date,
                                 veg_end_date,
                                 phase_duration[Constants::CONST_VEG].to_i],
        Constants::CONST_VEG1 => [veg1_start_date,
                                  veg1_end_date,
                                  phase_duration[Constants::CONST_VEG1].to_i],
        Constants::CONST_VEG2 => [veg2_start_date,
                                  veg2_end_date,
                                  phase_duration[Constants::CONST_VEG2].to_i],
        Constants::CONST_FLOWER => [flower_start_date,
                                    flower_end_date,
                                    phase_duration[Constants::CONST_FLOWER].to_i],
        Constants::CONST_DRY => [dry_start_date,
                                 dry_end_date,
                                 phase_duration[Constants::CONST_DRY].to_i],
        Constants::CONST_CURE => [cure_start_date,
                                  cure_end_date,
                                  phase_duration[Constants::CONST_CURE].to_i],
      }
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
        parent_id = nil
      elsif task[:is_category]
        # Category task
        parent_id = phase_id
      else
        # Normal task
        parent_id = category_id
        parent_id ||= phase_id
      end
    end

    # For Phase task, depend_on is the other phase (if any prior phase)
    # For Category task, depend_on is the sibling category under the same phase
    # For Normal task, there is no depend_on
    def get_depend_on(task, phase_id, category_id)
      if task[:is_phase]
        # Phase task
        depend_on = phase_id
      elsif task[:is_category]
        # Category task
        depend_on = category_id
      else
        # Normal Task
        depend_on = nil
      end
    end
  end
end

# phase(parent) is depending on other phase(parent)
# if start_date of parent change, child will change
# parallel task only depend on parent

#Phase has many category
#Category has many children task
#Some task depend on other task
#If some children task extend or reduce duration, it will affect category date, will affect other date too
