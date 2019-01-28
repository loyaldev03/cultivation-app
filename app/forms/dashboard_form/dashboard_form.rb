module DashboardForm
  class DashboardForm
    attr_accessor :cultivation_batches

    def initialize
      set_records
    end

    private

    def set_records
      result = Cultivation::Batch.
        includes(:facility_strain).
        order(created_at: :desc)

      @cultivation_batches = result || []
    end
  end
end
