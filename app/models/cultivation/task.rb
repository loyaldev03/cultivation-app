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
    field :expected_start_date, type: DateTime
    field :expected_end_date, type: DateTime
    field :start_date, type: DateTime
    field :end_date, type: DateTime
    field :estimated_hours, type: BigDecimal
    field :actual_hours, type: BigDecimal
    field :estimated_cost, type: BigDecimal
    field :actual_cost, type: BigDecimal

    # TODO: To be removed
    field :no_of_employees, type: Integer #needed

    # TODO: To be removed
    field :materials, type: String                            # later need to integrate with real material module
    field :instruction, type: String
    field :is_phase, type: Boolean, default: -> { false }     # to identify phase
    field :is_category, type: Boolean, default: -> { false }  # to identify category
    field :parent_id, type: String
    field :depend_on, type: String
    field :task_type, type: Array, default: []

    has_and_belongs_to_many :users, inverse_of: nil
    belongs_to :batch, class_name: 'Cultivation::Batch'
    embeds_many :work_days, class_name: 'Cultivation::WorkDay'
    embeds_many :items, class_name: 'Cultivation::Item'

    orderable scope: :batch, base: 0

    scope :expected_on, -> (date) {
            all.and(:expected_start_date.lte => date, :expected_end_date.gte => date)
          }

    def tasks_depend
      batch.tasks.where(depend_on: self.id)
    end

    def children
      batch.tasks.where(parent_id: self.id)
    end

    def parent
      batch.tasks.find_by(id: self.parent_id)
    end
  end
end
