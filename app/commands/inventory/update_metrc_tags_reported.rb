module Inventory
  class UpdateMetrcTagsReported
    prepend SimpleCommand

    def initialize(args = {})
      args = {
        facility_id: nil,
        metrc_tags: [],
      }.merge(args)

      raise ArgumentError, 'facility_id is empty' if args[:facility_id].nil?
      raise ArgumentError, 'metrc_tags is empty' if args[:metrc_tags].blank?
      raise ArgumentError, 'metrc_tags is not Array' unless args[:metrc_tags].is_a?(Array)

      @facility_id = args[:facility_id]&.to_bson_id
      @metrc_tags = args[:metrc_tags]
    end

    def call
      Inventory::MetrcTag.where(
        facility_id: @facility_id,
        status: Constants::METRC_TAG_STATUS_AVAILABLE,
        :tag.in => @metrc_tags,
      ).update_all(
        reported_to_metrc: true,
        u_at: Time.current,
      )
    end
  end
end
