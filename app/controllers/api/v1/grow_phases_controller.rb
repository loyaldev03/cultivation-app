class Api::V1::GrowPhasesController < Api::V1::BaseApiController
  def index
    grow_phases = Common::GrowPhase.all
    render json: Common::GrowPhaseSerializer.new(grow_phases).serialized_json
  end

  def update_grow_phase
    grow_phase = Common::GrowPhase.find(params[:id])
    grow_phase.is_active = params[:is_active]
    grow_phase.save
    render json: Common::GrowPhaseSerializer.new(grow_phase).serialized_json
  end
end
