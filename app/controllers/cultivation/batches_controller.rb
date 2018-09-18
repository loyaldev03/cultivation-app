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
    @batch_attributes = {
      id: @record.id,
      strain: @record.strain_id,
      batch_source: @record.batch_source,
      grow_method: @record.grow_method,
      start_date: @record.start_date.strftime('%m/%d/%Y'),
    }
    # TODO: Use other params
    if params[:step].present?
      # TODO: Get start date and end date from batch (@record)
      @start_date = Time.now
      @end_date = Time.now + 15.days

      if @record.batch_source == 'clones_from_mother'
        # Get available trays based on purpose
        available_trays_cmd = QueryAvailableTrays.call(
          @start_date,
          @end_date,
          {
            facility_id: @record.facility_id,
            purpose: 'clone',
          }
        )
      else
        available_trays_cmd = QueryAvailableTrays.call(
          @start_date,
          @end_date,
          {facility_id: @record.facility_id}
        )
      end

      if available_trays_cmd.success?
        @locations = available_trays_cmd.result
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
