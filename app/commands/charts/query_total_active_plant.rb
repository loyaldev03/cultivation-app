module Charts
  class QueryTotalActivePlant
    prepend SimpleCommand

    def initialize(current_user, args = {})
      @user = current_user
      @args = args
    end

    def call
      facility_strain_ids = Inventory::FacilityStrain.where(facility_id: {"$in": @args[:facility_id]}).map { |a| a.id.to_s }
      plants = Inventory::Plant.where(facility_strain_id: {'$in': facility_strain_ids})
      plants.count
    end
  end
end
