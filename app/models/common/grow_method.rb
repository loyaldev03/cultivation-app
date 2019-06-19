module Common
  class GrowMethod
    include Mongoid::Document
    include Mongoid::Timestamps::Short

    field :code, type: String
    field :name, type: String
    field :is_active, type: Boolean

    scope :active, -> { where(is_active: true) }

    before_save :generate_code

    def generate_code
      self.code = name.underscore.gsub(' ', '_')
    end
  end
end
