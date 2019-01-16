module Cultivation
  class QueryTasks
    prepend SimpleCommand

    def initialize(batch)
      @batch = batch
    end

    def call
      if @batch.present?
        tasks = @batch.tasks.order_by(position: :asc).to_a
        wbs_list = WbsTree.generate(tasks)
        tasks.each_with_index { |t, i| t.wbs = wbs_list[i][:wbs] }
        tasks
      else
        errors.add(:error, 'Invalid param batch')
        []
      end
    end
  end
end
