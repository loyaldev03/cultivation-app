module Cultivation
  class Task
    include Mongoid::Document
    include Mongoid::Timestamps::Short
    include Mongoid::Orderable
    include Mongoid::History::Trackable

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

    field :estimated_material_cost, type: Float, default: -> { 0 }
    field :actual_material_cost, type: Float, default: -> { 0 }

    field :water_ph, type: Float, default: -> { 0.0 }
    # Indelible task cannot be remove, possible values: 'cleaning', 'moving' (see template json for more example)
    field :indelible, type: String
    # Predecessor task
    field :depend_on, type: BSON::ObjectId
    # Task Location Info
    field :location_id, type: BSON::ObjectId
    field :location_type, type: String # full ruby class name

    field :work_status, type: String, default: 'new' # use for daily task => new, started, stuck
    field :package_id, type: BSON::ObjectId   # Used by task related to sales product.

    #notes => Material used and waste in daily task should use ItemTransaction , use event_type for material_used or material_wasted
    belongs_to :batch, class_name: 'Cultivation::Batch', optional: true
    belongs_to :facility, class_name: 'Facility'

    has_many :time_logs, class_name: 'Cultivation::TimeLog', dependent: :delete_all
    has_many :issues, class_name: 'Issues::Issue', dependent: :delete_all
    has_many :movement_histories, class_name: 'Cultivation::PlantMovementHistory', dependent: :delete_all

    has_and_belongs_to_many :users, class_name: 'User', inverse_of: nil

    embeds_many :material_use, class_name: 'Cultivation::Item', cascade_callbacks: true
    embeds_many :add_nutrients, as: :nutrition, class_name: 'Inventory::Nutrient'
    embeds_many :notes, class_name: 'Cultivation::Note'

    orderable scope: :batch, base: 0

    track_history on: [:phase,
                       :name,
                       :duration,
                       :start_date,
                       :end_date,
                       :estimated_hours,
                       :depend_on,
                       :location_id,
                       :location_type,
                       :work_status,
                       :add_nutrients,
                       :notes],
                  modifier_field: :modifier,
                  modifier_field_inverse_of: nil,
                  modifier_field_optional: true,
                  tracker_class_name: :task_history_tracker

    scope :expected_on, -> (date) {
            where(:batch_id.in => Cultivation::Batch.active.pluck(:id)).and(:start_date.lte => date, :end_date.gte => date)
          }

    def tasks_depend
      batch.tasks.where(depend_on: id)
    end

    def have_children?(batch_tasks)
      if !wbs.present?
        raise ArgumentError, 'Missing :wbs when calling children. Use Task retrieve via QueryTasks.'
      end
      WbsTree.have_children?(wbs, batch_tasks)
    end

    def children(batch_tasks)
      if !wbs.present?
        raise ArgumentError, 'Missing :wbs when calling children. Use Task retrieve via QueryTasks.'
      end
      WbsTree.children(batch_tasks, wbs)
    end

    def first_child?
      if !wbs.present?
        raise ArgumentError, 'Missing :wbs when calling first_child. Use Task retrieve via QueryTasks.'
      end
      wbs.ends_with? '.1'
    end

    def child_of?(predecessor_wbs, batch_tasks)
      if !wbs.present?
        raise ArgumentError, 'Missing :wbs when calling child_of. Use Task retrieve via QueryTasks.'
      end
      WbsTree.child_of?(wbs, predecessor_wbs, batch_tasks)
    end

    def siblings(batch_tasks)
      if !wbs.present?
        raise ArgumentError, 'Missing :wbs when calling siblings. Use Task retrieve via QueryTasks.'
      end
      WbsTree.siblings(batch_tasks, wbs)
    end

    def parent(batch_tasks)
      if !wbs.present?
        raise ArgumentError, 'Missing :wbs when calling parent. Use Task retrieve via QueryTasks.'
      end
      WbsTree.parent(batch_tasks, wbs)
    end

    def predecessor(batch_tasks)
      if !wbs.present?
        raise ArgumentError, 'Missing :wbs when calling predecessor. Use Task retrieve via QueryTasks.'
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

    def sum_actual_hours
      time_logs.map { |a| a.duration_in_hours }.sum
    end
  end
end
