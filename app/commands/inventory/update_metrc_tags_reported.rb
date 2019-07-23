module Inventory
  class UpdateMetrcTagsReported
    prepend SimpleCommand

    def initialize(args = {})
      args = {
        facility_id: nil,
        metrc_tags: [],
      }.merge(args)

      raise ArgumentError, 'facility_id is empty' if args[:facility_id].nil?

      @facility_id = args[:facility_id]&.to_bson_id
      @metrc_tags = args[:metrc_tags]
    end

    def call
      if @metrc_tags.blank?
        return 0
      end

      Inventory::MetrcTag.where(
        facility_id: @facility_id,
        :tag.in => @metrc_tags,
      ).update_all(
        status: Constants::METRC_TAG_STATUS_ASSIGNED,
        reported_to_metrc: true,
        u_at: Time.current,
      )
    end
  end
end
