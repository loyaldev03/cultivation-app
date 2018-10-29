class SaveItem
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
    nil
    #   if args[:id]
    #     record = Inventory::Item.where(id: args[:id]).update(args)
    #   else
    #     record = Inventory::Item.new(args)
    #     record.save!
    #   end
    #   record
    # rescue
    #   errors.add(:error, $!.message)
  end
end
