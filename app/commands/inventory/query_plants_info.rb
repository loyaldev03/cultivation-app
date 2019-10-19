module Inventory
  class QueryPlantsInfo
    prepend SimpleCommand

    PlantInfo = Struct.new(:id, :plant_id,
                           :plant_tag,
                           :status,
                           :current_growth_stage,
                           :wet_weight,
                           :wet_weight_uom,
                           :lot_number,
                           :mother_date,
                           :planting_date,
                           :veg_date,
                           :veg1_date,
                           :veg2_date,
                           :flower_date,
                           :harvest_date,
                           :manifest_no,
                           :destroyed_date,
                           :destroyed_reason,
                           :cultivation_batch,
                           :cultivation_batch_id,
                           :cultivation_batch_name,
                           :batch_growth_stage,
                           :batch_start_date,
                           :estimated_harvest_date,
                           :current_stage_start_date,
                           :strain_id,
                           :strain_name,
                           :mother_id,
                           :c_at,
                           :location_id,
                           :location_type,
                           :location_name,
                           :location_full_path)
    attr_reader :args, :metadata

    def initialize(args = {})
      args = {
        growth_stages: [], # Growth stages to return (e.g. [:clone, :veg1])
        excludes: [],
        facility_strain_ids: [],
        page: 0,
        limit: 20,
        search: nil,
      }.merge(args)

      #raise "#{args[:page]}"

      @growth_stages = args[:growth_stages]
      @locations = args[:locations]
      @excludes = args[:excludes]
      @search = args[:search]
      @destroy_plant = args[:destroyed_plant] if args[:destroyed_plant].present?

      @facility_strain_ids = args[:facility_strain_ids]
      @facility_strain_id = args[:facility_strain_id]
      @page = args[:page].to_i
      @limit = args[:limit].to_i
    end

    def call
      if valid_params?
        plants = Inventory::Plant.includes(:facility_strain, :cultivation_batch).collection.aggregate([
          {"$sort": {"c_at": -1}},
          get_destroy_plants,
          match_search,
          match_grow_phase,
          match_excludes,
          match_facility_strain_ids,
          {"$lookup": {from: 'cultivation_batches',
                       localField: 'cultivation_batch_id',
                       foreignField: '_id',
                       as: 'batch'}},

          {"$unwind": {
            "path": '$batch',
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
          {"$project": {
            "plant_id": 1,
            "plant_tag": 1,
            "status": 1,
            "current_growth_stage": 1,
            "wet_weight": 1,
            "lot_number": 1,
            "mother_date": 1,
            "planting_date": 1,
            "veg_date": 1,
            "veg1_date": 1,
            "veg2_date": 1,
            "flower_date": 1,
            "harvest_date": 1,
            "manifest_no": 1,
            "destroyed_date": 1,
            "destroyed_reason": 1,
            "batch_growth_stage": '$batch.current_growth_stage',
            "batch_start_date": '$batch.start_date',
            "estimated_harvest_date": '$batch.estimated_harvest_date',
            "current_stage_start_date": '$batch.current_stage_start_date',
            "strain_id": '$strain._id',
            "strain_name": '$strain.strain_name',
            "mother_id": 1,
            "c_at": 1,
            "batch_id": '$batch._id',
            "batch_name": '$batch.name',
            "batch_no": '$batch.batch_no',
            "location_id": 1,
            "location_type": 1,
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

        ], {
          "allowDiskUse": true,
        })
        result = plants.to_a[0]
        @metadata = result['metadata'][0]
        json_data = []
        result['data'].each do |x|
          if x[:location_id].present?
            location_name = @locations.get_location_code(x[:location_id])
            location_full_path = @locations.get_location_name(x[:location_id])
          else
            location_name = nil
            location_full_path = nil
          end

          if x[:batch_no].present? && x[:batch_no].present?
            batch = "#{x[:batch_no]} - #{x[:batch_name]}"
          else
            batch = nil
          end

          plants = PlantInfo.new(
            x[:_id]&.to_s,
            x[:plant_id],
            x[:plant_tag],
            x[:status],
            x[:current_growth_stage],
            x[:wet_weight],
            x[:wet_weight_uom],
            x[:lot_number],
            x[:mother_date],
            x[:planting_date],
            x[:veg_date],
            x[:veg1_date],
            x[:veg2_date],
            x[:flower_date],
            x[:harvest_date],
            x[:manifest_no],
            x[:destroyed_date],
            x[:destroyed_reason],
            batch,
            x[:batch_id]&.to_s,
            x[:batch_name],
            x[:batch_growth_stage],
            x[:batch_start_date],
            x[:estimated_harvest_date],
            x[:current_stage_start_date],
            x[:strain_id]&.to_s,
            x[:strain_name],
            x[:mother_id]&.to_s,
            x[:c_at],
            x[:location_id]&.to_s,
            x[:location_type],
            location_name,
            location_full_path
          )

          json_data << {
            id: x[:_id]&.to_s,
            type: 'plant',
            attributes: plants,
          }
        end

        new_tasks_info = {
          metadata: @metadata,
          data: json_data,
        }

        new_tasks_info
      end
    end

    private

    def skip
      @skip ||= (@page * @limit)
    end

    def get_destroy_plants
      if @destroy_plant.present? && @destroy_plant == 'true'
        {"$match": {"destroyed_date": {"$ne": nil}}}
      else
        {"$match": {}}
      end
    end

    def match_grow_phase
      if !@growth_stages.empty?
        {"$match": {"current_growth_stage": {"$in": @growth_stages}}}
      else
        {"$match": {}}
      end
    end

    def match_facility_strain_ids
      if !@facility_strain_ids.empty?
        {"$match": {"facility_strain_id": {"$in": @facility_strain_ids.map { |x| x.to_bson_id }}}}
      else
        {"$match": {"facility_strain_id": {"$in": @facility_strain_ids}}}
      end
    end

    def match_facility_strain_id
      if !@facility_strain_id.present?
        {"$match": {"facility_strain_id": @facility_strain_id.to_bson_id}}
      else
        {"$match": {}}
      end
    end

    def match_excludes
      if !@excludes.empty?
        {"$match": {"current_growth_stage": {"$nin": @excludes}}}
      else
        {"$match": {}}
      end
    end

    def match_search
      if @search.present?
        {"$match": {"$or": [{"plant_id": Regexp.new(@search, Regexp::IGNORECASE)}, {"plant_tag": Regexp.new(@search, Regexp::IGNORECASE)}]}}
      else
        {"$match": {}}
      end
    end

    def valid_params?
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
