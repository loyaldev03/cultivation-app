module Inventory
  class QueryCultBatch
    prepend SimpleCommand

    BatchInfo = Struct.new(
      :id,
      :name,
      :batch_source,
      :status,
      :batch_no,
      :start_date,
      :current_stage_start_date,
      :estimated_hours,
      :actual_hours,
      :grow_method,
      :current_growth_stage,
      :estimated_harvest_date,
      :estimated_labor_cost,
      :actual_labor_cost,
      :facility_id,
      :facility_strain_id,
      :strain_name,
      :veg_duration,
      :veg1_duration,
      :veg2_duration,
      :flower_duration,
      :dry_duration,
      :cure_duration,
      :plant_count,
      :destroyed_plants_count,
      :current_stage_location,
      :facility_name,
      :value,
      :label
    )

    TaskInfo = Struct.new(:id)
    attr_reader :args, :metadata

    def initialize(facility_id, args = {})
      args = {
        page: 0,
        limit: 20,
        search: nil,
        exclude_tasks: false,
      }.merge(args)
      @facility_id = facility_id
      @page = args[:page].to_i
      @limit = args[:limit].to_i
      @search = args[:search]
      @exclude_tasks = args[:exclude_tasks]
      Rails.logger.debug("FACILITY COMMAND => #{@facility_id} ")
    end

    def call
      batches = Cultivation::Batch.collection.aggregate([
        match_search,
        match_facility,
        {"$lookup": {from: 'facilities',
                     localField: 'facility_id',
                     foreignField: '_id',
                     as: 'facility'}},
        {"$unwind": {
          "path": '$facility',
          "preserveNullAndEmptyArrays": true,
        }},
        {"$lookup": {from: 'cultivation_tasks',
                     localField: '_id',
                     foreignField: 'batch_id',
                     as: 'tasks'}},
        {"$lookup": {from: 'inventory_plants',
                     localField: '_id',
                     foreignField: 'cultivation_batch_id',
                     as: 'plants'}},
        {"$lookup": {from: 'inventory_facility_strains',
                     localField: 'facility_strain_id',
                     foreignField: '_id',
                     as: 'strain'}},
        {"$unwind": {
          "path": '$strain',
          "preserveNullAndEmptyArrays": true,
        }},
        {"$project": {
          "batch_no": 1,
          "name": 1,
          "batch_source": 1,
          "status": 1,
          "start_date": 1,
          "estimated_hours": 1,
          "actual_hours": 1,
          "estimated_labor_cost": 1,
          "actual_labor_cost": 1,
          "current_stage_start_date": 1,
          "estimated_harvest_date": 1,
          "grow_method": 1,
          "facility_id": 1,
          "facility_strain_id": 1,
          "current_growth_stage": 1,
          "destroyed_plants_count": 1,
          "current_stage_location": 1,
          "tasks": 1,
          "plants": 1,
          "strain_name": '$strain.strain_name',
          "facility_name": '$facility.name',
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

      phases = Cultivation::Task.where(
        batch_id: {:$in => result['data'].pluck(:_id)},
        indent: 0,
        phase: {:$in => [
          Constants::CONST_CLONE, Constants::CONST_VEG, Constants::CONST_VEG1, Constants::CONST_VEG2,
          Constants::CONST_FLOWER, Constants::CONST_DRY, Constants::CONST_CURE,
        ]},
      ).map { |task| ["#{task.batch_id.to_s}/#{task.phase}", task] }.to_h

      result['data'].each do |x|
        if phases
          veg_key = "#{x[:_id]&.to_s}/#{Constants::CONST_VEG}"
          veg_phase = phases[veg_key]
          veg_duration = veg_phase.duration if veg_phase

          veg1_key = "#{x[:_id]&.to_s}/#{Constants::CONST_VEG1}"
          veg1_phase = phases[veg1_key]
          veg1_duration = veg1_phase.duration if veg1_phase

          veg2_key = "#{x[:_id]&.to_s}/#{Constants::CONST_VEG2}"
          veg2_phase = phases[veg2_key]
          veg2_duration = veg2_phase.duration if veg2_phase

          flower_key = "#{x[:_id]&.to_s}/#{Constants::CONST_FLOWER}"
          flower_phase = phases[flower_key]
          flower_duration = flower_phase.duration if flower_phase

          dry_key = "#{x[:_id]&.to_s}/#{Constants::CONST_DRY}"
          dry_phase = phases[dry_key]
          dry_duration = dry_phase.duration if dry_phase

          cure_key = "#{x[:_id]&.to_s}/#{Constants::CONST_CURE}"
          cure_phase = phases[cure_key]
          cure_duration = cure_phase.duration if cure_phase
        end

        batches_info = BatchInfo.new(
          x[:_id]&.to_s,
          x[:name]&.to_s,
          x[:batch_source],
          x[:status],
          x[:batch_no],
          x[:start_date],
          x[:current_stage_start_date],
          x[:estimated_hours],
          x[:actual_hours],
          x[:grow_method],
          x[:current_growth_stage],
          x[:estimated_harvest_date],
          x[:estimated_labor_cost],
          x[:actual_labor_cost],
          x[:facility_id]&.to_s,
          x[:facility_strain_id]&.to_s,
          x[:strain_name],
          veg_duration,
          veg1_duration,
          veg2_duration,
          flower_duration,
          dry_duration,
          cure_duration,
          x[:plants].count,
          x[:destroyed_plants_count],
          x[:current_stage_location],
          x[:facility_name],
          x[:_id]&.to_s,
          "#{x[:batch_no]} - #{x[:name]}, #{x[:strain_name]}"

        )
        if !@exclude_tasks
          json_data << {
            id: x[:_id]&.to_s,
            type: 'batch',
            attributes: batches_info,
            relationships: {
              tasks: x[:tasks].map do |task|
                {
                  id: task[:_id]&.to_s,
                  type: 'task',
                }
              end,
            },

          }
        else
          json_data << {
            id: x[:_id]&.to_s,
            type: 'batch',
            attributes: batches_info,

          }
        end
      end

      new_batch_info = {
        metadata: @metadata,
        data: json_data,
      }

      new_batch_info
    end

    private

    def match_facility
      {"$match": {"facility_id": {"$in": @facility_id}}}
    end

    def match_search
      if @search.present?
        {"$match": {"$or": [{"batch_no": Regexp.new(@search, Regexp::IGNORECASE)}, {"name": Regexp.new(@search, Regexp::IGNORECASE)}]}}
      else
        {"$match": {}}
      end
    end

    def skip
      @skip ||= (@page * @limit)
    end
  end
end
