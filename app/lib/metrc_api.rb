class MetrcApi
  BASE_URL = 'https://sandbox-api-ca.metrc.com'.freeze
  # TODO: Move this to user specific store
  FACILITY_LICENSE = 'CML17-0000001'.freeze
  HEADERS = {
    # TODO: Move this to user specific store
    Authorization: 'Basic aktMcnhNM0ZuSExpZlVDYkxVOHAxdER4c2ppbWJBS0haN3I0RUsydGo4TmIwZGIxOkZ1c1ZiZTRZdjZXMURHTnV4S05oQnlYVTZSTzZqU1VQY2JSQ29SREQ5OFZOWGM0RA==',
    Accept: :json,
    "Content-Type": 'application/json',
  }.freeze

  class << self

    # + Facility

    def get_facilities
      url = "#{BASE_URL}/facilities/v1"
      res = RestClient.get(url, HEADERS)
      JSON.parse(res.body)
    end

    # - Facility

    # + Unit of Measure

    def get_unit_of_measure
      url = "#{BASE_URL}/unitsofmeasure/v1/active"
      res = RestClient.get(url, HEADERS)
      JSON.parse(res.body)
    end

    # - Unit of Measure

    def get_item_categories
      url = "#{BASE_URL}/items/v1/categories"
      res = RestClient.get(url, HEADERS)
      JSON.parse(res.body)
    end

    # + Plant Waste Methods and Reasons

    def get_plant_waste_methods
      url = "#{BASE_URL}/plants/v1/waste/methods?licenseNumber=#{FACILITY_LICENSE}"
      res = RestClient.get(url, HEADERS)
      JSON.parse(res.body)
    end

    def get_plant_waste_reasons
      url = "#{BASE_URL}/plants/v1/waste/reasons?licenseNumber=#{FACILITY_LICENSE}"
      res = RestClient.get(url, HEADERS)
      JSON.parse(res.body)
    end

    # - Plant Waste Methods and Reasons

    # + Strain API

    def get_strains(facility_license)
      url = "#{BASE_URL}/strains/v1/active?licenseNumber=#{facility_license}"
      res = RestClient.get(url, HEADERS)
      JSON.parse(res.body)
    end

    def create_strains(facility_license, params)
      url = "#{BASE_URL}/strains/v1/create?licenseNumber=#{facility_license}"
      res = RestClient.post(url, params.to_json, HEADERS)
      res.code == 200
    end

    def update_strains(facility_license, params)
      url = "#{BASE_URL}/strains/v1/update?licenseNumber=#{facility_license}"
      res = RestClient.post(url, params.to_json, HEADERS)
      res.code == 200
    end

    # - Strain

    # + Room API

    def get_rooms(facility_license)
      url = "#{BASE_URL}/rooms/v1/active?licenseNumber=#{facility_license}"
      res = RestClient.get(url, HEADERS)
      JSON.parse(res.body)
    end

    def create_rooms(facility_license, params)
      url = "#{BASE_URL}/rooms/v1/create?licenseNumber=#{facility_license}"
      res = RestClient.post(url, params.to_json, HEADERS)
      res.code == 200
    end

    def update_rooms(facility_license, params)
      url = "#{BASE_URL}/rooms/v1/update?licenseNumber=#{facility_license}"
      res = RestClient.post(url, params.to_json, HEADERS)
      res.code == 200
    end

    # - Room

    # + Item API

    def get_items(facility_license)
      url = "#{BASE_URL}/items/v1/active?licenseNumber=#{facility_license}"
      res = RestClient.get(url, HEADERS)
      JSON.parse(res.body)
    end

    def create_items(facility_license, params)
      url = "#{BASE_URL}/items/v1/create?licenseNumber=#{facility_license}"
      res = RestClient.post(url, params.to_json, HEADERS)
      res.code == 200
    end

    def update_items(facility_license, params)
      url = "#{BASE_URL}/items/v1/update?licenseNumber=#{facility_license}"
      res = RestClient.post(url, params.to_json, HEADERS)
      res.code == 200
    end

    def delete_items(facility_license, metrc_item_id)
      url = "#{BASE_URL}/items/v1/#{metrc_item_id}?licenseNumber=#{facility_license}"
      res = RestClient.delete(url, HEADERS)
      res.code == 200
    end

    # - Item API

    # + Plant Batch API

    # By default, query for Batches that was created within the last hour
    def get_plant_batches(lic_no, modified_start = nil, modified_end = nil)
      modified_start ||= (Time.current - 1.hours).utc.iso8601
      modified_end ||= Time.current.utc.iso8601
      url = "#{BASE_URL}/plantbatches/v1/active?licenseNumber=#{lic_no}"
      url += "&lastModifiedStart=#{modified_start}&lastModifiedEnd=#{modified_end}"
      res = RestClient.get(url, HEADERS)
      JSON.parse(res.body)
    end

    def create_plant_batches(lic_no, params)
      url = "#{BASE_URL}/plantbatches/v1/createplantings?licenseNumber=#{lic_no}"
      res = RestClient.post(url, params.to_json, HEADERS)
      res.code == 200
    end

    # - Plant Batch API


    # - Harvest

    def get_harvest_waste_type
      url = "#{BASE_URL}/harvests/v1/waste/types?licenseNumber=#{FACILITY_LICENSE}"
      res = RestClient.get(url, HEADERS)
      JSON.parse(res.body)
    end



  end
end
