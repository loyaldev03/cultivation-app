module Inventory
  class UpdatePackage
    prepend SimpleCommand

    def initialize(args = {})
      @args = args
    end

    def call
      ids = @args[:ids]
      packages = Inventory::Catalogue.where(catalogue_type: 'packages')
      temp_packages = []
      packages.each do |package|
        rm = package
        if ids.include?(rm.id.to_s)
          rm.is_active = true
        else
          rm.is_active = false
        end
        temp_packages << rm
      end
      bulk_update(temp_packages)
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
