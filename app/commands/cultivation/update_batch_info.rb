module Cultivation
  class UpdateBatchInfo
    prepend SimpleCommand

    def initialize(current_user, batch_id, args = {})
      @args = args
      @current_user = current_user
      @batch = Cultivation::Batch.find(batch_id)
    end

    def call
      @batch.update(@args)
      validate
    rescue StandardError
      errors.add(:error, $!.message)
    end

    def validate
    end
  end
end
