class BatchSerializer
  include FastJsonapi::ObjectSerializer
  attributes :name, :batch_source, :strain_id

  has_many :tasks
end
