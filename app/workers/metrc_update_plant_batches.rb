class MetrcUpdatePlantBatches
  include Sidekiq::Worker
  sidekiq_options queue: 'low'

  # Overview of the logic flow
  # - Get list of Plant Batch from METRC (1)
  # - Get list of Plant Batch from db (2)
  #
  # Compare both array and:
  # - when found new record in db (2)
  #   - create Plant Batch in METRC
  #   - download Active Batch from METRC
  # - when found existing db record that exists in API
  #   - update the quantity on METRC (check if this is posible)
  #    - update metrc_id to PlantBatch record in db
  # - mark metrc tag as "reported" in database.
  def perform(batch_id)
    @batch_id = batch_id
    @logger = Logger.new(STDOUT)
    # Only trigger logic if batch is already active.
    if batch.status == Constants::BATCH_STATUS_ACTIVE
      m_batches = MetrcApi.get_plant_batches(facility.site_license) # Hash format
      c_batches = Metrc::PlantBatch.where(batch_id: batch.id).to_a  # Ruby object

      # Find new plant batches that need to be push to metrc
      new_batches = get_new_batches_tags(m_batches, c_batches)

      # Create new Plant Batch on Metrc
      @logger.debug "create_plant_batches_on_metrc"
      create_plant_batches_on_metrc(new_batches, c_batches)

      # Save metrc_id from Metrc to database
      @logger.debug "update_plant_batches_metrc_ids"
      update_plant_batches_metrc_ids(c_batches)

      # Mark metrc tags as reported to metrc
      @logger.debug "mark local metrc tags as reported"
      if new_batches.any?
        Inventory::UpdateMetrcTagsReported.call(facility_id: facility.id,
                                                metrc_tags: new_batches)
      else
        batch_tags = c_batches.map(&:metrc_tag)
        Inventory::UpdateMetrcTagsReported.call(facility_id: facility.id,
                                                metrc_tags: batch_tags)
      end

      true
    end
  rescue RestClient::ExceptionWithResponse => e
    logger.debug e
    logger.error JSON.parse(e.response.body)
    raise
  end

  private

  def update_plant_batches_metrc_ids(db_batches)
    if db_batches.any?
      metrc_batches = MetrcApi.get_plant_batches(facility.site_license) # Hash format
      db_batches.each do |plant_batch|
        found = metrc_batches.detect do |i|
          i['Name'].casecmp(plant_batch.metrc_tag).zero?
        end
        if found.present?
          plant_batch.metrc_id = found['Id']
          plant_batch.metrc_strain_id = found['StrainId']
          plant_batch.metrc_tracked_count = found['TrackedCount']
          plant_batch.metrc_untracked_count = found['UntrackedCount']
          plant_batch.metrc_packaged_count = found['PackagedCount']
          plant_batch.metrc_harvested_count = found['HarvestedCount']
          plant_batch.metrc_destroyed_count = found['DestroyedCount']
          plant_batch.metrc_source_package_id = found['SourcePackageId']
          plant_batch.metrc_source_package_label = found['SourcePackageLabel']
          plant_batch.metrc_source_plant_id = found['SourcePlantId']
          plant_batch.metrc_source_plant_label = found['SourcePlantLabel']
          plant_batch.save
        end
      end
    end
  end

  def create_plant_batches_on_metrc(new_batches, db_batches)
    if new_batches.any?
      params = []
      plantbatch_source = ""
      new_batches.each do |metrc_tag|
        found = db_batches.detect { |i| i.metrc_tag == metrc_tag }
        # Only create new Metrc Plant Batch if metrc_id not found
        if found&.metrc_id.nil?
          if found.metrc_source_plant_label.present?
            plantbatch_source = "clipping"
            params << generate_plant_plantings_params(found)
          else
            plantbatch_source = "none"
            params << generate_batch_plantings_params(found)
          end
        end
      end
      # Create all plant batches in Metrc with a single api call
      if params.any? && plantbatch_source == "none"
        @logger.debug "create_batch_plantings"
        MetrcApi.create_batch_plantings(facility.site_license, params)
      elsif params.any? && plantbatch_source == "clipping"
        @logger.debug "create_plant_plantings"
        MetrcApi.create_plant_plantings(facility.site_license, params)
      end
    end
  end

  def generate_plant_plantings_params(plantbatch)
    {
      "PlantLabel": plantbatch.metrc_source_plant_label,
      "PlantBatchName": plantbatch.metrc_tag,
      "PlantBatchType": "Clone",
      "PlantCount": plantbatch.count,
      "StrainName": plantbatch.strain,
      "RoomName": plantbatch.room,
      "ActualDate": plantbatch.actual_date,
    }
  end

  def generate_batch_plantings_params(plantbatch)
    {
      "Name": plantbatch.metrc_tag,
      "Type": plantbatch.plant_type,
      "Count": plantbatch.count,
      "Strain": plantbatch.strain,
      "Room": plantbatch.room,
      "ActualDate": plantbatch.actual_date,
    }
  end

  def get_new_batches_tags(metrc_batches, db_batches = [])
    metrc_batch_names = metrc_batches.map { |x| x['Name'] }
    new_batches = []
    db_batches.each do |plant_batch|
      if !metrc_batch_names.include?(plant_batch.metrc_tag) &&
         plant_batch.metrc_id.nil?
        # remember this new plant batch so it can be push to metrc
        new_batches << plant_batch.metrc_tag
      end
    end
    new_batches
  end

  def batch
    @batch ||= Cultivation::Batch.find(@batch_id)
  end

  def facility
    @facility ||= @batch.facility
  end
end
