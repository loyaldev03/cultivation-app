# Reference:
# :created_by,
# :cultivation_batch,
# :facility_strain,
# :plant_id,                  # type: String
# :plant_tag,                 # type: String
# :location_id,               # type: BSON::ObjectId
# :location_type,             # type: String
# :status,                    # type: String
# :current_growth_stage,      # type: String
# :mother_date,               # type: DateTime
# :planting_date,             # type: DateTime
# :veg_date,                  # type: DateTime
# :veg1_date,                 # type: DateTime
# :veg2_date,                 # type: DateTime
# :flower_date,               # type: DateTime
# :harvest_date,              # type: DateTime
# :expected_harvest_date,     # type: DateTime
# :destroyed_date,            # type: DateTime
# :origin_id,                 # type: BSON::ObjectId
# :origin_type,               # type: String
# :wet_weight,                # type: BigDecimal
# :wet_weight_unit,           # type: String
# :purchase_info_id,          # type: BSON::ObjectId
# :last_metrc_update,         # type: DateTime

module Inventory
  class CreatePlants
    prepend SimpleCommand

    # attr_reader :created_by,
    #   :cultivation_batch_id,
    #   :facility_strain_id,
    #   :plant_ids,
    #   :location_id,
    #   :location_type,
    #   :status,
    #   :current_growth_stage,
    #   :mother_date,
    #   :planting_date,
    #   :veg_date,
    #   :veg1_date,
    #   :veg2_date,
    #   :flower_date,
    #   :harvest_date,
    #   :expected_harvest_date,
    #   :destroyed_date,
    #   :origin_id,
    #   :origin_type,
    #   :wet_weight,
    #   :wet_weight_unit,
    #   :purchase_info_id

    # def initialize()
    #   # created_by:,
    #   # cultivation_batch_id:,
    #   # facility_strain_id:,
    #   # plant_ids: [],
    #   # location_id:,
    #   # location_type:,
    #   # status: 'available',
    #   # current_growth_stage:,
    #   # mother_date:,
    #   # planting_date:,
    #   # veg_date:,
    #   # veg1_date:,
    #   # veg2_date:,
    #   # flower_date:,
    #   # harvest_date:,
    #   # expected_harvest_date:,
    #   # destroyed_date:,
    #   # origin_id:,
    #   # origin_type:,
    #   # wet_weight:,
    #   # wet_weight_unit:,
    #   # purchase_info_id:)

    #   @created_by = created_by
    #   @cultivation_batch_id = cultivation_batch_id
    #   @facility_strain_id = facility_strain_id
    #   @plant_ids: plant_ids
    #   @location_id = location_id
    #   @location_type = location_type
    #   @status = available
    #   @current_growth_stage = current_growth_stage
    #   @mother_date = mother_date
    #   @planting_date = planting_date
    #   @veg_date = veg_date
    #   @veg1_date = veg1_date
    #   @veg2_date = veg2_date
    #   @flower_date = flower_date
    #   @harvest_date = harvest_date
    #   @expected_harvest_date = expected_harvest_date
    #   @destroyed_date = destroyed_date
    #   @origin_id = origin_id
    #   @origin_type = origin_type
    #   @wet_weight = wet_weight
    #   @wet_weight_unit = wet_weight_unit
    #   @purchase_info_id = purchase_info_id
    # end

    def call
      # if status == 'draft' || valid?
      #   if is_harvest?(plant_status)
      #     plants = create_harvest_yield!(item, status: status, batch: batch)
      #     plants
      #   else
      #     plants = create_articles_for_plants!(item, status: status, batch: batch)
      #     plants
      #   end
      # end
    end

    private

    # def create_harvest_yield!(item, status: 'draft', batch: nil)
    #   harvest_yield = Inventory::ItemArticle.create!(
    #     serial_no: plant_ids.first,
    #     strain: item.strain,
    #     item: item,
    #     plant_status: plant_status,
    #     location_id: location_id,
    #     location_type: location_type,
    #     facility: item.facility,
    #     status: status,
    #     mother_plant_id: mother_plant_id,
    #     expected_harvested_on: nil,
    #     planted_on: planted_on,
    #     cultivation_batch: batch.nil? ? nil : batch.id,
    #     weight: weight,
    #     weight_type: weight_type,
    #     weight_unit: weight_unit,
    #   )

    #   harvest_yield.save!
    #   harvest_yield
    # end

    # def create_item!
    #   strain = Common::Strain.find_by(name: strain_name)
    #   inventory = Inventory::Item.find_or_create_by!(
    #     strain: strain,
    #     item_type: 'plant',
    #     facility: facility,
    #   ) do |t|
    #     t.name = strain.name
    #     t.has_serial_no = false
    #   end
    #   inventory
    # end

    # # TODO: Maybe should pass in the batch ID
    # def create_articles_for_plants!(item, status: 'draft', batch: nil)
    #   plants = []
    #   plant_ids.each do |plant_id|
    #     plant = Inventory::ItemArticle.find_or_initialize_by(
    #       serial_no: plant_id.strip,
    #       strain: item.strain,
    #       item: item,
    #       plant_status: plant_status,
    #     ) do |t|
    #       t.location_id = location_id
    #       t.location_type = location_type
    #       t.facility = item.facility
    #       t.status = status
    #       t.mother_plant_id = mother_plant_id
    #       t.expected_harvested_on = nil
    #       t.planted_on = planted_on
    #       t.cultivation_batch = batch.id unless batch.nil?
    #     end

    #     unless plant.persisted? # Create plants that is not in the system only. Do not override existing
    #       plant.save!                 # ones as they may already associated to another batch.
    #       plants << plant
    #     end
    #   end

    #   plants
    # end

    # def valid?
    #   raise 'Location type is required.' if location_type.nil?
    #   raise 'Status is required.' if status.nil?
    #   raise 'Plant_status is required' if plant_status.nil?

    #   errors.add(:plant_ids, 'Plant IDs are required') if plant_ids.empty?
    #   errors.add(:strain_name, 'Strain is required') if strain_name.empty?
    #   errors.add(:location_id, 'Plant location is required') if location_id.nil?
    #   errors.add(:planted_on, 'Planted on date is required') if planted_on.nil? && !is_harvest?(plant_status)
    #   errors.empty?
    # end

    # def is_harvest?(plant_status)
    #   %w(flower shakes trim waste wet other).include?(plant_status)
    # end
  end
end
