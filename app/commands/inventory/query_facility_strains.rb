module Inventory
  class QueryFacilityStrains
    prepend SimpleCommand

    attr_accessor :strains

    def initialize(facility_ids)
      raise ArgumentError.new("facility_ids is required") if facility_ids.blank?

      @facility_ids = facility_ids
    end

    def call
      self.strains = Inventory::FacilityStrain.in(
        facility_id: @facility_ids,
      ).to_a
      strains.map do |x|
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
