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
        if args[:template_id].present?
          batch_template = Cultivation::Batch.find(args[:template_id])
          batch = create_new_batch_from_template(args, batch_template)
          generate_task_batch_from_batch_template(batch, batch_template)
          generate_nutrient_profile_from_batch_template(batch, batch_template)
          #update batch start_date to tomorrow
          task_args = {
            id: batch.tasks.first.id,
            start_date: (Time.current + 1.days).beginning_of_day,
          }
          UpdateTask.call(@current_user, task_args, false)
          batch.estimated_harvest_date = get_harvest_date(batch.tasks)
          batch.save!
        else
          batch = create_new_batch(args)
          GenerateTasksFromTemplateJob.perform_later(batch.id.to_s)
        end
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
      batch.name = args[:name]
      batch.facility_id = args[:facility_id]
      batch.batch_source = args[:batch_source]
      batch.facility_strain_id = args[:facility_strain_id]
      # Default start_date to tomorrow
      batch.start_date = (Time.current + 1.days).beginning_of_day
      batch.grow_method = args[:grow_method]
      batch.quantity = args[:quantity]
      batch.batch_no = get_next_batch_no
      batch.save!
      batch
    end

    def create_new_batch_from_template(args, batch_template)
      batch = Cultivation::Batch.new
      batch.name = args[:name]
      batch.facility_id = batch_template.facility_id
      batch.batch_source = batch_template.batch_source
      batch.facility_strain_id = batch_template.facility_strain_id
      # Default start_date to tomorrow
      batch.start_date = (Time.current + 1.days).beginning_of_day
      batch.grow_method = batch_template.grow_method
      batch.quantity = batch_template.quantity
      batch.batch_no = get_next_batch_no
      batch.save!
      batch
    end

    def generate_task_batch_from_batch_template(batch, template_batch)
      tasks = template_batch.tasks
      new_tasks = []
      tasks.each do |task|
        new_task = task.attributes.except(:_id, :created_at, :updated_at, :batch_id, :user_ids,
                                          :estimated_labor_cost, :actual_labor_cost, :estimated_material_cost,
                                          :actual_material_cost, :actual_hours)
        new_task[:batch_id] = batch.id
        new_tasks << new_task
      end
      Cultivation::Task.create(new_tasks)
    end

    def generate_nutrient_profile_from_batch_template(batch, batch_template)
      nutrient_profiles = []
      batch_template.nutrient_profiles.each do |np|
        task = batch.tasks.find_by(phase: np.phase_name, name: np.name)
        nutrient_profile = np.attributes.except(
          :_id, :created_at, :updated_at, :task_id, :start_date, :end_date,
          :batch_id
        )
        nutrient_profile[:start_date] = task.start_date
        nutrient_profile[:end_date] = task.end_date
        nutrient_profile[:task_id] = task.id
        nutrient_profiles << nutrient_profile
      end
      batch.nutrient_profiles.create(nutrient_profiles)
    end

    def get_harvest_date(tasks)
      harvest_task = tasks.detect { |t| t[:phase] == Constants::CONST_HARVEST }
      # Incase 'harvest' phase not found, fallback to :dry then :cure
      harvest_task ||= tasks.detect { |t| t[:phase] == Constants::CONST_DRY }
      harvest_task ||= tasks.detect { |t| t[:phase] == Constants::CONST_CURE }
      harvest_task[:start_date]
    end

    def get_next_batch_no
      last_batch_no = Cultivation::Batch.last&.batch_no
      NextFacilityCode.call(:batch, last_batch_no).result
    end
  end
end
