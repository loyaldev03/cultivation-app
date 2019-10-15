class UpdateBatchTasksWorker
  include Sidekiq::Worker

  def perform(batch_id)
    @batch_id = batch_id

    batch_tasks.each do |task|
      task.update_attributes(
        assignable: task.have_children?(batch_tasks),
        batch_name: batch.name,
        batch_status: batch.status,
      )
    end
  end

  private

  def batch
    @batch ||= Cultivation::Batch.find(@batch_id)
  end

  def batch_tasks
    @batch_tasks ||= Cultivation::QueryTasks.call(batch, []).result
  end
end
