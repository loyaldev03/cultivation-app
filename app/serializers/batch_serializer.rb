class BatchSerializer
  include FastJsonapi::ObjectSerializer
  attributes :name, :batch_source, :strain_id, :code

  has_many :tasks
end
