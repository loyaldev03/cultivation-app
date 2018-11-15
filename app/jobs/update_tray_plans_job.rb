class UpdateTrayPlansJob < ApplicationJob
  queue_as :default

  def perform(batch_id)
    # Do something later
    # TODO #1 - Get the start and end date of each phase for the batch
    # TODO #2 - Lookup Active Plants by batch_id, sum capacity
    # TODO #3 - Create / Update Tray Plans by phase of the plants
  end
end
