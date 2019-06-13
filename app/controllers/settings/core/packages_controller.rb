class Settings::Core::PackagesController < ApplicationController
  def index
    @packages = Inventory::QueryPackage.call.result
    @specials = ['others', 'grow_light', 'grow_medium', 'nutrients', 'supplements']
    @second_levels = ['blend', 'nitrogen', 'phosphate', 'potassium']
    ###should standardize the name to catalogue example -> Inventory::QueryCatalogue
  end

  def new
    @record = Inventory::PackageForm.new
  end

  def create
    @record = Inventory::Catalogue.new(package_params)
    @record.catalogue_type = 'packages'
    @record.key = @record.label.parameterize.underscore
    if params[:record][:parent_id].present?
      @parent = Inventory::Catalogue.find(params[:record][:parent_id])
      @record.category = @parent.key
    end
    Rails.logger.debug (@record.inspect)
    if @record.save
      Rails.logger.debug ("After #{@record.inspect}")
      render 'layouts/hide_sidebar', layouts: nil
    else
      render 'new', layout: nil
    end
  end

  def show
    @package = Inventory::Catalogue.find(params[:id])
    @children = @package.children
  end

  def edit
    @record = Inventory::Catalogue.find(params[:id])
    @children = @record.children
  end

  def update
    @record = Inventory::Catalogue.find(params[:id])
    @record.update(package_params)
    render 'layouts/hide_sidebar', layouts: nil
  end

  def bulk_update
    ids = params[:package][:ids]
    result = Inventory::UpdatePackage.call({ids: ids})
  end

  def destroy
    @record = Inventory::Catalogue.find(params[:id])
    @record.destroy
    render 'layouts/hide_sidebar', layouts: nil
  end

  private

  def package_params
    params.require(:record).permit(:label, :uom_dimension, :default_price)
  end
end
