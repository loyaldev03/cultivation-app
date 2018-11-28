# TODO: Change to harvest batch serializer
class BatchSerializer
  include FastJsonapi::ObjectSerializer
  attributes :name, :batch_source, :batch_no, :is_active, :start_date, :grow_method, :current_growth_stage, :estimated_harvest_date
  has_many :tasks, if: Proc.new { |record, params| params.nil? || params[:exclude_tasks] != true }

  attribute :facility do |object|
    object.facility_strain&.facility&.name&.to_s
  end

  attribute :facility_strain_id do |object|
    object.facility_strain_id.to_s
  end

  attribute :facility_id do |object|
    object.facility_strain&.facility_id.to_s
  end

  attribute :strain_name do |object|
    object.facility_strain&.strain_name
  end

  attribute :clone_duration do |object|
    task = object.tasks.find_by(is_phase: true, phase: Constants::CONST_CLONE)
    task ? task.duration : ''
  end

  attribute :veg_duration do |object|
    task = object.tasks.find_by(is_phase: true, phase: Constants::CONST_VEG)
    task ? task.duration : ''
  end

  attribute :veg1_duration do |object|
    task = object.tasks.find_by(is_phase: true, phase: Constants::CONST_VEG1)
    task ? task.duration : ''
  end

  attribute :veg2_duration do |object|
    task = object.tasks.find_by(is_phase: true, phase: Constants::CONST_VEG2)
    task ? task.duration : ''
  end

  attribute :flower_duration do |object|
    task = object.tasks.find_by(is_phase: true, phase: Constants::CONST_FLOWER)
    task ? task.duration : ''
  end

  attribute :dry_duration do |object|
    task = object.tasks.find_by(is_phase: true, phase: Constants::CONST_DRY)
    task ? task.duration : ''
  end

  attribute :curing_duration do |object|
    task = object.tasks.find_by(is_phase: true, phase: Constants::CONST_CURE)
    task ? task.duration : ''
  end

  attribute :plant_count do |object|
    object.plants.count
  end

  attribute :value do |object|
    object.id.to_s
  end

  attribute :label do |object|
    "#{object.batch_no} - #{object.name}, #{object.facility_strain&.strain_name}"
  end

  attribute :current_phase do |object|
    Cultivation::Task.where(
      batch_id: object.id,
      is_phase: true,
      :start_date.lte => Date.today,
      :end_date.gte => Date.today,
    ).first&.name
  end

  attribute :progress_today do |object|
    (Date.today - object.start_date).round
  end

  attribute :estimated_total_days do |object|
    (object.estimated_harvest_date - object.start_date).round
  end
end
