module Cultivation
  class Task
    include Mongoid::Document
    include Mongoid::Timestamps::Short
    include Mongoid::Orderable

    attr_accessor :wbs

    field :phase, type: String
    field :name, type: String
    field :indent, type: Integer, default: -> { 0 }
    field :duration, type: Integer
    field :start_date, type: Time
    field :end_date, type: Time
    field :estimated_hours, type: Float, default: -> { 0 }
    field :actual_hours, type: Float, default: -> { 0 }
    field :estimated_cost, type: Float, default: -> { 0 }
    field :actual_cost, type: Float, default: -> { 0 }
    # Indelible task cannot be remove, possible values: 'cleaning', 'moving'
    field :indelible, type: String
    # Predecessor task
    field :depend_on, type: BSON::ObjectId
    field :task_type, type: Array, default: []
    field :location_id, type: BSON::ObjectId

    belongs_to :batch, class_name: 'Cultivation::Batch'
    has_and_belongs_to_many :users, inverse_of: nil
    embeds_many :work_days, class_name: 'Cultivation::WorkDay'
    embeds_many :material_use, class_name: 'Cultivation::Item'

    has_many :issues, class_name: 'Issues::Issue'
    orderable scope: :batch, base: 0

    scope :expected_on, -> (date) {
            all.and(:start_date.lte => date, :end_date.gte => date)
          }

    def tasks_depend
      batch.tasks.where(depend_on: id)
    end

    def have_children?(batch_tasks)
      if wbs.empty?
        raise ArgumentError, 'Missing :wbs when calling children. Use Task retrieve via QueryTasks.'
      end
      WbsTree.have_children?(wbs, batch_tasks)
    end

    def children(batch_tasks)
      if wbs.empty?
        raise ArgumentError, 'Missing :wbs when calling children. Use Task retrieve via QueryTasks.'
      end
      WbsTree.children(batch_tasks, wbs)
    end

    def first_child?
      if wbs.empty?
        raise ArgumentError, 'Missing :wbs when calling children. Use Task retrieve via QueryTasks.'
      end
      wbs.ends_with? '.1'
    end

    def child_of?(predecessor_wbs, batch_tasks)
      if wbs.empty?
        raise ArgumentError, 'Missing :wbs when calling children. Use Task retrieve via QueryTasks.'
      end
      WbsTree.child_of?(wbs, predecessor_wbs, batch_tasks)
    end

    def parent(batch_tasks)
      if wbs.empty?
        raise ArgumentError, 'Missing :wbs when calling parent. Use Task retrieve via QueryTasks.'
      end
      WbsTree.parent(batch_tasks, wbs)
    end

    def predecessor(batch_tasks)
      if wbs.empty?
        raise ArgumentError, 'Missing :wbs when calling parent. Use Task retrieve via QueryTasks.'
      end
      batch_tasks.detect { |t| t.id == depend_on }
    end

    # Find tasks that depends on current task
    def dependents(batch_tasks)
      batch_tasks.select do |t|
        t.depend_on &&
          # Dependent tasks should have depends on set to current task
          t.depend_on.to_s == id.to_s
      end
    end

    def indelible?
      !indelible.nil? && !indelible.blank?
    end
  end
end
