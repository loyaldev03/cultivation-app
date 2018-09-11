module Inventory
  class CreatePlants
    prepend SimpleCommand

    attr_reader :plant_ids,
      :strain_name,
      :location_id,
      :location_type,
      :planted_on,
      :plant_status,
      :mother_plant_id,
      :expected_harvested_on,
      :cultivation_batch_id,
      :planted_on,
      :status,
      :facility

    def initialize(plant_ids: [],
                   strain_name:,
                   location_id:,
                   location_type:,
                   status: 'available',
                   planted_on: nil,
                   plant_status:,
                   mother_plant_id: nil,
                   expected_harvested_on: nil,
                   cultivation_batch_id: nil)
      @plant_ids = plant_ids
      @strain_name = strain_name
      @location_id = location_id
      @location_type = location_type
      @planted_on = planted_on
      @plant_status = plant_status
      @mother_plant_id = mother_plant_id
      @expected_harvested_on = expected_harvested_on
      @planted_on = planted_on
      @status = status
      @cultivation_batch_id = cultivation_batch_id
    end

    def call
      @facility = get_facility
      can_save = (status == 'draft' || valid?)

      if can_save
        item = create_item!
        batch = create_batch!
        plants = create_articles_for_plants!(item, status: status, batch: batch)
        plants
      end
    end

    private

    def create_item!
      strain = Common::Strain.find_by(name: strain_name)
      inventory = Inventory::Item.find_or_create_by!(
        strain: strain,
        item_type: 'plant',
        facility: facility,
      ) do |t|
        t.name = strain.name
        t.has_serial_no = false
      end
      inventory
    end

    def get_facility
      case location_type
      when 'room'
        Facility.find_by(:'rooms._id' => BSON::ObjectId(location_id))
      when 'facility'
        Facility.find(location_id)
      when 'tray'
        tray = Tray.find(location_id)
        Facility.find_by(:'rooms.rows.shelves._id' => tray.shelf_id)
      else
        raise 'Unrecognized @location_type'
      end
    end

    def create_batch!
      Rails.logger.debug ">>>>> cultivation_batch_id: #{cultivation_batch_id}"
      return nil if cultivation_batch_id.nil?

      batch = Cultivation::Batch.find_or_create_by!(
        batch_no: cultivation_batch_id,
        strain: strain_name,
        facility: facility,
      ) do |b|
        b.name = 'Batch from Plant Setup'
      end
      batch
    end

    # TODO: Maybe should pass in the batch ID
    def create_articles_for_plants!(item, status: 'draft', batch: nil)
      plants = []
      plant_ids.each do |plant_id|
        plant = Inventory::ItemArticle.find_or_initialize_by(
          serial_no: plant_id.strip,
          strain: item.strain,
          item: item,
        ) do |t|
          t.plant_status = plant_status
          t.location_id = location_id
          t.location_type = location_type
          t.facility = item.facility
          t.status = status
          t.mother_plant_id = mother_plant_id
          t.expected_harvested_on = nil
          t.planted_on = planted_on
          t.cultivation_batch = batch.id unless batch.nil?
        end

        unless plant.persisted? # Create plants that is not in the system only. Do not override existing
          plant.save!                 # ones as they may already associated to another batch.
          plants << plant
        end
      end

      plants
    end

    def valid?
      raise 'Location type is required.' if location_type.nil?
      raise 'Status is required.' if status.nil?
      raise 'Plant_status is required' if plant_status.nil?

      errors.add(:plant_ids, 'Plant IDs are required') if plant_ids.empty?
      errors.add(:strain_name, 'Strain is required') if strain_name.empty?
      errors.add(:location_id, 'Plant location is required') if location_id.nil?
      errors.add(:planted_on, 'Planted on date is required') if planted_on.nil?
      errors.empty?
    end
  end
end
