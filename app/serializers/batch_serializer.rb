class BatchSerializer
  include FastJsonapi::ObjectSerializer
  attributes :name, :batch_source, :strain_id, :batch_no, :is_active
  has_many :tasks

  attribute :facility do |object|
    if object.facility_strain
      object.facility_strain.facility.name
    else
      ''
    end
  end
end
