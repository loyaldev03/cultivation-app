class MetrcUpdateFacilityWorker
  include Sidekiq::Worker
  sidekiq_options queue: 'low'

  def perform(facility_id)
    logger.debug "Running update facility worker on #{facility_id}"
  end
end
