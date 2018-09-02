class Settings::Facilities::RowsController < ApplicationController
  def index
    @rows = []
    facilities = params[:facility_id].present? ? Facility.find(params[:facility_id]).to_a : Facility.all

    facilities.each do |f|
      f.rooms.each do |r|
        @rows.concat(r.rows)
      end
    end
  end

  def edit
    @row = FacilitiesForm::RowUpdate.find(params[:id])
  end

  def update
    @row = FacilitiesForm::RowUpdate.find(params[:id])
    if @row.update(update_params)
      render 'layouts/hide_sidebar', layout: nil
    else
      render 'edit'
    end
  end

  private

  def update_params
    params.require(:facilities_form_row_update).permit(:code, :name)
  end
end
