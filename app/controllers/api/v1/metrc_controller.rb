class Api::V1::MetrcController < Api::V1::BaseApiController
  def index
    # tags = Inventory::MetrcTag.where(facility_id: params[:facility_id])
    # render json: Inventory::MetrcTagSerializer.new(tags).serialized_json, status: 200
    query_cmd = Inventory::QueryMetrcs.call(
      facility_id: params[:facility_id],
      page: params[:page],
      limit: params[:limit],
      search: params[:search],
    )

    if query_cmd.success?
      result = query_cmd.result
      render json: {
        data: result['data'].map { |x|
          {
            "id": x['_id'].to_s,
            "tag": x['tag'],
            "tag_type": x['tag_type'],
            "status": x['status'],
            "u_at": x['u_at'],
            "reported_to_metrc": x['reported_to_metrc'],
          }
        }.as_json,
        metadata: query_cmd.metadata.as_json,
      }
    else
      render json: {errors: query_cmd.errors}
    end
  end

  def update_metrc_disposed
    metrc = Inventory::MetrcTag.find(params[:metrc_id].to_s)
    if metrc.reported_to_metrc == false && metrc.status == 'available'
      metrc.update(status: Constants::METRC_TAG_STATUS_DISPOSED)
    end
  end

  def update_metrc_reported
    metrc = Inventory::MetrcTag.find(params[:metrc_id].to_s)
    if metrc.reported_to_metrc == false && metrc.status == 'disposed'
      metrc.update(reported_to_metrc: true)
    end
    redirect_to inventory_metrc_index_path
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

  def generate_plant_batches
    batch_id = params[:batch_id]
    GenerateBatchLots.perform_async(batch_id)
    render json: {status: 'ok'}, status: 200
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
