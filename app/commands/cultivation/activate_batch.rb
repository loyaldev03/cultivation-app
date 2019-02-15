
module Cultivation
  class ActivateBatch
    prepend SimpleCommand

    attr_reader :args

    def initialize
      @batches = Cultivation::Batch
        .where(:status.in => [Constants::BATCH_STATUS_SCHEDULED, Constants::BATCH_STATUS_DRAFT])
    end

    def call
      @batches.each do |batch|
        timezone = batch.facility.timezone
        Time.zone = timezone #change timezone
        #compare timezone
        if Time.zone.now.to_date == batch.start_date.to_date
          batch.update(status: Constants::BATCH_STATUS_ACTIVE)
        end
      end
    end
  end
end
