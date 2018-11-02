class Api::V1::CataloguesController < Api::V1::BaseApiController
  def raw_materials
    raw_materials = Inventory::Catalogue.raw_materials
    raw_material_json = Inventory::CatalogueSerializer.new(raw_materials).serialized_json
    render json: raw_material_json
  end

  def raw_material_tree
    command = Inventory::QueryCatalogueTree.call('raw_materials', params[:type])
    render json: command.result
  end
end
