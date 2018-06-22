module FacilitiesForm
  class RoomCreate
    include ActiveModel::Model

    attr_accessor :code, :name, :desc, :facility_id
    attr_reader :facility

    validates :code, :facility_id, presence: true

    def save
      @facility = Facility.find(facility_id)
      room = @facility.rooms.build(code: code, name: name, desc: desc)

      if valid?
        @facility.room_count += 1
        @facility.save!
        true
      else
        false
      end
    end
  end
end
