class BatchInfoSerializer
  include FastJsonapi::ObjectSerializer

  attributes :name,
             :batch_no,
             :start_date,
             :estimated_harvest_date,
             :quantity,
             :status,
             :selected_plants

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
end
