module Cultivation
  class Batch
    include Mongoid::Document
    include Mongoid::Timestamps::Short
    include Mongoid::History::Trackable

    field :batch_no, type: String
    field :name, type: String
    field :batch_source, type: String
    field :grow_method, type: String
    field :start_date, type: Time
    field :estimated_harvest_date, type: Time
    field :estimated_hours, type: Float, default: -> { 0 }

    # Labor cost
    field :actual_hours, type: Float, default: -> { 0 }
    field :estimated_labor_cost, type: Float, default: -> { 0 }
    field :actual_labor_cost, type: Float, default: -> { 0 }

    # Material cost
    field :estimated_material_cost, type: Float, default: -> { 0 }
    field :actual_material_cost, type: Float, default: -> { 0 }

    # Planned quantity for the batch (capacity needed)
    field :quantity, type: Integer
    field :current_growth_stage, type: String
    # Location of this batch at current growth stage
    field :current_stage_location, type: String
    # Start date of the current growth stage
    field :current_stage_start_date, type: Time
    # Selected Mother Plants (IDs)
    field :selected_plants, type: Array, default: []
    # Selected Mother Plant location (for Sunburst)
    field :selected_location, type: BSON::ObjectId
    # Draft - Draft batch should not trigger validation
    # Scheduled, Active - Take up spaces in Tray Plan
    field :status, type: String, default: Constants::BATCH_STATUS_DRAFT

    field :destroyed_plants_count, type: Integer, default: -> { 0 }

    belongs_to :facility_strain, class_name: 'Inventory::FacilityStrain'
    belongs_to :facility, class_name: 'Facility'
    has_many :tray_plans, class_name: 'Cultivation::TrayPlan', dependent: :delete_all
    has_many :tasks, class_name: 'Cultivation::Task', dependent: :delete_all
    has_many :plants, class_name: 'Inventory::Plant'
    has_many :harvest_batch, class_name: 'Inventory::HarvestBatch'
    has_one :nutrient_profile, class_name: 'Cultivation::NutrientProfile'

    scope :active, -> { where(status: Constants::BATCH_STATUS_ACTIVE) }

    track_history on: [:batch_no,
                       :name,
                       :batch_source,
                       :grow_method,
                       :start_date,
                       :estimated_harvest_date,
                       :quantity,
                       :current_growth_stage,
                       :selected_plants,
                       :status],
                  modifier_field: :modifier,
                  modifier_field_inverse_of: nil,
                  modifier_field_optional: true,
                  tracker_class_name: :batch_history_tracker

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

    #TODO WHAT IS THIS
    def material_use
      materials = []
      materials
    end

    def material_summary
      new_materials = material_use.map do |material|
        transaction = Inventory::ItemTransaction.where(
          facility_id: facility_id,
          catalogue_id: material.catalogue_id,
        )
        sum = 0
        transaction.each do |a|
          sum += a.quantity
        end

        batches = Cultivation::Batch
        batches.each do |batch|
          break if batch.id == id
          item = batch.material_use.find { |b| b.name == material.name }
          sum -= item.quantity if item
          sum = 0 if sum.negative?
        end

        OpenStruct.new(
          name: material.name,
          quantity: material.quantity,
          uom: material.uom,
          inventory_quantity: sum,
        )
      end
      new_materials
    end

    def actual_cost
      actual_labor_cost + actual_material_cost
    end

    def estimated_cost
      estimated_labor_cost + estimated_material_cost
    end
  end
end
