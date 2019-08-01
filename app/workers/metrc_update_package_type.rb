class MetrcUpdatePackageType
  include Sidekiq::Worker
  sidekiq_options queue: 'low'

  def perform(facility_id)
    @facility_id = facility_id
    # Download Unit of Measures (UoM) list from Metrc via API
    results = MetrcApi.get_package_type(facility.site_license)
    results.each do |h|
      # Parse downloaded data, and map to local UoM model
      Cultivation::PackageType.find_or_create_by(
        name: h,
      )
    end
  end

  private

  def facility
    @facility ||= Facility.find(@facility_id)
  end
end
