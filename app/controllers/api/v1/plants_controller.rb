class Api::V1::PlantsController < Api::V1::BaseApiController
  def index
    Rails.logger.debug "\t\t\t >>> request.cookies.count: #{request.cookies.count}"

    # Need to revise to follow plants method below
    render json: [{data: Inventory::Item.where(storage_type: ['seed', 'mother', 'clone'])}]
  end

  def strains
    result = []
    if params[:filter].present?
      filter = params[:filter]
      result = Common::Strain.where(:name => /^#{filter}/i).limit(7).to_a
    else
      result = Common::Strain.all.asc(:name).limit(7).to_a
    end

    result = result.map { |x| {name: x.name, strain_type: x.strain_type} }  # to be replaced with json serializer

    # Need to revise to follow plants method below
    render json: {data: result}  # to be expanded to have current page count, page size, total record count
  end

  def plants
    plants = Inventory::ItemArticle.where(plant_status: params[:plant_status])
    data = Inventory::ItemArticleSerializer.new(plants).serialized_json
    render json: data
  end
end
