class SaveFacilityDestroyAllRooms
  prepend SimpleCommand

  def initialize(facility_id)
    @facility_id = facility_id
  end

  def call
    facility = Facility.find(@facility_id)
    Rails.logger.debug facility.is
    Rails.logger.debug "\033[31m facility.is_enabled: #{facility.is_enabled} \033[0m"
    # if facility.is_enabled == true
    #   Rails.logger.debug "\033[31m facility.is_enabled true \033[0m"
    #   errors.add(:error, 'Please toggle "Mark facility as ready..." to off before deleting all rooms')
    #   false
    # else
    #   Rails.logger.debug "\033[31m facility.is_enabled false \033[0m"
    #   facility.rooms = []
    #   facility.is_complete = false
    #   facility.save!
    # end
  end
end
