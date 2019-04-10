module Cultivation
  class ActivateBatch
    prepend SimpleCommand

    attr_reader :args

    def initialize
      @batches = Cultivation::Batch.
        where(:status.in => [Constants::BATCH_STATUS_SCHEDULED])
    end

    def call
      @batches.each do |batch|
        Time.use_zone(batch.facility.timezone) do
          if batch.start_date.past?
            batch.update(status: Constants::BATCH_STATUS_ACTIVE)
          end
        end
      end
    end
  end
end
