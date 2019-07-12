module Charts
  class QueryStrainDistribution
    prepend SimpleCommand

    def initialize(current_user, args = {})
      @user = current_user
      @args = args
    end

    def call
      facility_strains = Inventory::FacilityStrain.all.includes(:plants)
      result = {
        children: facility_strains.group_by(&:strain_name).map do |strain, strain_value|
          {
            name: strain,
            value: strain_value.map { |x| x.plants.count }.sum,
          }
        end,
      }
    end
  end
end

[children: [{}]]
