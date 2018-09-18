class CompanyInfo
  include Mongoid::Document
  include Mongoid::Timestamps::Short

  field :name, type: String
  field :phone, type: String
  field :fax, type: String
  field :website, type: String
  field :state_license, type: String
  field :tax_id, type: String
  field :timezone, type: String
end
