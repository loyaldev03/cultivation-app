module Cultivation
  class Batch
    include Mongoid::Document
    include Mongoid::Timestamps::Short

    field :batch_no, type: String
    field :name, type: String
    field :batch_source, type: String
    field :grow_method, type: String
    field :start_date, type: Time
    field :estimated_harvest_date, type: Time
    # Planned quantity for the batch (capacity needed)
    field :quantity, type: Integer
    field :current_growth_stage, type: String
    # Active Batch would affect the capacity of the Booked Tray.
    field :is_active, type: Boolean, default: -> { false }
    # This is the mothers' plantId
    field :selected_plants, type: Array, default: []
    field :status, type: String, default: Constants::BATCH_STATUS_DRAFT

    belongs_to :facility_strain, class_name: 'Inventory::FacilityStrain'
    belongs_to :facility, class_name: 'Facility'
    has_many :tray_plans, class_name: 'Cultivation::TrayPlan'
    has_many :tasks, class_name: 'Cultivation::Task'
    has_many :plants, class_name: 'Inventory::Plant'
    has_one :nutrient_profile, class_name: 'Cultivation::NutrientProfile'

    def dependent_task(tasks, task)
      return if task.tasks_depend.count.zero?
      task.tasks_depend.each do |task_depend|
        tasks << task_depend
        task_depend.children.each do |children|
          tasks << children
        end
        dependent_task(tasks, task_depend)
      end
    end

    # FIXME: Not correct. Only sum tasks with no child task
    def total_estimated_hours
      '%.2f' % tasks.sum(:estimated_hours)
    end

    def total_estimated_costs
      # hours per day = estimated hours(5hours) / duration(5 days)
      # hours_per_person = hours_per_day / no of resource
      total_cost = 0.0
      tasks.includes(:users).each do |task|
        hours_per_day = task.duration.to_i > 0 ? (task.estimated_hours.to_f / task.duration.to_i) : 0
        hours_per_person = task.user_ids.length > 0 ? (hours_per_day / task.user_ids.length) : 0
        task_cost = 0.0
        task.users.each do |user|
          task_cost += (user.hourly_rate.to_f * hours_per_person) * task.duration.to_i
        end
        total_cost += task_cost
      end
      total_cost
    end

    def material_use
      materials = []
      tasks.each do |task|
        # FIXME
        # task.material_use.each do |material|
        #   a = materials.find { |b| b.name == material.name }
        #   if a.nil?
        #     materials << material
        #   else
        #     a.quantity += material.quantity
        #   end
        # end
      end
      materials
    end

    def material_summary
      new_materials = material_use.map { |material|
        Rails.logger.debug "Material Details ==> #{material.inspect}"
        Rails.logger.debug "Facility Id ==> #{facility_id}"
        transaction = Inventory::ItemTransaction.where(facility_id: facility_id, catalogue_id: material.catalogue_id)
        sum = 0
        transaction.each do |a|
          sum += a.quantity
        end

        batches = Cultivation::Batch
        batches.each do |batch|
          break if batch.id == id
          item = batch.material_use.find { |b| b.name == material.name }
          sum -= item.quantity if item
          sum = 0 if sum < 0
        end

        OpenStruct.new({
          name: material.name,
          quantity: material.quantity,
          uom: material.uom,
          inventory_quantity: sum,
        })
      }
      new_materials
    end
  end
end
