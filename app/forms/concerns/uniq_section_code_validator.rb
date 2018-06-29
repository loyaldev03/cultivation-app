class UniqSectionCodeValidator < ActiveModel::Validator
  def validate(record)
    if record.section_code.present? && record.room_sections.present?
      if record.room_sections.any? { |s| s.code == record.section_code && s.id != record.section_id }
        record.errors.add(:section_code, 'already exists')
      end
    end
  end
end
