class MetrcUpdateFacilityWorker
  include Sidekiq::Worker
  sidekiq_options queue: 'low'

  def perform
    # Overview of the logic flow
    # Get list of facilities from api
    # Update facility info in db 1 by 1
    logger.debug 'Running update facility worker'

    local_facilities = Facility.all.to_a

    # Only update facility records that exists in the local database
    local_facilities.each do |f|
      metrc_rec = get_metrc_facility_by_license(f.site_license)
      if metrc_rec
        f.name = metrc_rec.dig('Name')
        f.license_type = metrc_rec.dig('License', 'LicenseType')
        f.license_start = metrc_rec.dig('License', 'StartDate')
        f.license_end = metrc_rec.dig('License', 'EndDate')
        f.save
      end
    end
  end

  private

  def metrc_facilities
    @metrc_facilities ||= MetrcApi.get_facilities
  end

  def get_metrc_facility_by_license(lic)
    metrc_facilities.detect do |f|
      f.dig('License', 'Number') == lic
    end
  end
end
