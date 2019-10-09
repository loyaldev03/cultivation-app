module Charts
  class QueryTotalActivePlant
    prepend SimpleCommand

    def initialize(current_user, args = {})
      @user = current_user
      @args = args
      @period = args[:period]
    end

    def call
      date = Time.zone.now
      facility_strain_ids = Inventory::FacilityStrain.where(facility_id: {"$in": @args[:facility_id]}).map { |a| a.id.to_s }
      if (@period.present? && @period == 'this_week')
        plants = Inventory::Plant.where(facility_strain_id: {'$in': facility_strain_ids}).where(:c_at.gt => date.beginning_of_week, :c_at.lt => date.end_of_week)
      elsif (@period.present? && @period == 'this_month')
        plants = Inventory::Plant.where(facility_strain_id: {'$in': facility_strain_ids}).where(:c_at.gt => date.beginning_of_month, :c_at.lt => date.end_of_month)
      elsif (@period.present? && @period == 'this_year')
        plants = Inventory::Plant.where(facility_strain_id: {'$in': facility_strain_ids}).where(:c_at.gt => date.beginning_of_year, :c_at.lt => date.end_of_year)
      else
        plants = Inventory::Plant.where(facility_strain_id: {'$in': facility_strain_ids})
      end
      plants.count
    end
  end
end
