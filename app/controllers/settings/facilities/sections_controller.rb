class Settings::Facilities::SectionsController < ApplicationController
  def index
    @sections = []
    facilities = params[:facility_id].present? ? Facility.find(params[:facility_id]).to_a : Facility.all

    facilities.each do |f|
      f.rooms.each do |r|
        @sections.concat r.sections.reverse
      end
    end
  end

  def edit
    @section = FacilitiesForm::SectionUpdate.find(params[:id])
  end

  def update
    @section = FacilitiesForm::SectionUpdate.find(params[:id])
    if @section.update(section_params)
      redirect_to settings_facility_sections_path
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
      :storage_types,
      :cultivation_types
    )
  end
end
