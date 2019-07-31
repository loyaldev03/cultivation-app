module Inventory
  class QueryMetrcs
    prepend SimpleCommand

    MetrcInfo = Struct.new(:id, :tag, :tag_type, :replaced_by, :u_at)

    attr_reader :args, :metadata

    def initialize(args = {})
      @args = {
        facility_id: nil,
        page: 0,
        limit: 20,
        search: nil,
      }.merge(args)

      @args[:page] = @args[:page].to_i
      @args[:limit] = @args[:limit].to_i
    end

    def call
      if valid_params?
        criteria = Inventory::MetrcTag.collection.aggregate([
          match_search,
          {"$match": {"facility_id": args[:facility_id].to_bson_id}},
          {"$facet": {
            metadata: [
              {"$count": 'total'},
              {"$addFields": {
                page: args[:page],
                pages: {"$ceil": {"$divide": ['$total', args[:limit]]}},
                skip: (args[:page] * args[:limit]),
                limit: args[:limit],
              }},
            ],
            data: [
              {"$skip": (args[:page] * args[:limit])},
              {"$limit": args[:limit]},
            ],
          }},
        ])
        result = criteria.to_a[0]
        @metadata = result['metadata'][0]

        result
      end
    end

    private

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
      if args[:page].negative?
        errors.add(:error, 'params :page must either zero or positive')
        return false
      end
      if !args[:limit].positive?
        errors.add(:error, 'params :limit must be positive')
        return false
      end
      true
    end
  end
end
