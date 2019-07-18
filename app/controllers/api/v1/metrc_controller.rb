class Api::V1::MetrcController < Api::V1::BaseApiController
  def index
    tags = Inventory::MetrcTag.where(facility_id: params[:facility_id])
    render json: Inventory::MetrcTagSerializer.new(tags).serialized_json, status: 200
  end

  def bulk_create
    input_tags = params[:metrcs]
    tags = split_tags(input_tags)
    tag_type = params[:tag_type]
    saved_tags = []

    tags.each do |tag|
      unless Inventory::MetrcTag.find_by(facility_id: params[:facility_id], tag: tag)
        saved_tags << Inventory::MetrcTag.create!(
          facility_id: params[:facility_id].to_bson_id,
          tag: tag,
          tag_type: tag_type,
          status: Constants::METRC_TAG_STATUS_AVAILABLE,
        )
      end
    end

    render json: Inventory::MetrcTagSerializer.new(saved_tags).serialized_json, status: 200
  end

  def verify
    facility = Facility.find(params[:facility_id])
    tag = facility.metrc_tags.find_by(tag: params[:tag])

    # if valid_tag?(tag)
    #   batch = Cultivation::Batch.find ''
    #   hb = batch.harvest_batch.first
    #   package_type = params[:package_type]
    #   product_type = params[:product_type]

    #   Inventory::ItemTransaction.create!(
    #     harvest_batch: hb,
    #     package_tag: tag,
    #     order_uom: package_type,
    #     catalogue: Inventory::Catalogue.find_by(label: product_type),
    #     facility_strain: batch.facility_strain
    #   )
    # end

    if tag.nil?
      render json: {errors: ['METRC tag not exists']}, status: 422
    elsif tag.status == Constants::METRC_TAG_STATUS_ASSIGNED
      render json: {errors: ['METRC tag already assigend']}, status: 422
    elsif tag.status != Constants::METRC_TAG_STATUS_AVAILABLE
      render json: {errors: ['METRC tag not available/ disposed']}, status: 422
    else
      render json: {tag: tag.tag}, status: 200
    end
  end

  def plant_batches
    batch_id = params[:batch_id]
    batches = Metrc::PlantBatch.where(batch_id: batch_id)
    render json: MetrcPlantBatchSerializer.
             new(batches).
             serialized_json
  end

  private

  def split_tags(tags)
    tags.gsub(/[\n\r]/, ',').split(',').reject { |x| x.empty? }.map(&:strip)
  end
end
