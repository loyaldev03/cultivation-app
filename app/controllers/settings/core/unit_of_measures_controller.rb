class Settings::Core::UnitOfMeasuresController < ApplicationController
  def index
    @list = Common::UnitOfMeasure.all.order_by(name: :asc)
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
    params.require(:record).permit(:code, :name, :desc)
  end

  def update_params
    {id: params[:id]}.merge(record_params)
  end
end
