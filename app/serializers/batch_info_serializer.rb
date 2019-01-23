class BatchInfoSerializer
  include FastJsonapi::ObjectSerializer

  attributes :name, :batch_no, :start_date, :estimated_harvest_date, :status

  attribute :id do |object|
    object.id.to_s
  end
end
