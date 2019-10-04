module Inventory
  class QueryHarvestBatches
    prepend SimpleCommand

    HarvestBatchInfo = Struct.new(
      :id,
      :harvest_name,
      :status,
      :harvest_date,
      :facility_strain_id,
      :strain_name,
      :cultivation_batch_id,
      :cultivation_batch_no,
      :cultivation_batch_name,
      :total_wet_weight,
      :total_wet_waste_weight,
      :uom,
      :location_id,
      :location_name,
      :plant_count,
    )
    attr_reader :args, :metadata

    def initialize(facility_id, args = {})
      args = {
        page: 0,
        limit: 20,
        search: nil,
        exclude_tasks: false,
      }.merge(args)
      @facility_id = facility_id
      @facility_strain_ids = Inventory::FacilityStrain.in(facility_id: facility_id).pluck(:id)
      @page = args[:page].to_i
      @limit = args[:limit].to_i
      @search = args[:search]
    end

    def call
      batches = Inventory::HarvestBatch.collection.aggregate([
        {"$sort": {"c_at": -1}},
        match_search,
        match_facility_strain_ids,
        {"$lookup": {from: 'facilities',
                     localField: 'facility_id',
                     foreignField: '_id',
                     as: 'facility'}},
        {"$unwind": {
          "path": '$facility',
          "preserveNullAndEmptyArrays": true,
        }},
        {"$lookup": {from: 'cultivation_batches',
                     localField: 'cultivation_batch_id',
                     foreignField: '_id',
                     as: 'cultivation_batch'}},
        {"$unwind": {
          "path": '$cultivation_batch',
          "preserveNullAndEmptyArrays": true,
        }},
        {"$lookup": {from: 'inventory_facility_strains',
                     localField: 'facility_strain_id',
                     foreignField: '_id',
                     as: 'strain'}},
        {"$unwind": {
          "path": '$strain',
          "preserveNullAndEmptyArrays": true,
        }},
        {"$lookup": {from: 'inventory_plants',
                     localField: '_id',
                     foreignField: 'harvest_batch_id',
                     as: 'plants'}},
        {"$project": {
          "harvest_name": 1,
          "total_wet_weight": 1,
          "total_wet_waste_weight": 1,
          "uom": 1,
          "status": 1,
          "total_trim_weight": 1,
          "total_trim_waste_weight": 1,
          "total_dry_weight": 1,
          "total_cure_weight": 1,
          "current_stage_start_date": 1,
          "cultivation_batch_name": '$cultivation_batch.name',
          "harvest_date": 1,
          "location_id": 1,
          "facility_strain_id": 1,
          "cultivation_batch_id": 1,
          "plants": 1,
          "strain_name": '$strain.strain_name',
          "cultivation_batch_no": '$cultivation_batch.batch_no',
        }},
        {"$facet": {
          metadata: [
            {"$count": 'total'},
            {"$addFields": {
              page: @page,
              pages: {"$ceil": {"$divide": ['$total', @limit]}},
              skip: skip,
              limit: @limit,
            }},
          ],
          data: [
            {"$skip": skip},
            {"$limit": @limit},
          ],
        }},

      ])

      result = batches.to_a[0]
      @metadata = result['metadata'][0]
      json_data = []

      result['data'].each do |x|
        facility = Inventory::FacilityStrain.find(x[:facility_strain_id]&.to_s).facility
        if facility.present?
          location_name = facility.rooms.find_by(id: x[:location_id])&.full_code
        end

        batches_info = HarvestBatchInfo.new(
          x[:_id]&.to_s,
          x[:harvest_name],
          x[:status],
          x[:harvest_date],
          x[:facility_strain_id]&.to_s,
          x[:strain_name],
          x[:cultivation_batch_id]&.to_s,
          x[:cultivation_batch_no],
          " #{x[:cultivation_batch_no]} - #{x[:cultivation_batch_name]}",
          x[:total_wet_weight],
          x[:total_wet_waste_weight],
          x[:uom],
          x[:location_id]&.to_s,
          location_name,
          x[:plants].count,
        )

        json_data << {
          id: x[:_id]&.to_s,
          type: 'harvest_batch',
          attributes: batches_info,
          relationships: {
            plants: x[:plants].map do |plant|
              {
                id: plant[:_id]&.to_s,
                type: 'plant',
              }
            end,
          },

        }
      end
      new_batch_info = {
        metadata: @metadata,
        data: json_data,
      }

      new_batch_info
    end

    private

    def match_facility_strain_ids
      {"$match": {"facility_strain_id": {"$in": @facility_strain_ids}}}
    end

    def match_search
      if @search.present?
        {"$match": {"harvest_name": Regexp.new(@search, Regexp::IGNORECASE)}}
      else
        {"$match": {}}
      end
    end

    def skip
      @skip ||= (@page * @limit)
    end
  end
end
