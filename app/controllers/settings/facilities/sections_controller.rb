class Settings::Facilities::SectionsController < ApplicationController
  def index
    facility_ids = if selected_facilities_ids.blank?
                     current_user_facilities_ids
                   else
                     selected_facilities_ids
                   end
    @sections = []

    facilities = Facility.find(facility_ids).to_a
    facilities.each do |f|
      f.rooms.each do |r|
        @sections.concat r.sections.reverse
      end
    end
  end

  def edit
    @section = FacilitiesForm::SectionUpdate.find(params[:id])
    render 'edit', layout: nil
  end

  def update
    @section = FacilitiesForm::SectionUpdate.find(params[:id])
    if @section.update(section_params)
      render 'layouts/hide_sidebar', layout: nil, locals: {message: 'Section successfully updated'}
    else
      render 'edit'
    end
  end

  def section_params
    params.require(:facilities_form_section_update).permit(
      :name,
      :code,
      :desc,
      :purpose,
      :custom_purpose,
      storage_types: [],
      cultivation_types: [],
    )
  end
end
