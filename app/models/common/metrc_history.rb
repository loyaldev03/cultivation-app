module Common
  class MetrcHistory
    include Mongoid::Document
    include Mongoid::Timestamps::Short

    field :code, type: String
    field :category, type: String
    field :value, type: Time
    field :metrc_type, type: String

    embedded_in :company_info
  end
end
