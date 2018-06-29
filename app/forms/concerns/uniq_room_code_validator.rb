class UniqRoomCodeValidator < ActiveModel::Validator
  def validate(record)
    if record.room_code.present? && record.facility_rooms.present?
      if record.facility_rooms.any? { |r| r.code == record.room_code && r.id != record.room_id }
        record.errors.add(:room_code, 'already exists')
      end
    end
  end
end
