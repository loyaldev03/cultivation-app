class Settings::Core::UnitOfMeasureController < ApplicationController
  def index
    @uom_list = UnitOfMeasure.all.order_by(name: :asc)
  end

  def new
  end

  def create
  end

  def edit
  end

  def update
  end

  private

  def uom_params
    params.require(:uom).permit(:code, :name, :desc)
  end
end
