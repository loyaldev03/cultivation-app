module Cultivation
  class Batch
    include Mongoid::Document
    include Mongoid::Timestamps::Short

    field :batch_no, type: String
    field :name, type: String
    field :batch_source, type: String
    field :grow_method, type: String
    field :start_date, type: DateTime
    field :estimated_harvest_date, type: DateTime
    field :quantity, type: Integer # Plant quantity for the batch
    field :facility_id, type: BSON::ObjectId

    field :current_growth_stage, type: String
    field :is_active, type: Boolean, default: -> { false }

    belongs_to :facility_strain, class_name: 'Inventory::FacilityStrain'
    has_many :tray_plans, class_name: 'Cultivation::TrayPlan'
    has_many :tasks, class_name: 'Cultivation::Task'
    has_many :plants, class_name: 'Inventory::Plant'

    has_one :nutrient_profile, class_name: 'Cultivation::NutrientProfile'

    def phases
      tasks.where(is_phase: true)
    end

    def orphan_tasks
      tasks.where(parent_id: '', is_phase: false, is_category: false)
    end

    # TODO: is this being used?
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

    def total_estimated_hours
      '%.2f' % tasks.sum(:estimated_hours)
    end

    def total_estimated_costs
      total_cost = 0.0
      tasks.includes(:users).each do |task|
        hours_per_day = task.estimated_hours.to_f / task.duration.to_i
        hours_per_person = hours_per_day / task.user_ids.length
        task_cost = 0.0
        task.users.each do |user|
          task_cost += (user.hourly_rate * hours_per_person) * task.duration
        end
        total_cost += task_cost
      end
      total_cost
    end

    def material_use
      materials = []
      tasks.each do |task|
        task.material_use.each do |material|
          a = materials.find { |b| b.name == material.name }
          if a.nil?
            materials << material
          else
            a.quantity += material.quantity
          end
        end
      end
      materials
    end
  end
end
