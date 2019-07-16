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
  end
end
