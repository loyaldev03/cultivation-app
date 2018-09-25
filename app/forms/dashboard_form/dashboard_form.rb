module DashboardForm
  class DashboardForm
    attr_accessor :cultivation_batches

    def initialize
      set_records
    end

    private

    def set_records
      find_cmd = Cultivation::QueryBatch.call({is_active: true})
      if find_cmd.success?
        @cultivation_batches = find_cmd.result.order(start_date: :desc)
      else
        @cultivation_batches = []
      end
    end
  end
end
