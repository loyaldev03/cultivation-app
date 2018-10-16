module Cultivation
  class Batch
    include Mongoid::Document
    include Mongoid::Timestamps::Short

    field :batch_no, type: String
    field :name, type: String
    field :batch_source, type: String
    field :start_date, type: DateTime
    field :estimated_harvest_date, type: DateTime
    field :facility_id, type: BSON::ObjectId
    field :grow_method, type: String
    field :is_active, type: Boolean, default: -> { false }

    has_many :tray_plans, class_name: 'Cultivation::TrayPlan'
    has_many :tasks, class_name: 'Cultivation::Task'
    belongs_to :strain, class_name: 'Common::Strain', optional: true

    # KW: New fields replacing strain and plants
    belongs_to :facility_strain, class_name: 'Inventory::FacilityStrain', optional: true
    has_many :plants, class_name: 'Inventory::Plant'

    has_one :nutrient_profile, class_name: 'Cultivation::NutrientProfile'

    def phases
      tasks.where(is_phase: true)
    end

    def orphan_tasks
      tasks.where(parent_id: '', is_phase: false, is_category: false)
    end

    def generate_tree
      tasks = []
      orphan_tasks.each do |task|
        tasks << task
      end
      phases.each do |phase|
        tasks << phase
        phase.children.each do |children|
          tasks << children
          children.children.each do |children|
            tasks << children
          end
          dependent_task(tasks, children)
        end
      end
      tasks
    end

    def dependent_task(tasks, task)
      return if task.tasks_depend.count == 0
      task.tasks_depend.each do |task_depend|
        tasks << task_depend
        task_depend.children.each do |children|
          tasks << children
        end
        dependent_task(tasks, task_depend)
      end
    end
  end
end
