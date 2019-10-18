class CompanyInfo
  include Mongoid::Document
  include Mongoid::Timestamps::Short

  field :name, type: String
  field :phone, type: String
  field :fax, type: String
  field :website, type: String
  field :state_license, type: String
  field :tax_id, type: String
  field :timezone, type: String, default: 'Pacific Time (US & Canada)'
  field :metrc_user_key, type: String
  field :metrc_ready, type: Boolean, default: -> { false }
  # Enable METRC integration
  field :enable_metrc_integration, type: Boolean, default: -> { false }
  # Enable sharing of resouces between facilities in the company
  field :enable_resouces_sharing, type: Boolean, default: -> { false }
  field :is_active, type: Boolean, default: -> { false }
  field :first_day_of_week, type: String, default: 'Sunday'
  embeds_many :work_schedules, class_name: 'Common::WorkSchedule'
  embeds_many :holidays, class_name: 'Common::Holiday'
end
