class BatchSerializer
  include FastJsonapi::ObjectSerializer
  attributes :name, :batch_source, :strain_id, :batch_no

  has_many :tasks
end
