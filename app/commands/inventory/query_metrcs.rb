module Inventory
  class QueryMetrcs
    prepend SimpleCommand

    MetrcInfo = Struct.new(:id, :tag, :tag_type, :replaced_by, :reported_to_metrc, :u_at)

    attr_reader :args, :metadata

    def initialize(args = {})
      @args = {
        facility_id: nil,
        page: 0,
        limit: 20,
        search: nil,
      }.merge(args)
      @facility_ids = args[:facility_id].split(',')
      @page = @args[:page].to_i
      @limit = @args[:limit].to_i
    end

    def call
      if valid_params?
        if resource_shared?
          facilities = Facility.in(_id: @user.facilities).pluck(:id)
        else
          facilities = Facility.in(_id: @facility_ids.map { |x| x.to_bson_id }).pluck(:id)
        end
        criteria = Inventory::MetrcTag.collection.aggregate([
          match_search,
          {"$match": {"facility_id": {"$in": facilities}}},
          {"$facet": {
            metadata: [
              {"$count": 'total'},
              {"$addFields": {
                page: @page,
                pages: {"$ceil": {"$divide": ['$total', @limit]}},
                skip: (args[:page] * @limit),
                limit: @limit,
              }},
            ],
            data: [
              {"$skip": (@page * @limit)},
              {"$limit": @limit},
            ],
          }},
        ])
        result = criteria.to_a[0]
        @metadata = result['metadata'][0]

        result
      end
    end

    private

    def resource_shared?
      CompanyInfo.last.enable_resouces_sharing
    end

    def match_search
      if !args[:search].blank?
        {"$match": {"tag": Regexp.new(args[:search], Regexp::IGNORECASE)}}
      else
        {"$match": {}}
      end
    end

    def skip
      @skip ||= (args[:page] * args[:limit])
    end

    def valid_params?
      if args[:facility_id].nil?
        errors.add(:error, 'Missing params :facility_id')
        return false
      end
      if @page.negative?
        errors.add(:error, 'params :page must either zero or positive')
        return false
      end
      if !@limit.positive?
        errors.add(:error, 'params :limit must be positive')
        return false
      end
      true
    end
  end
end
