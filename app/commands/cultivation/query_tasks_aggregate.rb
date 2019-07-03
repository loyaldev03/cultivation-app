module Cultivation
  class QueryTasksAggregate
    prepend SimpleCommand

    WorkerInfo = Struct.new(:id, :name)
    TaskInfo = Struct.new(:wbs,
                          :issue_count,
                          :name,
                          :batch_id,
                          :batch_name,
                          :batch_no,
                          :start_date,
                          :end_date,
                          :estimated_hours,
                          :estimated_cost,
                          :actual_hours,
                          :actual_cost,
                          :phase,
                          :work_status,
                          :workers)

    attr_reader :current_user, :args, :metadata

    def initialize(current_user, args = {})
      @current_user = current_user
      @args = {
        facility_id: nil,
        batch_status: nil,
        task_status: nil,
        page: 0,
        limit: 20,
        search: nil,
      }.merge(args)

      @args[:page] = @args[:page].to_i
      @args[:limit] = @args[:limit].to_i
    end

    def call
      if valid_params?
        criteria = Cultivation::Task.collection.aggregate([
          {"$lookup": {from: 'cultivation_batches',
                       localField: 'batch_id',
                       foreignField: '_id',
                       as: 'batch'}},
          {"$unwind": '$batch'},
          match_facility,
          match_search,
          {"$lookup": {from: 'users',
                       localField: 'user_ids',
                       foreignField: '_id',
                       as: 'worker'}},
          {"$lookup": {from: 'issues_issues',
                       localField: '_id',
                       foreignField: 'task_id',
                       as: 'issues'}},
          {"$project": {"wbs": 1,
                        "issue_count": {"$size": '$issues'},
                        "name": 1,
                        "batch_id": '$batch._id',
                        "batch_name": '$batch.name',
                        "batch_no": '$batch.batch_no',
                        "batch_status": '$batch.status',
                        "start_date": 1,
                        "duration": 1,
                        "estimated_hours": 1,
                        "estimated_labor_cost": 1,
                        "estimated_material_cost": 1,
                        "actual_hours": 1,
                        "actual_cost": 1,
                        "phase": 1,
                        "work_status": 1,
                        "worker._id": 1,
                        "worker.first_name": 1,
                        "worker.last_name": 1}},
          {"$facet": {
            metadata: [
              {"$count": 'total'},
              {"$addFields": {
                page: args[:page],
                pages: {"$ceil": {"$divide": ['$total', args[:limit]]}},
                skip: skip,
                limit: args[:limit],
              }},
            ],
            data: [
              {"$skip": skip},
              {"$limit": args[:limit]},
            ],
          }},
        ])
        result = criteria.to_a[0]
        @metadata = result['metadata'][0]
        tasks = result['data'].map do |x|
          workers = x[:worker].map do |w|
            WorkerInfo.new(
              w[:_id]&.to_s,
              "#{w[:first_name]} #{w[:last_name]}",
            )
          end
          end_date = x[:start_date] + x[:duration].days
          est_labor_cost = x[:estimated_labor_cost] || 0
          est_material_cost = x[:estimated_material_cost] || 0
          TaskInfo.new(
            x[:wbs],
            x[:issue_count],
            x[:name] || 'Unnamed task',
            x[:batch_id]&.to_s,
            x[:batch_name],
            x[:batch_no],
            x[:start_date],
            end_date,
            x[:estimated_hours],
            est_labor_cost + est_material_cost,
            x[:actual_hours],
            x[:actual_cost],
            x[:phase],
            x[:work_status],
            workers,
          )
        end
        tasks
      end
    end

    private

    def match_facility
      if args[:facility_id]
        {"$match": {"batch.facility_id": args[:facility_id].to_bson_id}}
      else
        {"$match": {}}
      end
    end

    def match_search
      if !args[:search].blank?
        {"$match": {"name": Regexp.new(args[:search], Regexp::IGNORECASE)}}
      else
        {"$match": {}}
      end
    end

    def skip
      @skip ||= (args[:page] * args[:limit])
    end

    def valid_params?
      if current_user.nil?
        errors.add(:error, 'Missing params :current_user')
        return false
      end
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
