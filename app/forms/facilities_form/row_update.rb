module FacilitiesForm
  class RowUpdate
    include ActiveModel::Model
    attr_accessor :row

    delegate :id,
             :name,
             :code,
             to: :row,
             prefix: false

    validates :code, :name, presence: true
    validate :code_must_be_unique

    def self.find(id)
      facility = Facility.where('rooms.sections.rows._id' => BSON::ObjectId.from_string(id)).first
      bson_id = BSON::ObjectId.from_string(id)
      row = nil

      facility.rooms.each do |r|
        r.sections.each do |s|
          s.rows.each do |rw|
            if rw.id == bson_id
              row = rw
              break
            end
          end
        end
      end

      FacilitiesForm::RowUpdate.new(row: row)
    end

    def update(params)
      self.row.attributes = params.slice(:name, :code)

      if valid?
        row.save!
      else
        false
      end
    end

    def code_must_be_unique
      if row.section.rows.any? { |r| r.code == code && r.id != id }
        errors.add(:code, 'must be unique')
      end
    end
  end
end
