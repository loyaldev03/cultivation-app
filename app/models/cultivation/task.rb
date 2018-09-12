module Cultivation
  class Task
    include Mongoid::Document
    include Mongoid::Timestamps::Short

    field :phase, type: String
    field :task_category, type: String
    field :name, type: String
    field :days, type: String
    field :days_from_start_date, type: Integer
    field :expected_start_date, type: DateTime
    field :expected_end_date, type: DateTime
    field :start_date, type: DateTime
    field :end_date, type: DateTime
    field :estimated_hours, type: Float
    field :time_taken, type: Float #actual time taken
    field :no_of_employees, type: Integer #needed
    field :materials, type: String # later need to integrate with real material module
    field :instruction, type: String
    field :isPhase, type: Boolean, default: -> { false } #to identify phase
    field :isCategory, type: Boolean, default: -> { false } #to identify category
    field :parent_id, type: String
    field :depend_on, type: String

    embeds_many :users, class_name: 'User'
    belongs_to :batch, class_name: 'Cultivation::Batch'


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
