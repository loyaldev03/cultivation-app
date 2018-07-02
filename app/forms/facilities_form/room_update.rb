module FacilitiesForm
  class RoomUpdate
    include ActiveModel::Model
    attr_accessor :room

    delegate :id,
             :name,
             :code,
             :desc,
             :facility,
             to: :room,
             prefix: false

    validates :code, :name, presence: true
    validate :code_must_be_unique

    def self.find(id)
      room = Facility.where('rooms._id' => BSON::ObjectId.from_string(id)).first.rooms.find(id)
      form = FacilitiesForm::RoomUpdate.new
      form.room = room
      form
    end

    def update(params)
      self.room.attributes = params.slice(:code, :name, :desc)

      if valid?
        room.update!(code: code, name: name, desc: desc)
        true
      else
        false
      end
    end

    def code_must_be_unique
      if facility.rooms.any? { |r| r.code == code && r.id != room.id }
        errors.add(:code, 'must be unique')
      end
    end
  end
end
