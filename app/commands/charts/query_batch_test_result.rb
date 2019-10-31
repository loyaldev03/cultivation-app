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
          thcValue: (batch.facility_strain.thc || 0),
          cbdValue: (batch.facility_strain.cbd || 0),
          terpenoidsValue: rand(batch.facility_strain.thc).round(2), # FIXME: What is these? why is it hardcoded?
          residualPesticidesValue: rand(batch.facility_strain.cbd).round(2), #hardcoded
        }
      end
      if json_output.any? && @args[:order].present?
        json_output = if @args[:order] == 'top'
                        json_output.sort_by { |a| -a[:thcValue] }
                      else
                        json_output.sort_by { |a| a[:thcValue] }
                      end
      end
      json_output
    end
  end
end
