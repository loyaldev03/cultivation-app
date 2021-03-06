class SaveItemTransaction
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
      record = Inventory::ItemTransaction.where(id: args[:id]).update(args)
    else
      record = Inventory::ItemTransaction.new(args)
      record.save!
    end
    record
  rescue
    errors.add(:error, $!.message)
  end
end
