module Inventory
  class QueryAvailableMetrcTags
    prepend SimpleCommand

    def initialize(facility_id, count, tag_type)
      @facility_id = facility_id
      @count = count
      @tag_type = tag_type
    end

    def call
      Inventory::MetrcTag.where(
        facility_id: @facility_id,
        status: Constants::METRC_TAG_STATUS_AVAILABLE,
        tag_type: @tag_type,
      ).limit(@count).to_a
    end
  end
end
