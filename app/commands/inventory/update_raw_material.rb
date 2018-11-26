module Inventory
  class UpdateRawMaterial
    prepend SimpleCommand

    def initialize(args = {})
      @args = args
    end

    def call
      ids = @args[:ids]
      raw_materials = Inventory::Catalogue.where(catalogue_type: 'raw_materials')
      temp_raw_materials = []
      raw_materials.each do |raw_material|
        rm = raw_material
        if ids.include?(rm.id.to_s)
          rm.is_active = true
        else
          rm.is_active = false
        end
        temp_raw_materials << rm
      end
      bulk_update(temp_raw_materials)
    end

    def bulk_update(array)
      bulk_catalogue = array.map do |arr|
        {update_one: {
          filter: {_id: arr.id},
          update: {:'$set' => {
            is_active: arr.is_active,
          }},
        }}
      end
      Inventory::Catalogue.collection.bulk_write(bulk_catalogue)
    end
  end
end
