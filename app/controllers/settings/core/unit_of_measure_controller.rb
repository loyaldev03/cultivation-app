class Settings::Core::UnitOfMeasureController < ApplicationController
  def index
    @list = UnitOfMeasure.all.order_by(name: :asc)
  end

  def new
  end

  def create
  end

  def edit
    @record = CoreForm::UnitOfMeasureForm.new(uom)
  end

  def update
  end

  private

  def uom
    @uom ||= UnitOfMeasure.where(id: params[:id]).first if params[:id]
  end

  def uom_params
    params.require(:uom).permit(:code, :name, :desc)
  end
end
