class MetrcOnboardingWorker
  include Sidekiq::Worker

  def perform
    # download all data from Metrc during onboarding
    # - call MetrcApi to download all facilities
    # - download all items for each facility
    download_for_company
  end

  # Download data for company. These data are shared
  # across facilities
  def download_for_company
    # Download item category
    # Download unit of measure

    # Download all facilities from Metrc
    facilities = MetrcApi.get_facilities
    facilities.each do |fas|
      download_for_facility(fas)
    end
  end

  def download_for_facility(fas)
    # download data that are specific to facility
    # 1. rooms
    # 2. strains
    # 3. items
  end
end
