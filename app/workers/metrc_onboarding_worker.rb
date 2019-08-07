class MetrcOnboardingWorker
  include Sidekiq::Worker

  def perform()
    # download all data from Metrc during onboarding
    # - call MetrcApi get_facilities to download all facilities
    # - download all items for each facility
    facilities = MetrcApi.get_facilities()
  end
end
