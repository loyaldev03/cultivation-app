class Cultivation::BatchesController < ApplicationController
  def index
  end

  def new
  end

  def create
    @record = Cultivation::BatchForm.new
    @record = @record.submit(record_params)
    if @record
      redirect_to cultivation_batch_path(id: @record.id)
    else
      render 'new'
    end
  end

  def show
    @record = Cultivation::BatchForm.new(params[:id])
  end

  private

  def record_params
    params.require(:record).permit(:name, :batch_source, :strain, :date_start)
  end

  def update_params
    {id: params[:id]}.merge(record_params)
  end
end
