class Settings::Core::GrowMethodsController < ApplicationController
  def index
    if params[:onboarding_type].present?
      Facility.first.update_onboarding('ONBOARDING_GROW_METHOD')
    end
    @grow_methods = Common::GrowMethod.all
  end

  def new
    @grow_method = Common::GrowMethod.new
  end

  def create
    @grow_method = Common::GrowMethod.new(grow_method_params)
    if @grow_method.save
      render 'layouts/hide_sidebar', layouts: nil
    else
      render 'new', layout: nil
    end
  end

  def show
    @grow_method = Common::GrowMethod.find(params[:id])
  end

  def edit
    @grow_method = Common::GrowMethod.find(params[:id])
  end

  def update
    @grow_method = Common::GrowMethod.find(params[:id])
    @grow_method.update(grow_method_params)
    render 'layouts/hide_sidebar', layouts: nil
  end

  def bulk_update
    ids = params[:grow_method][:ids]
    result = Common::BulkUpdateGrowMethod.call(current_user, {ids: ids})
  end

  def destroy
    @grow_method = Common::GrowMethod.find(params[:id])
    @grow_method.destroy
    render 'layouts/hide_sidebar', layouts: nil
  end

  private

  def grow_method_params
    params.require(:grow_method).permit(:name, :is_active)
  end
end
