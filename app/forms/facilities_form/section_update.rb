module FacilitiesForm
  class SectionUpdate
    include ActiveModel::Model
    attr_accessor :section, :rows

    delegate :id,
             :name,
             :code,
             :desc,
             :purpose,
             :custom_purpose,
             :storage_types,
             :cultivation_types,
             to: :section,
             prefix: false

    validates :code, :name, presence: true
    validate :code_must_be_unique
    validate :purpose_or_cultivation_must_exists

    def self.find(id)
      facility = Facility.where('rooms.sections._id' => BSON::ObjectId.from_string(id)).first
      bid = BSON::ObjectId.from_string id
      section = nil

      facility.rooms.each do |r|
        r.sections.each do |s|
          if s.id == bid
            section = s
            break
          end
        end
      end

      form = FacilitiesForm::SectionUpdate.new
      form.section = section
      form.rows = section.rows
      form
    end

    def purpose_details
      if purpose == ''
        storage_types.map &:titlecase
      else
        cultivation_types.map &:titlecase
      end
    end

    def update(params)
      @section.attributes = params.slice(:name, :code, :desc, :purpose, :custom_purpose, :storage_types, :cultivation_types)

      if valid?
        @section.save!
      else
        false
      end
    end

    def purpose_or_cultivation_must_exists
      errors.add(:purpose, 'must be selected.')
    end

    def code_must_be_unique
      # Facility.where('rooms.sections._id' => BSON::ObjectId.from_string(id)).first
      # if Facility.not.where(id: id).where(code: code).count > 0
      #   errors.add(:code, 'must be unique.')
      # end
    end
  end
end
