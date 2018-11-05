class UniqUomCodeValidator < ActiveModel::Validator
  def validate(record)
    if record.unit.present?
      if Common::UnitOfMeasure.where(unit: record.unit).ne(id: record.id).exists?
        record.errors.add(:unit, 'already exists')
      end
    end
  end
end
