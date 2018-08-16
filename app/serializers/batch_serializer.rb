class BatchSerializer
  include FastJsonapi::ObjectSerializer
  attributes :name, :batch_source, :strain

  has_many :tasks

  
end
