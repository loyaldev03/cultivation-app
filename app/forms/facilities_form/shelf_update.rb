module FacilitiesForm
  class ShelfUpdate
    include ActiveModel::Model
    attr_accessor :shelf

    delegate :id,
             :code,
             :desc,
             :capacity,
             to: :shelf,
             prefix: false

    validates :code, :capacity, presence: true
    validate :code_must_be_unique

    def self.find(id)
      facility = Facility.where('rooms.sections.rows.shelves._id' => BSON::ObjectId.from_string(id)).first
      bson_id = BSON::ObjectId.from_string(id)
      shelf = nil

      facility.rooms.each do |room|
        room.sections.each do |section|
          section.rows.each do |row|
            row.shelves.each do |sh|
              if sh.id == bson_id
                shelf = sh
                break
              end
            end
          end
        end
      end

      FacilitiesForm::ShelfUpdate.new(shelf: shelf)
    end

    def update(params)
      self.shelf.attributes = params.slice(:code, :desc, :capacity)

      if valid?
        shelf.save!
      else
        false
      end
    end

    def code_must_be_unique
      if shelf.row.shelves.any? { |s| s.code == code && s.id != id }
        errors.add(:code, 'must be unique')
      end
    end
  end
end
