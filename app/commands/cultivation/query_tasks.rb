module Cultivation
  class QueryTasks
    prepend SimpleCommand

    attr_reader :batch, :includes, :pagy

    def initialize(batch, includes = [], facility_id = nil)
      @batch = batch
      @includes = includes
      @facility_id = facility_id
    end

    def call
      if batch.present?
        tasks = batch.tasks.includes(includes).order_by(position: :asc).to_a
        wbs_list = WbsTree.generate(tasks)
        tasks.each_with_index do |t, i|
          t.wbs = wbs_list[i][:wbs]
        end
        tasks
      elsif @facility_id.present?
        Cultivation::Task.includes(includes).where(facility_id: @facility_id, batch_id: nil)
      else
        []
      end
    end
  end
end
