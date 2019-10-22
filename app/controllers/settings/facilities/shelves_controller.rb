class Settings::Facilities::ShelvesController < ApplicationController
  def index
    facility_ids = if selected_facilities_ids.blank?
                     current_user_facilities_ids
                   else
                     selected_facilities_ids
                   end
    @shelves = []

    facilities = Facility.find(facility_ids).to_a
    facilities.each do |f|
      f.rooms.each do |r|
        r.rows.each do |row|
          @shelves.concat(row.shelves)
        end
      end
    end
  end

  def edit
    @shelf = FacilitiesForm::ShelfUpdate.find(params[:id])
  end

  def update
    @shelf = FacilitiesForm::ShelfUpdate.find(params[:id])
    if @shelf.update(update_params)
      render 'layouts/hide_sidebar', layout: nil, locals: {message: 'Shelf successfully updated'}
    else
      render 'edit'
    end
  end

  def update_params
    params.require(:facilities_form_shelf_update).permit(:code, :desc, :capacity)
  end
end
