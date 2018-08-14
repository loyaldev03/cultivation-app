class UniqUomCodeValidator < ActiveModel::Validator
  def validate(record)
    if record.code.present?
      if Common::UnitOfMeasure.where(code: record.code).ne(id: record.id).exists?
        record.errors.add(:code, 'already exists')
      end
    end
  end
end
