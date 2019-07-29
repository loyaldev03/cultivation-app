class MetrcDownloadPlantsFlower
  include Sidekiq::Worker
  sidekiq_options queue: 'low'

  def perform
    @logger = Logger.new(STDOUT)
    # Overview of the logic flow
    # Get list of facilities from api
    # Update facility info in db 1 by 1
    local_facilities = Facility.all.to_a

    # Only update facility records that exists in the local database
    local_facilities.each do |f|
      metrc_rec = get_metrc_facility_by_license(f.site_license)
      # if a Facility exists on both local database and on metrc
      # we download all the plants (flowers) from metrc.
      if metrc_rec
        # download flowers from metrc facility f
        flowers = MetrcApi.get_plants_flowering(f.site_license)
        flowers.each do |flower|
          # e.g. Plant Batch name: 1A4FF0000000022000001594
          db_batch = Metrc::PlantBatch.find_by(
            metrc_tag: flower['PlantBatchName'],
          )
          if db_batch.nil?
            # if plant batch not download, download it now
            metrc_batch = MetrcApi.get_plant_batches_info(
              f.site_license,
              flower['PlantBatchId'],
            )
            update_or_create_plantbatch(metrc_batch) if metrc_batch
          end
          # Parse Metrc Plant Hash into Inventory::Plant
          # parse plant hash into plant model and save
          update_or_create_plant(f, flower)
        end
      end
    end

    true
  end

  private

  def local_facilities
    @local_facilities ||= Facility.all.to_a
  end

  def metrc_facilities
    @metrc_facilities ||= MetrcApi.get_facilities
  end

  def update_or_create_plant(facility, metrc_plant)
    plant = Inventory::Plant.find_or_create_by(
      plant_tag: metrc_plant['Label'],
    )
    plant.plant_id ||= metrc_plant['Label']
    plant.facility_strain = get_facility_strain(facility.id,
                                                metrc_plant['StrainId'])
    plant.metrc_id = metrc_plant['Id']
    plant.metrc_state = metrc_plant['State']
    plant.metrc_growth_phase = metrc_plant['GrowthPhase']
    plant.plant_batch_id = metrc_plant['PlantBatchId']
    plant.plant_batch_name = metrc_plant['PlantBatchName']
    plant.metrc_strain_name = metrc_plant['StrainName']
    plant.metrc_room_name = metrc_plant['RoomName']
    plant.metrc_harvest_id = metrc_plant['HarvestId']
    plant.metrc_harvest_count = metrc_plant['HarvestCount']
    plant.metrc_harvest_uom = metrc_plant['HarvestedUnitOfWeightName']
    plant.metrc_harvest_uom_abbr = metrc_plant['HarvestedUnitOfWeightAbbreviation']
    plant.metrc_harvest_wet_weight = metrc_plant['HarvestedWetWeight']
    plant.metrc_is_on_hold = metrc_plant['IsOnHold']
    plant.metrc_planted_date = metrc_plant['PlantedDate']
    plant.metrc_veg_date = metrc_plant['VegetativeDate']
    plant.metrc_flower_date = metrc_plant['FloweringDate']
    plant.metrc_harvested_date = metrc_plant['HarvestedDate']
    plant.metrc_destroyed_date = metrc_plant['DestroyedDate']
    plant.last_metrc_update = Time.zone.parse(metrc_plant['LastModified'])
    plant.save!
  end

  def update_or_create_plantbatch(metrc_batch)
    batch = Metrc::PlantBatch.find_or_create_by(
      metrc_tag: metrc_batch['Name'],
      strain: metrc_batch['StrainName'],
      metrc_strain_id: metrc_batch['StrainId'],
    )
    batch.metrc_id = metrc_batch['Id']
    batch.plant_type = metrc_batch['Type']
    batch.room = metrc_batch['Room Name']
    batch.metrc_untracked_count = metrc_batch['UntrackedCount']
    batch.metrc_tracked_count = metrc_batch['TrackedCount']
    batch.count = metrc_batch['Count']
    batch.metrc_live_count = metrc_batch['LiveCount']
    batch.save!
  end

  def get_metrc_facility_by_license(lic)
    metrc_facilities.detect do |f|
      f.dig('License', 'Number') == lic
    end
  end

  def get_facility_strain(facility_id, strain_id)
    fas_strain = Inventory::FacilityStrain.find_by(
      facility_id: facility_id,
      metrc_id: strain_id,
    )
    if fas_strain.nil?
      MetrcUpdateStrainsWorker.new.perform(facility_id.to_s, strain_id)
      fas_strain = Inventory::FacilityStrain.find_by(
        facility_id: facility_id,
        metrc_id: strain_id,
      )
    end
    fas_strain
  end
end
