class Api::V1::PlantsController < Api::V1::BaseApiController
  def index
    Rails.logger.debug "\t\t\t >>> request.cookies.count: #{request.cookies.count}"
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
    # Rails.logger.debug "\n--- result ----"
    # Rails.logger.debug result

    result = result.map { |x| {name: x.name, strain_type: x.strain_type} }  # to be replaced with json serializer

    render json: {data: result}  # to be expanded to have current page count, page size, total record count
  end
end
