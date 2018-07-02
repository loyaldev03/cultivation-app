module FacilitiesForm
  class SectionUpdate
    include ActiveModel::Model
    attr_accessor :section

    delegate :id,
             :name,
             :code,
             :desc,
             :purpose,
             :custom_purpose,
             :storage_types,
             :cultivation_types,
             :rows,
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

      FacilitiesForm::SectionUpdate.new(section: section)
    end

    def purpose_details
      if purpose == ''
        storage_types.map &:titlecase
      else
        cultivation_types.map &:titlecase
      end
    end

    def update(params)
      set_attributes(params)

      if valid?
        @section.save!
      else
        false
      end
    end

    def purpose_editable?
      section.rows.empty?
    end

    def cultivation_editable?
      section.rows.empty?
    end

    def storage_editable?
      section.rows.empty?
    end

    private

    def set_attributes(params)
      if purpose_editable?
        self.section.attributes = params.slice(:name, :code, :desc, :purpose, :custom_purpose)

        # Clear other values with user switched prupose
        if purpose == 'cultivation'
          self.section.cultivation_types = params[:cultivation_types].reject { |x| x.blank? }
        elsif purpose == 'storage'
          self.section.storage_types = params[:storage_types].reject { |x| x.blank? }
        end
      else
        self.section.attributes = params.slice(:name, :code, :desc)
      end
    end

    def purpose_or_cultivation_must_exists
      if !purpose_editable?
        return
      elsif purpose.blank?
        errors.add(:purpose, 'must be selected.')
      elsif purpose == 'cultivation' && cultivation_types.empty?
        errors.add(:purpose, 'details for cultivation must be selected.')
      elsif purpose == 'storage' && storage_types.empty?
        errors.add(:purpose, 'details for storage must be selected.')
      end
    end

    def code_must_be_unique
      if section.room.sections.any? { |s| s.code == section.code && s.id != section.id }
        errors.add(:code, 'must be unique')
      end
    end
  end
end
