class Settings::Core::RawMaterialsController < ApplicationController
  def index
    if params[:onboarding_type].present?
      Facility.first.update_onboarding('ONBOARDING_MATERIAL_TYPE')
    end
    @raw_materials = Inventory::QueryRawMaterial.call.result
    @specials = ['others', 'grow_light', 'grow_medium', 'nutrients', 'supplements']
    @second_levels = ['blend', 'nitrogen', 'phosphate', 'potassium']
    ###should standardize the name to catalogue example -> Inventory::QueryCatalogue
  end

  def new
    @record = Inventory::RawMaterialForm.new
  end

  def create
    @record = Inventory::Catalogue.new(raw_material_params)
    @record.catalogue_type = 'raw_materials'
    if params[:record][:parent_id].present?
      @parent = Inventory::Catalogue.find(params[:record][:parent_id])
      @record.category = @parent.key
    end
    if @record.save
      render 'layouts/hide_sidebar', layouts: nil
    else
      render 'new', layout: nil
    end
  end

  def show
    @raw_material = Inventory::Catalogue.find(params[:id])
    @children = @raw_material.children
  end

  def edit
    @record = Inventory::Catalogue.find(params[:id])
    @children = @record.children
  end

  def update
    @record = Inventory::Catalogue.find(params[:id])
    @record.update(raw_material_params)
    render 'layouts/hide_sidebar', layouts: nil
  end

  def bulk_update
    ids = params[:raw_material][:ids]
    result = Inventory::UpdateRawMaterial.call({ids: ids})
  end

  def destroy
    @record = Inventory::Catalogue.find(params[:id])
    @record.destroy
    render 'layouts/hide_sidebar', layouts: nil
  end

  private

  def raw_material_params
    params.require(:record).permit(:label, :uom_dimension, :default_price)
  end
end
