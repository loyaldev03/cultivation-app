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
          status: 'available',
        )
      end
    end

    render json: Inventory::MetrcTagSerializer.new(saved_tags).serialized_json, status: 200
  end

  private

  def split_tags(tags)
    tags.gsub(/[\n\r]/, ',').split(',').reject { |x| x.empty? }.map(&:strip)
  end
end
