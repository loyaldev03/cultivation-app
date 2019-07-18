class GenerateBatchLots
  include Sidekiq::Worker
  sidekiq_options queue: 'low'

  MAX_LOT_SIZE = 100
  METRC_DATE_FORMAT = '%Y-%m-%d'.freeze

  def perform(batch_id)
    @batch_id = batch_id

    purge_dangling_batches

    # calculate number of batch needed in group of lot size
    batch_size, last_size = batch.quantity.divmod(MAX_LOT_SIZE)

    # number of metrc required for this batch when tagging it in lot size
    tag_required = batch_size + (last_size.positive? ? 1 : 0)
    metrc_tags = Inventory::QueryAvailableMetrcTags.call(
      batch.facility_id,
      tag_required,
      Constants::METRC_TAG_TYPE_PLANT,
    ).result

    # placeholder for all generated batches
    plant_batches = []

    # generate plant batch in lot size
    if batch_size&.positive?
      batch_size.times do |i|
        metrc_tag = metrc_tags.shift(1)[0]
        plant_batches << make_plant_batch(i + 1,
                                          metrc_tag,
                                          MAX_LOT_SIZE)
      end
    end

    # generate batch for the remainder group
    if last_size&.positive?
      metrc_tag = metrc_tags.shift(1)[0]
      plant_batches << make_plant_batch(batch_size + 1,
                                        metrc_tag,
                                        last_size)
    end

    # create plant batch record if no existing records found (check metrc_id)
    if plant_batches.present?
      Metrc::PlantBatch.create(plant_batches)
    end

    #
    # TODO: Do nothing if batch already active
    #
    plant_batches.size
  end

  def purge_dangling_batches
    Metrc::PlantBatch.where(
      batch_id: batch.id,
      metrc_id: nil,
    ).delete_all
  end

  def make_plant_batch(lot_no, tag, count)
    {
      batch_id: batch.id,
      lot_no: lot_no,
      metrc_tag: tag,
      count: count,
      strain: strain_name,
      plant_type: plant_type,
      actual_date: start_date,
    }
  end

  def batch
    @batch ||= Cultivation::Batch.find(@batch_id)
  end

  def start_date
    @start_date ||= batch.start_date.strftime(METRC_DATE_FORMAT)
  end

  def plant_type
    @plant_type ||= if batch.batch_source == 'seeds'
                      Constants::BATCH_TYPES_SEED
                    else
                      # batch_source => clones_from_mother or
                      # batch_source => clones_purchased
                      Constants::BATCH_TYPES_CLONE
                    end
  end

  def strain_name
    @strain_name ||= batch.facility_strain.strain_name
  end

  def tray_plans
    @tray_plans ||= batch.tray_plans
  end
end
