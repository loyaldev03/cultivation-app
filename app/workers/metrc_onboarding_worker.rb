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
    company_info = CompanyInfo.where({}).first

    # Download all facilities from Metrc
    facilities = MetrcApi.get_facilities
    facilities.each_with_index do |fas, i|
      download_for_facility(fas, i, company_info.timezone)
    end
  end

  def download_for_facility(fas, index, timezone)
    f = Facility.find_or_create_by(
      name: fas.dig('Name'),
      site_license: fas.dig('License', 'Number'),
    )
    f.code = "F#{index.next}"
    f.license_type = fas.dig('License', 'LicenseType')
    f.license_start = fas.dig('License', 'StartDate')
    f.license_end = fas.dig('License', 'EndDate')
    f.timezone = timezone
    f.save

    # Download data that are specific to facility
    # 1. rooms
    # 2. strains
    # 3. items
  end
end
