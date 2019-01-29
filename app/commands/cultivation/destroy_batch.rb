module Cultivation
  class DestroyBatch
    prepend SimpleCommand

    def initialize(current_user, batch_id)
      @current_user = current_user,
      if batch_id.nil?
        raise 'Invalid batch_id'
      else
        @batch_id = batch_id
      end
    end

    def call
      Cultivation::Batch.find(@batch_id).delete
      Cultivation::Task.delete_all({batch_id: @batch_id})
      Cultivation::TrayPlan.delete_all({batch_id: @batch_id})
      @batch_id
    end
  end
end
