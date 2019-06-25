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
  field :metrc_user_key, type: String

  embeds_many :work_schedules, class_name: 'Common::WorkSchedule'
  embeds_many :holidays, class_name: 'Common::Holiday'
  embeds_many :metrc_histories, class_name: 'Common::MetrcHistory'
end
