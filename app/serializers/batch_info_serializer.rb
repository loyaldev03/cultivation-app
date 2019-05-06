class BatchInfoSerializer
  include FastJsonapi::ObjectSerializer

  attributes :name,
             :batch_no,
             :start_date,
             :estimated_harvest_date,
             :estimated_hours,
             :current_growth_stage,
             :current_stage_location,
             :current_stage_start_date,
             :quantity,
             :destroyed_plants_count,
             :status

  attribute :id do |object|
    object.id.to_s
  end

  attribute :strain_id do |object|
    object.facility_strain_id.to_s
  end

  attribute :strain_name do |object|
    object.facility_strain.strain_name
  end

  attribute :selected_plants do |object|
    object.selected_plants.map do |plant|
      {
        plant_id: plant[:plant_id].to_s,
        quantity: plant[:quantity],
      }
    end
  end

  attribute :selected_location do |object|
    object.selected_location.to_s
  end
end
