class Api::V1::StrainsController < Api::V1::BaseApiController
  def index
    strains = if params[:facility_id]
                Inventory::FacilityStrain.where(facility_id: params[:facility_id]).order(c_at: :desc)
              else
                Inventory::FacilityStrain.all.includes(:facility).order(c_at: :desc)
              end

    data = Inventory::FacilityStrainSerializer.new(strains).serialized_json
    render json: data
  end

  # Suggest strains from pre-populated suggestion list
  def suggest
    strains = if params[:filter]
                Common::Strain.where(:name => /^#{params[:filter]}/i).limit(7).to_a
              else
                Common::Strain.all.asc(:name).limit(7).to_a
              end

    render json: Common::StrainSerializer.new(strains).serialized_json
  end

  def create
    command = Inventory::SaveFacilityStrain.call(current_user, params[:strain].to_unsafe_h)
    if command.success?
      result = command.result
      render json: Inventory::FacilityStrainSerializer.new(result).serialized_json
    else
      render json: params[:strain].to_unsafe_h.merge(errors: command.errors), status: 422
    end
  end

  def show
    strain = Inventory::FacilityStrain.find(params[:id])
    render json: Inventory::FacilityStrainSerializer.new(strain).serialized_json
  end
end
