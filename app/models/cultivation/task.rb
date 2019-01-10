module Cultivation
  class Task
    include Mongoid::Document
    include Mongoid::Timestamps::Short
    include Mongoid::Orderable

    attr_accessor :wbs

    field :phase, type: String
    # FIXME: Remove
    field :task_category, type: String
    field :name, type: String
    field :indent, type: Integer, default: -> { 0 }
    field :duration, type: Integer
    field :days_from_start_date, type: Integer
    field :start_date, type: Time
    field :end_date, type: Time
    field :estimated_hours, type: Float
    field :actual_hours, type: Float
    field :estimated_cost, type: Float
    field :actual_cost, type: Float
    # Indicate a top most task
    # FIXME: Remove
    field :is_phase, type: Boolean, default: -> { false }
    # Indicate a Category task (2nd level task)
    # FIXME: Remove
    field :is_category, type: Boolean, default: -> { false }
    # Indelible task cannot be remove, possible values: 'cleaning', 'moving'
    field :indelible, type: String
    # FIXME: Remove - Parent task
    field :parent_id, type: BSON::ObjectId
    # Predecessor task
    field :depend_on, type: BSON::ObjectId
    field :task_type, type: Array, default: []

    belongs_to :batch, class_name: 'Cultivation::Batch'
    has_and_belongs_to_many :users, inverse_of: nil
    embeds_many :work_days, class_name: 'Cultivation::WorkDay'
    embeds_many :material_use, class_name: 'Cultivation::Item'

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
      WbsTree.have_children(batch_tasks, wbs)
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

    def parent(batch_tasks)
      if wbs.empty?
        raise ArgumentError, 'Missing :wbs when calling parent. Use Task retrieve via QueryTasks.'
      end
      WbsTree.parent(batch_tasks, wbs)
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

    def estimated_cost
      if estimated_hours && duration
        hours_per_day = estimated_hours.to_f / duration.to_i
      end

      if hours_per_day && !user_ids.empty?
        hours_per_person = hours_per_day / user_ids.length
      end

      task_cost = 0.0
      duration ||= 0
      if hours_per_person && !users.empty?
        users.each do |user|
          task_cost += (user&.hourly_rate.to_f * hours_per_person) * duration
        end
      end
      task_cost
    end
  end
end
