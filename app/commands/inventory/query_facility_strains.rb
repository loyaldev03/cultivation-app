module Inventory
  class QueryFacilityStrains
    prepend SimpleCommand

    def call
      Inventory::FacilityStrain.includes(:facility).all.map do |x|
        {
          value: x.id.to_s,
          label: "#{x.strain_name} - (#{x.facility.name})",
          strain_name: x.strain_name,
          facility_id: x.facility_id.to_s,
        }
      end
    end
  end
end