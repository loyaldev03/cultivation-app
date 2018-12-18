module Cultivation
  class Task
    include Mongoid::Document
    include Mongoid::Timestamps::Short
    include Mongoid::Orderable

    field :phase, type: String
    field :task_category, type: String
    field :name, type: String
    field :duration, type: Integer
    field :days_from_start_date, type: Integer
    field :start_date, type: DateTime
    field :end_date, type: DateTime
    field :estimated_hours, type: Float
    field :actual_hours, type: Float
    field :estimated_cost, type: Float
    field :actual_cost, type: Float
    # Indicate a top most task
    field :is_phase, type: Boolean, default: -> { false }
    # Indicate a Category task (2nd level task)
    field :is_category, type: Boolean, default: -> { false }
    # Indicate a Growing Period task,  Trays are booked based on duration of
    # this task duration
    field :is_growing_period, type: Boolean, default: -> { false }
    # Unbound task are not bound by parent task's duration
    field :is_unbound, type: Boolean, default: -> { false }
    # Indelible task cannot be remove
    field :indelible, type: Boolean, default: -> { false }
    # Work Breakdown Structure
    field :wbs, type: String
    # Parent task
    field :parent_id, type: BSON::ObjectId
    # Predecessor task
    field :depend_on, type: BSON::ObjectId
    field :task_type, type: Array, default: []

    belongs_to :batch, class_name: 'Cultivation::Batch'
    has_and_belongs_to_many :users, inverse_of: nil
    embeds_many :work_days, class_name: 'Cultivation::WorkDay'
    embeds_many :material_use, class_name: 'Cultivation::Item'
    has_many :children, class_name: 'Cultivation::Task', foreign_key: :parent_id

    orderable scope: :batch, base: 0

    scope :expected_on, -> (date) {
            all.and(:start_date.lte => date, :end_date.gte => date)
          }

    def tasks_depend
      batch.tasks.where(depend_on: id)
    end

    # def children
    #   batch.tasks.where(parent_id: self.id)
    # end

    def parent
      batch.tasks.find_by(id: parent_id)
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
