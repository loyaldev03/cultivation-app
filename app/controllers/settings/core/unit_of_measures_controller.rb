class Settings::Core::UnitOfMeasuresController < ApplicationController
  def index
    if params[:onboarding_type].present?
      @facility = Facility.find(params[:facility_id])
      @facility.update_onboarding('ONBOARDING_UOM')
    end
    @list = Common::UnitOfMeasure.all.order_by(name: :asc)
    @used_uoms = Inventory::Catalogue.pluck(:common_uom).compact.uniq
  end

  def new
    @record = CoreForm::UnitOfMeasureForm.new
  end

  def create
    @record = CoreForm::UnitOfMeasureForm.new
    if @record.submit(record_params)
      render 'layouts/hide_sidebar', layouts: nil
    else
      render 'new', layout: nil
    end
  end

  def edit
    @record = CoreForm::UnitOfMeasureForm.new(params[:id])
  end

  def update
    form_object = CoreForm::UnitOfMeasureForm.new(params[:id])
    if form_object.submit(update_params)
      render 'layouts/hide_sidebar', layouts: nil
    else
      render 'edit', layout: nil
    end
  end

  def destroy
    command = DestroyUnitOfMeasure.call(params[:id])
    if command.success?
      render 'layouts/hide_sidebar', layouts: nil
    else
      flash[:error] = 'Unable to delete'
      render 'edit', layout: nil
    end
  end

  private

  def record_params
    params.require(:record).permit(:name, :desc, :base_unit, :base_uom, :conversion, :unit, :dimension, :is_base_unit)
  end

  def update_params
    {id: params[:id]}.merge(record_params)
  end
end
