class SaveUnitOfMeasure
  prepend SimpleCommand

  attr_reader :args

  def initialize(args = {})
    @args = args
  end

  def call
    save_record
  end

  private

  def save_record
    if args[:id]
      record = Common::UnitOfMeasure.where(id: args[:id]).update(args)
    else
      record = Common::UnitOfMeasure.new(args)
      record.save!
    end
    record
  rescue
    errors.add(:error, $!.message)
  end
end
