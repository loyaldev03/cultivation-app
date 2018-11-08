module Inventory
  class QueryFacilityStrains
    prepend SimpleCommand
    def initialize(facility_id = nil)
      @facility_id = facility_id
    end

    def call
      query = Inventory::FacilityStrain.includes(:facility)
      query = query.where(facility_id: @facility_id) if @facility_id

      query.map do |x|
        {
          value: x.id.to_s,
          label: "#{x.strain_name} - (#{x.facility.name})",
          strain_name: x.strain_name,
          strain_type: x.strain_type,
          facility_id: x.facility_id.to_s,
        }
      end
    end
  end
end
