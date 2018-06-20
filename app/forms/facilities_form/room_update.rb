module FacilitiesForm
  class RoomUpdate
    include ActiveModel::Model
    attr_accessor :code, :name, :desc, :facility, :id

    validates :code, :name, presence: true
    # Validate no duplicate code

    def self.find(id)
      room = Facility.where('rooms._id' => BSON::ObjectId.from_string(id)).first.rooms.find(id)
      form = FacilitiesForm::RoomUpdate.new
      form.id = room.id
      form.code = room.code
      form.name = room.name
      form.desc = room.desc
      form.facility = room.facility
      form
    end

    def update(params)
      Rails.logger.debug "\t\t>> params.slice: #{params.slice(:code, :name, :desc)}"
      self.attributes = params.slice(:code, :name, :desc)

      if valid?
        facility.rooms.find(id).update!(code: code, name: name, desc: desc)
        true
      else
        false
      end
    end

    def persisted?
      true
    end
  end
end
