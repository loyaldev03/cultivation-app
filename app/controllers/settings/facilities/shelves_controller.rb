class Settings::Facilities::ShelvesController < ApplicationController
  def index
    @shelves = []
    facilities = params[:facility_id].present? ? Facility.find(params[:facility_id]).to_a : Facility.all

    facilities.each do |f|
      f.rooms.each do |r|
        r.sections.each do |s|
          s.rows.each do |row|
            @shelves.concat(row.shelves)
          end
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
      render 'layouts/hide_sidebar', layout: nil
    else
      render 'edit'
    end
  end

  def update_params
    params.require(:facilities_form_shelf_update).permit(:code, :desc, :capacity)
  end
end
