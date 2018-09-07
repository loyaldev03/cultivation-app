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

    # TODO: Use other params
    if params[:step].present?
      # TODO: Get start date and end date from batch (@record)
      @start_date = Time.now
      @end_date = Time.now + 15.days
      available_trays_cmd = QueryAvailableTrays.call(@start_date, @end_date)
      if available_trays_cmd.success?
        @locations = available_trays_cmd.result
        # TODO: Return on trays for single facility
        # @facility_id = available_trays_cmd.result.first[:facility_id]
        # @locations = available_trays_cmd.result.select { |t| t[:facility_id] == @facility_id }
      else
        @locations = []
      end
    end
  end

  private

  def record_params
    params.require(:record).permit(:name, :batch_source, :strain, :date_start)
  end

  def update_params
    {id: params[:id]}.merge(record_params)
  end
end
