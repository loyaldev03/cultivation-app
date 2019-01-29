class BatchInfoSerializer
  include FastJsonapi::ObjectSerializer

  attributes :name,
             :batch_no,
             :start_date,
             :estimated_harvest_date,
             :quantity,
             :status

  attribute :id do |object|
    object.id.to_s
  end

  attribute :strain_id do |object|
    object.facility_strain_id
  end

  attribute :strain_name do |object|
    object.facility_strain.strain_name
  end
end
