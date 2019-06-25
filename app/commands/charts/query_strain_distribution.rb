module Charts
  class QueryStrainDistribution
    prepend SimpleCommand

    def initialize(current_user, args = {})
      @user = current_user
      @args = args
    end

    def call
      facility_strains = Inventory::FacilityStrain.all.includes(:plants)
      result = facility_strains.map do |strain|
        {
          value: strain.strain_name,
          detail: "#{strain.plants.count} plants",
        }
      end
    end
  end
end
