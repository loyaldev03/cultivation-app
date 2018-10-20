module Cultivation
  class SaveNutrientProfile
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
      batch = Cultivation::Batch.find(args[:batch_id])
      if args[:id]
        record = batch.nutrient_profile.update(args)
      else
        record = batch.build_nutrient_profile(args)
        record.save!
      end
      record
    rescue
      errors.add(:error, $!.message)
    end
  end
end
