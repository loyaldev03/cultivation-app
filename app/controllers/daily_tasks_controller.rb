class DailyTasksController < ApplicationController
  def index
    @nutrient_ids = Inventory::Catalogue.where(category: Constants::NUTRIENTS_KEY).where(:sub_category.ne => '').map { |x| x.id.to_s }
    @nutrient_ids.concat(Inventory::Catalogue.where(category: Constants::SUPPLEMENTS_KEY).map { |x| x.id.to_s })
    render 'index', layout: 'worker'
  end

  private

  def serialized_batch(id)
    batch = Cultivation::Batch.find(id)
    BatchSerializer.new(batch, params: {exclude_tasks: true}).
      serializable_hash[:data].
      merge(rooms: batch_room_names(batch))
  end

  def serialized_tasks(task_ids)
    work_days = task_ids.map do |task_id|
      Cultivation::Task.find(task_id)
    end
    TaskDetailsSerializer.new(work_days).serializable_hash[:data]
  end

  def serialized_catalogue
    catalogues = Inventory::Catalogue.raw_materials.selectable.order(label: :asc)
    Inventory::CatalogueSerializer.new(catalogues).serializable_hash[:data]
  end

  def batch_room_names(batch)
    plans = batch.tray_plans.where(phase: batch.current_growth_stage).to_a
    plans.map do |tray_plan|
      facility = Facility.where('rooms._id': BSON::ObjectId(tray_plan.room_id)).first
      facility.rooms.find(tray_plan.room_id).name
    end
  end
end
