module FacilityWizardForm
  class UpdateTrayInfoForm
    include ActiveModel::Model
    include Mapper

    ATTRS = [:id, :code, :capacity, :capacity_type]

    attr_accessor(*ATTRS)

    validates :code, presence: true
  end
end
