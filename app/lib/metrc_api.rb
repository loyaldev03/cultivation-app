class MetrcApi
  BASE_URL = 'https://sandbox-api-ca.metrc.com'.freeze
  # TODO: Move this to user specific store
  FACILITY_LICENSE = 'CML17-0000001'.freeze
  HEADERS = {
    # TODO: Move this to user specific store
    Authorization: 'Basic aktMcnhNM0ZuSExpZlVDYkxVOHAxdER4c2ppbWJBS0haN3I0RUsydGo4TmIwZGIxOkZ1c1ZiZTRZdjZXMURHTnV4S05oQnlYVTZSTzZqU1VQY2JSQ29SREQ5OFZOWGM0RA==',
    accept: :json,
  }.freeze

  class << self
    def get_unit_of_measure
      url = "#{BASE_URL}/unitsofmeasure/v1/active"
      res = RestClient.get(url, HEADERS)
      JSON.parse(res.body)
    end

    def get_item_categories
      url = "#{BASE_URL}/items/v1/categories"
      res = RestClient.get(url, HEADERS)
      JSON.parse(res.body)
    end
  end
end
