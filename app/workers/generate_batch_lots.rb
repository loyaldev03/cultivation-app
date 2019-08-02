class GenerateBatchLots
  include Sidekiq::Worker
  sidekiq_options queue: 'low'

  MAX_LOT_SIZE = 100
  METRC_DATE_FORMAT = '%Y-%m-%d'.freeze

  def perform(batch_id)
    @batch_id = batch_id
    @logger = Logger.new(STDOUT)

    if clipping_task.work_status != Constants::WORK_STATUS_DONE
      # Here we wait for the work complete before pushing to Metrc.
      # In order to push to Metrc. Each PlantBatch would needs to be
      # record together with the Mother Plant tag and total number of
      # clippings from the Mother Plant.
      @logger.debug '>>> move to clone task not done'
      return 0
    end

    if batch.batch_source == 'clones_from_mother'
      @logger.debug '>>> generate_plant_batches_by_clipping'
      generate_plant_batches_by_clipping
    else
      @logger.debug '>>> generate_plant_batches_by_lot_size'
      generate_plant_batches_by_lot_size
    end
  end

  def generate_plant_batches_by_clipping
    # Create plant batch for each mother plants' clipping.
    # PlantBatch lot size == number of clippings from each Mother Plant.
    # 1. count number of tag required (number of mother plants).
    mother_clippings = get_plant_clippings
    tag_required = mother_clippings.size
    return 0 if tag_required.zero?
    return 0 if existing_plant_batches.size == tag_required

    metrc_tags = get_metrc_tags(tag_required)

    if metrc_tags.blank? || metrc_tags.size < tag_required
      # notify manager regarding insufficient tags
      notify_insufficient_tags(tag_required)
      return 0
    end

    # 2. generate plant batches based on 1
    plant_batches = create_plantbatches_by_clippings(mother_clippings,
                                                     metrc_tags)
    plant_batches.size
  end

  def get_plant_clippings
    histories = Cultivation::PlantMovementHistory.where(
      batch_id: @batch_id,
      activity: Constants::INDELIBLE_CLIP_POT_TAG,
    )
    histories || []
  end

  def generate_plant_batches_by_lot_size
    # PlantBatch lot size == 100
    # calculate number of batch needed in group of lot size
    batch_size, last_size = batch.quantity.divmod(MAX_LOT_SIZE)

    # number of metrc required for this batch when tagging it in lot size
    tag_required = batch_size + (last_size.positive? ? 1 : 0)
    return 0 if tag_required.zero?
    return 0 if existing_plant_batches.size == tag_required

    metrc_tags = get_metrc_tags(tag_required)

    if metrc_tags.blank? || metrc_tags.size < tag_required
      # notify manager regarding insufficient tags
      notify_insufficient_tags(tag_required)
      return 0
    end

    # placeholder for all generated batches
    plant_batches = create_plantbatch_by_size(batch_size, last_size, metrc_tags)
    plant_batches.size
  end

  def get_metrc_tags(quantity)
    Inventory::QueryAvailableMetrcTags.call(
      batch.facility_id,
      quantity,
      Constants::METRC_TAG_TYPE_PLANT,
    ).result
  end

  def create_plantbatches_by_clippings(mother_clippings, metrc_tags)
    plant_batches = []
    mother_clippings.each_with_index do |c, i|
      count = c.plants.size
      if count.positive?
        metrc_tag = metrc_tags.shift(1)[0]
        plant_batches << make_plant_batch(i + 1,
                                          metrc_tag,
                                          count,
                                          c.mother_plant_code)
      end
    end

    if plant_batches.any?
      Metrc::PlantBatch.create(plant_batches)
      used_tags = plant_batches.map { |x| x[:metrc_tag] }
      # Mark tags as "assigned" in db
      Inventory::UpdateMetrcTagsAssigned.call(facility_id: batch.facility_id,
                                              metrc_tags: used_tags)
    end
    plant_batches
  end

  def create_plantbatch_by_size(batch_size, last_size, metrc_tags)
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
    if plant_batches.any?
      Metrc::PlantBatch.create(plant_batches)
      used_tags = plant_batches.map { |x| x[:metrc_tag] }
      # Mark tags as "assigned" in db
      Inventory::UpdateMetrcTagsAssigned.call(facility_id: batch.facility_id,
                                              metrc_tags: used_tags)
    end
    plant_batches
  end

  def notify_insufficient_tags(tag_required)
    managers_ids = get_facility_managers(batch)
    CreateNotificationsWorker.perform_async(
      nil,
      'insufficient_metrc_tags',
      managers_ids,
      batch.id.to_s,
      Constants::NOTIFY_TYPE_BATCH,
      "#{batch.batch_no} (#{batch.name}) requires #{tag_required} Metrc Tags",
    )
  end

  def get_facility_managers(batch)
    users = QueryUsers.call(batch.facility_id).result
    managers = users.reject { |u| u.user_mode == 'worker' }
    if managers.present?
      managers.map { |m| m.id.to_s }
    else
      []
    end
  end

  def existing_plant_batches
    @existing_plant_batches ||= Metrc::PlantBatch.where(batch_id: batch.id).to_a
  end

  def make_plant_batch(lot_no, tag, count, mother_plant_tag = nil)
    {
      batch_id: batch.id,
      lot_no: lot_no,
      metrc_tag: tag,
      count: count,
      strain: strain_name,
      plant_type: plant_type,
      actual_date: start_date,
      room: clone_room_name,
      metrc_source_plant_label: mother_plant_tag,
    }
  end

  def batch
    @batch ||= Cultivation::Batch.find(@batch_id)
  end

  def clipping_task
    @clipping_task ||= Cultivation::Task.find_by(
      batch_id: @batch_id,
      indelible: Constants::INDELIBLE_CLIP_POT_TAG,
    )
  end

  def clone_room_name
    if @clone_room_name.nil?
      rooms = QueryRoomsByBatch.call(@batch_id).result
      clone_room = rooms.detect do |r|
        r['room_purpose'] == Constants::CONST_CLONE
      end
      @clone_room_name = clone_room['room_name']
    end
    @clone_room_name
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
