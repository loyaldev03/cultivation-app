module Cultivation
  class QueryTasks
    prepend SimpleCommand

    attr_reader :batch, :includes

    def initialize(batch, includes = [])
      @batch = batch
      @includes = includes
    end

    def call
      if batch.present?
        tasks = batch.tasks.includes(includes).order_by(position: :asc).to_a
        wbs_list = WbsTree.generate(tasks)
        tasks.each_with_index do |t, i|
          t.wbs = wbs_list[i][:wbs]
        end
        tasks
      else
        errors.add(:error, 'Invalid param batch')
        []
      end
    end
  end
end
