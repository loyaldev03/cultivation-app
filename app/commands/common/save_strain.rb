# TODO: To be reviewed.
module Common
  class SaveStrain
    prepend SimpleCommand

    attr_reader :args

    def initialize(args = {})
      @args = args
    end

    def call
      save_record if valid?
    end

    private

    def valid?
      errors.add(:name, 'Strain name cannot be empty') if @args[:name].blank?
      errors.add(:strain_type, 'Strain type cannot be empty') if @args[:strain_type].blank?
      errors.empty?
    end

    def save_record
      strain = Strain.find_or_initialize_by(name: args[:name])
      strain.strain_type = args[:strain_type]
      strain.save!
      strain
    end
  end
end
