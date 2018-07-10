class Settings::Core::UnitOfMeasuresController < ApplicationController
  def index
    @list = UnitOfMeasure.all.order_by(name: :asc)
  end

  def new
    @record = CoreForm::UnitOfMeasureForm.new
  end

  def create
    @record = CoreForm::UnitOfMeasureForm.new
    if @record.submit(uom_params)
      render 'layouts/hide_sidebar', layouts: nil
    else
      render 'new', layout: nil
    end
  end

  def edit
    @record = CoreForm::UnitOfMeasureForm.new(params[:id])
  end

  def update
    @record = CoreForm::UnitOfMeasureForm.new(params[:id])
    if @record.submit(uom_params)
      render 'layouts/hide_sidebar', layouts: nil
    else
      render 'edit', layout: nil
    end
  end

  def destroy
  end

  private

  def uom_params
    params.require(:record).permit(:code, :name, :desc)
  end
end
