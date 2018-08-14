class SaveTray
  prepend SimpleCommand

  attr_reader :shelf, :args

  def initialize(shelf, args = {})
    @shelf = shelf
    @args = args
  end

  def call
    save_record
  end

  private

  def save_record
    record = @shelf.trays.find(@args.id)
    record.shelf = @shelf
    record.code = @args.code
    record.capacity = @args.capacity
    record.capacity_type = @args.capacity_type
    record.wz_generated = false
    record.save!
    record
  end
end
