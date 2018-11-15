module DashboardForm
  class DashboardForm
    attr_accessor :cultivation_batches

    def initialize
      set_records
    end

    private

    def set_records
      find_cmd = Cultivation::QueryBatch.call()
      if find_cmd.success?
        @cultivation_batches = find_cmd.result.order(created_at: :desc)
      else
        @cultivation_batches = []
      end
    end
  end
end
