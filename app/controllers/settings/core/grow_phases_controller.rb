class Settings::Core::GrowPhasesController < ApplicationController
  before_action :set_grow_phase, only: [:edit, :update, :destroy]

  def index
    @grow_phases = Common::GrowPhase.all
  end

  def new
    @grow_phase = Common::GrowPhase.new
  end

  def create
    @grow_phase = Common::GrowPhase.new(grow_phase_params)
    if @grow_phase.save
      render 'layouts/hide_sidebar', layouts: nil
    else
    end
  end

  def edit
  end

  def update
    if @grow_phase.update(grow_phase_params)
      render 'layouts/hide_sidebar', layouts: nil
    else
    end
  end

  def destroy
    @grow_phase.destroy
    render 'layouts/hide_sidebar', layouts: nil
  end

  def bulk_update
    ids = params[:grow_phase][:ids] || []
    result = Common::BulkUpdateGrowPhase.call(current_user, {ids: ids})
  end

  private

  def grow_phase_params
    params.require(:grow_phase).permit(:name, :active)
  end

  def set_grow_phase
    @grow_phase = Common::GrowPhase.find(params[:id])
  end
end
