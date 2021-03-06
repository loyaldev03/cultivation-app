class Materials::ItemsController < ApplicationController
  def nutrients
    @locations = QueryAllValidFacilityLocations.call().result
    @order_uoms = Common::UnitOfMeasure.where(:dimension.in => %w(pieces weight volume)).pluck(:unit)
  end

  def grow_medium
  end

  def grow_lights
    render plain: 'grow_lights'
  end

  def supplements
    render plain: 'supplements'
  end

  def others
    render plain: 'others'
  end

  def index
    @records = QueryItems.call.result
  end

  def new
    @record = MaterialsForm::ItemForm.new
  end

  def create
    @record = MaterialsForm::ItemForm.new
    if @record.submit(record_params)
      render 'layouts/hide_sidebar', layouts: nil
    else
      render 'new', layout: nil
    end
  end

  def edit
    @record = MaterialsForm::ItemForm.new(params[:id])
  end

  def show
    @record = FindItem.call({id: params[:id]}).result
  end

  def update
    form_object = MaterialsForm::ItemForm.new(params[:id])
    update_params = {id: params[:id]}.merge(record_params)
    if form_object.submit(update_params)
      render 'layouts/hide_sidebar', layouts: nil
    else
      render 'edit', layout: nil
    end
  end

  def destroy
    command = DestroyItem.call(params[:id])
    if command.success?
      render 'layouts/hide_sidebar', layouts: nil
    else
      flash[:error] = 'Unable to delete'
      render 'edit', layout: nil
    end
  end

  private

  def record_params
    params.require(:record).permit(:name, :description, :facility)
  end
end
