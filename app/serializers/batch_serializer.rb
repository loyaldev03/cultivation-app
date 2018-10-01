class BatchSerializer
  include FastJsonapi::ObjectSerializer
  attributes :name, :batch_source, :batch_no, :is_active, :start_date, :grow_method
  has_many :tasks, if: Proc.new { |record, params| params.nil? || params[:exclude_tasks] != true }

  attribute :facility do |object|
    if object.facility_strain
      object.facility_strain.facility.name
    else
      ''
    end
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

  attribute :harvest_duration do |object|
    task = object.tasks.find_by(is_phase: true, phase: Constants::CONST_HARVEST)
    task ? task.duration : ''
  end

  attribute :curing_duration do |object|
    task = object.tasks.find_by(is_phase: true, phase: Constants::CONST_CURE)
    task ? task.duration : ''
  end

  attribute :value do |object|
    object.id.to_s
  end

  attribute :label do |object|
    "#{object.batch_no} - #{object.name}, #{object.facility_strain&.strain_name}"
  end
end
