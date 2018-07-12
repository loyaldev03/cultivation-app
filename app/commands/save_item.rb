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
    record = Item.new(args)
    if args[:id]
      # TODO: timestamp missing
      record.upsert
    else
      record.save!
    end
    record
  rescue StandardError => ex
    errors.add(:error, $!.to_s)
  end
end
