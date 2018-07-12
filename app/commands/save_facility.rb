class SaveFacility
  prepend SimpleCommand

  attr_reader :args

  def initialize(args = {})
    @args = args
  end

  def call
    save_facility
  end

  private

  def save_facility
    facility = Facility.new(args)
    facility.save!
    facility
  rescue StandardError => ex
    errors.add(:error, $!.to_s)
  end
end
