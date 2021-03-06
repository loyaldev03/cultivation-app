class Api::V1::GrowPhasesController < Api::V1::BaseApiController
  def index
    # grow_phases = Common::GrowPhase.all()
    # render json: Common::GrowPhaseSerializer.new(grow_phases).serialized_json
    grow_phases = Common::QueryGrowPhase.call().result
    render json: grow_phases.to_json, status: 200
  end

  def show
    grow_phase = Common::GrowPhase.find(params[:id])
    render json: Common::GrowPhaseSerializer.new(grow_phase).serialized_json
  end

  def update_grow_phase
    grow_phase = Common::GrowPhase.find(params[:id])
    grow_phase.is_active = params[:is_active]
    grow_phase.number_of_days = params[:number_of_days].to_i if params[:number_of_days].present?
    grow_phase.save
    render json: Common::GrowPhaseSerializer.new(grow_phase).serialized_json
  end
end
