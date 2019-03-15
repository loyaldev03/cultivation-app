class SaveFacilityDestroyAllRooms
  prepend SimpleCommand

  def initialize(facility_id)
    @facility_id = facility_id
  end

  def call
    facility = Facility.find(@facility_id)
    facility.rooms = []
    facility.is_complete = false
    facility.save!
  end
end
