class Settings::Facilities::RowsController < ApplicationController
  def index
    facility_ids = if selected_facilities_ids.blank?
                     current_user_facilities_ids
                   else
                     selected_facilities_ids
                   end
    @rows = []

    facilities = Facility.find(facility_ids).to_a
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
      render 'layouts/hide_sidebar', layout: nil, locals: {message: 'Row successfully updated'}
    else
      render 'edit'
    end
  end

  private

  def update_params
    params.require(:facilities_form_row_update).permit(:code, :name)
  end
end
