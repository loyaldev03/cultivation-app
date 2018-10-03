module Cultivation
  class SetupSimpleBatch
    prepend SimpleCommand

    attr_reader :user,
      :facility_strain_id,
      :name,
      :batch_source,
      :grow_method,
      :start_date,
      :clone_duration,
      :veg_duration,
      :veg1_duration,
      :veg2_duration,
      :flower_duration,
      :harvest_duration

    def initialize(user, args)
      @user = user
      @facility_strain_id = args[:facility_strain_id]
      @name = args[:name]
      @batch_source = args[:batch_source]
      @grow_method = args[:grow_method]
      @start_date = DateTime.parse(args[:start_date])
      @clone_duration = args[:clone_duration].to_i
      @veg_duration = args[:veg_duration].to_i
      @veg1_duration = args[:veg1_duration].to_i
      @veg2_duration = args[:veg2_duration].to_i
      @flower_duration = args[:flower_duration].to_i
      @harvest_duration = args[:harvest_duration].to_i
      @curing_duration = args[:curing_duration].to_i
    end

    def call
      if valid_permission? && valid_data?
        return create_batch
      end
      nil
    end

    private

    def valid_permission?
      true
    end

    def valid_data?
      true
    end

    def create_batch
      Rails.logger.debug "\t\t>>> SetupSimpleBatch.attributes"
      Rails.logger.debug self.as_json

      facility_strain = Inventory::FacilityStrain.find facility_strain_id
      estimated_harvest_date = start_date + (clone_duration + veg_duration + veg1_duration + veg2_duration + flower_duration).days

      # Running no. By facility
      batch_no = NextFacilityCode.call(:batch, Cultivation::Batch.last.batch_no).result

      batch = Cultivation::Batch.create!(
        batch_no: batch_no,
        name: name,
        batch_source: batch_source,
        start_date: start_date,
        estimated_harvest_date: estimated_harvest_date,
        facility_strain: facility_strain,
        facility_id: facility_strain.facility_id,  # should be obsolete?
        grow_method: grow_method,
        is_active: false,
      )

      clone_end_date = add_task(batch, 'clone', start_date, clone_duration)
      veg_end_date = add_task(batch, 'veg', clone_end_date, veg_duration)
      veg1_end_date = add_task(batch, 'veg1', clone_end_date, veg1_duration)
      veg2_end_date = add_task(batch, 'veg2', veg1_end_date, veg2_duration)

      flower_start_date = [veg_end_date, veg1_end_date, veg2_end_date].compact.max
      flower_end_date = add_task(batch, 'flower', flower_start_date, flower_duration)
      harvest_end_date = add_task(batch, 'harvest', flower_end_date, harvest_duration)
      batch
    end

    def add_task(batch, phase, start_date, duration)
      # Rails.logger.debug ">>>>> [phase, start_date, duration]"
      # Rails.logger.debug [phase, start_date, duration]
      return nil if duration == 0

      task = batch.tasks.create!(
        phase: phase.upcase,
        task_category: '',
        name: '',
        duration: duration,
        start_date: start_date,
        end_date: start_date + duration.days,
        days_from_start_date: 0, # should be obsolete??
        is_phase: true,
        is_category: false,
        parent_id: nil,
        depend_on: batch.tasks.last.present? ? batch.tasks.last.id : nil,
      )

      next_start_date = start_date + duration.days
      next_start_date
    end
  end
end
