class Settings::Core::RawMaterialsController < ApplicationController
  before_action :set_specialkeys

  def index
    if params[:onboarding_type].present?
      Facility.first.update_onboarding('ONBOARDING_MATERIAL_TYPE')
    end
    @raw_materials = Inventory::QueryRawMaterial.call.result
    ###should standardize the name to catalogue example -> Inventory::QueryCatalogue
  end

  def new
    @record = Inventory::RawMaterialForm.new
  end

  def create
    @record = Inventory::Catalogue.new(raw_material_params)
    @record.catalogue_type = 'raw_materials'
    @record.key = @record.label.parameterize.underscore
    if params[:record][:parent_id].present?
      @parent = Inventory::Catalogue.find(params[:record][:parent_id])
      @record.category = @parent.key
    end
    if @record.save
      if params[:record][:edit_form].present? and params[:record][:edit_form]
        @record = Inventory::Catalogue.find_by(key: @record.category)
        @children = @record.children
        render 'edit', layout: nil
      elsif @specials.include?(@record.key.try(:capitalize))
        @children = @record.children
        render 'edit', layout: nil
      else
        render 'layouts/hide_sidebar', layouts: nil
      end
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
    if params[:record][:sub_label].present?
      create_subcategory
      render 'edit', layout: nil
    else
      render 'layouts/hide_sidebar', layouts: nil
    end
  end

  def bulk_update
    ids = params[:raw_material][:ids]
    result = Inventory::UpdateRawMaterial.call({ids: ids})
  end

  def destroy
    @record = Inventory::Catalogue.find(params[:id])
    @record.destroy
    if params[:edit_form].present? and params[:edit_form]
      @record = Inventory::Catalogue.find_by(key: params[:category])
      @children = @record.children
      render 'edit', layout: nil
    else
      render 'layouts/hide_sidebar', layouts: nil
    end
  end

  private

  def set_specialkeys
    @specials = Constants::SPECIAL_TYPE.pluck(:name)
    @second_levels = Constants::NUTRIENT_TYPE.pluck(:name)
  end

  def create_subcategory
    @child = Inventory::Catalogue.new(label: params[:record][:sub_label], category: @record.key, catalogue_type: 'raw_materials')
    @child.save
    @children = @record.children
  end

  def raw_material_params
    params.require(:record).permit(:label, :uom_dimension, :default_price)
  end
end
