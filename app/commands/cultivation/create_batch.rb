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
        GenerateTasksFromTemplateJob.perform_now(batch.id.to_s)
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
      batch.start_date = (Time.now + 1.days).beginning_of_day
      batch.grow_method = args[:grow_method]
      batch.quantity = args[:quantity]
      batch.batch_no = get_next_batch_no
      batch.name = batch.batch_no
      batch.current_growth_stage = Constants::CONST_CLONE
      batch.save!
      batch
    end

    def get_next_batch_no
      last_batch_no = Cultivation::Batch.last&.batch_no
      NextFacilityCode.call(:batch, last_batch_no).result
    end
  end
end
