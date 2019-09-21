module Charts
  class QueryStrainDistribution
    prepend SimpleCommand

    def initialize(current_user, args = {})
      @user = current_user
      @args = args
      @facility_id = @args[:facility_id].split(',')
    end

    def call
      if resource_shared?
        facility_strains = Inventory::FacilityStrain.in(facility_id: active_facility_ids).includes(:plants)
      else
        facility_strains = Inventory::FacilityStrain.where(facility_id: @facility_id).includes(:plants)
      end

      result = []

      result = facility_strains.group_by(&:strain_name).map do |strain, strain_value|
        if strain_value.map { |x| x.plants.count }.sum != 0
          {
            name: strain,
            value: strain_value.map { |x| x.plants.count }.sum,
          }
        end
      end

      return {children: result.compact}
    end

    def resource_shared?
      CompanyInfo.last.enable_resouces_sharing
    end

    def active_facility_ids
      Facility.where(is_enabled: true).pluck(:id)
    end
  end
end

[children: [{}]]
