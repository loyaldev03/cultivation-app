class UniqFacilityCodeValidator < ActiveModel::Validator
  def validate(record)
    if record.code.present?
      if Facility.where(code: record.code).ne(id: record.id).exists?
        record.errors.add(:facility_code, 'already exists')
      end
    end
  end
end
