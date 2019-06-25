module Charts
  class QueryBatchTestResult
    prepend SimpleCommand

    def initialize(current_user, args = {})
      @user = current_user
      @args = args
    end

    def call
      # NOTE : should be re write the code for test_results not facility_strain
      active_batches = Cultivation::Batch.active.includes(:facility_strain)
      json_output = active_batches.map do |batch|
        {
          batch_id: batch.id.to_s,
          batch: batch.name,
          thcValue: batch.facility_strain.thc,
          cbdValue: batch.facility_strain.cbd,
          terpinesValue: '',
          thcPercentage: 25,
          cbdPercentage: 15,
          terpinesPercentage: 60,
        }
      end
    end
  end
end
