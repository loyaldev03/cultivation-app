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
    field :is_phase, type: Boolean, default: -> { false }     # to identify phase
    field :is_category, type: Boolean, default: -> { false }  # to identify category
    field :is_growing_period, type: Boolean, default: -> { false } # tray plan is the growing period
    field :is_unbound, type: Boolean, default: -> { false }   # unbound task are to tied to parent's dates
    field :indelible, type: Boolean, default: -> { false }    # is task indelible? default false
    field :parent_id, type: BSON::ObjectId
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
      batch.tasks.where(depend_on: self.id)
    end

    # def children
    #   batch.tasks.where(parent_id: self.id)
    # end

    def parent
      batch.tasks.find_by(id: self.parent_id)
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
