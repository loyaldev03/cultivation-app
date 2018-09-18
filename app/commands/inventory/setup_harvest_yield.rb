# cultivation_batch_id: "aasa"
# harvested_on: "2018-08-27T16:00:00.000Z"
# location_id: "5b9a5cd0edfdb2221dbf4578"
# mother_id: "5b967591edfdb2f2b29540c1"
# strain: "101OG"
# strain_type: "sativa"
# weight: "10"
# weight_type: "dry"
# weight_unit: "g"
# yield_type: "flower"

module Inventory
  class SetupHarvestYield
    prepend SimpleCommand
    attr_reader :user,
      :args,
      :cultivation_batch_id,
      :harvested_on,
      :location_id,
      :mother_id,
      :strain,
      :strain_type,
      :weight,
      :weight_type,
      :weight_unit,
      :yield_type

    def initialize(user, args)
      @args = args
      @user = user

      @cultivation_batch_id = args[:cultivation_batch_id]
      @harvested_on = args[:harvested_on]
      @location_id = args[:location_id]
      @mother_id = args[:mother_id]
      @strain = args[:strain]
      @strain_type = args[:strain_type]
      @weight = args[:weight].to_i
      @weight_type = args[:weight_type]
      @weight_unit = args[:weight_unit]
      @yield_type = args[:yield_type]
    end

    def call()
      if valid_permission? && valid_data?
        Rails.logger.debug '>>>> SetupHarvestYield after validation'
        harvest_yield = create_harvest_yield

        Rails.logger.debug ">>>> harvest_yield: #{harvest_yield}"
        update_plant_to_dry(harvest_yield)
        return harvest_yield
      end

      Rails.logger.debug ">>>> valid_permission?: #{valid_permission?}"
      Rails.logger.debug ">>>> valid_data?: #{valid_data?}"
      Rails.logger.debug '>>>> SetupHarvestYield errors'
      Rails.logger.debug errors
      nil
    end

    def valid_permission?
      true
    end

    def valid_data?
      # check mother, location_id & batch id are in the same facility
      mother = Inventory::ItemArticle.find(mother_id)
      mother_facility = get_facility_from_room(mother.location_id)
      plant_facility = get_facility_from_tray(location_id)

      if mother_facility.present? && plant_facility.present? && mother_facility != plant_facility
        errors.add(:mother_id, 'Mother plant & harvest must be at the same facility.')
      end

      validate_cultivation_batch_id(mother_facility, plant_facility, strain)

      # weight is valid
      if weight <= 0
        errors.add(:weight, 'Weight must be more than zero.')
      end

      # weight type, unit, yield type are valid
      if !%w(wet dry).include? weight_type
        errors.add(:weight_type, 'Invalid wet type')
      end

      errors.empty?
    end

    def create_harvest_yield
      source_plant = Inventory::ItemArticle.find(mother_id)
      command = Inventory::CreatePlants.call(
        status: 'available',
        plant_ids: [source_plant.serial_no],
        strain_name: strain,
        location_id: location_id,
        location_type: 'tray',
        planted_on: nil,
        expected_harvested_on: nil,
        plant_status: yield_type,
        cultivation_batch_id: cultivation_batch_id,
        weight: weight,
        weight_type: weight_type,
        weight_unit: weight_unit,
        harvested_on: harvested_on,
      )

      if command.success?
        result = command.result
        Rails.logger.debug 'CreatePlant for harvest yield...'
        Rails.logger.debug result
        result
      else
        Rails.logger.debug "\t\t>>>>  CreatePlant for errors: #{command.errors}"
        combine_errors(command.errors, :plant_ids, :veg_ids)
        combine_errors(command.errors, :strain_name, :strain_name)
        combine_errors(command.errors, :location_id, :clone_ids)  # there is no field to host tray id errors, i just park all under clone_ids
        nil
      end
    end

    def update_plant_to_dry(harvest_yield)
      # Find flower plant and update status to harvested
    end

    private

    def get_facility_from_room(room_id)
      Facility.find_by('rooms._id': room_id)
    end

    def get_facility_from_tray(tray_id)
      tray = Tray.find(tray_id)
      Facility.find_by('rooms.rows.shelves._id': tray.shelf_id)
    end

    def validate_cultivation_batch_id(mother_facility, plant_facility, strain)
      batch = Cultivation::Batch.find_by(batch_no: cultivation_batch_id)
      return if batch.nil?

      _strain = Common::Strain.find_by(name: strain)
      Rails.logger.debug "\t\t>>>>  _strain: #{_strain}"
      Rails.logger.debug "\t\t>>>>  batch.strain: #{batch.strain}, cultivation_batch_id: #{cultivation_batch_id}"

      if batch.strain != _strain
        errors.add(:cultivation_batch_id, 'Batch and strain must be the same strain.')
      end

      Rails.logger.debug "\t\t>>>>  batch.strain: #{batch.strain}, cultivation_batch_id: #{cultivation_batch_id}"
      if batch.facility != plant_facility
        errors.add(:cultivation_batch_id, 'Batch and harvest yield location must be at the same facility.')
      end
    end

    def combine_errors(errors_source, from_field, to_field)
      errors.add(to_field, errors_source[from_field]) if errors_source.key?(from_field)
    end
  end
end
