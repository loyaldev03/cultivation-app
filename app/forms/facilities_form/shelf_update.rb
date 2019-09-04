module FacilitiesForm
  class ShelfUpdate
    include ActiveModel::Model
    attr_accessor :shelf,
                  :desc,
                  :capacity,
                  :code

    delegate :id,
             to: :shelf,
             prefix: false

    validates :code, :capacity, presence: true
    validate :code_must_be_unique

    def self.find(id)
      facility = Facility.where('rooms.rows.shelves._id' => BSON::ObjectId.from_string(id)).first
      bson_id = BSON::ObjectId.from_string(id)
      shelf = nil

      facility.rooms.each do |room|
        room.rows.each do |row|
          row.shelves.each do |sh|
            if sh.id == bson_id
              shelf = sh
              break
            end
          end
        end
      end

      FacilitiesForm::ShelfUpdate.new(shelf: shelf, desc: shelf.row.room.desc, code: shelf.code)
    end

    def update(params)
      self.shelf.attributes = params.slice(:code)

      if valid?
        shelf.save!
      else
        false
      end

      if params[:desc].present?
        self.shelf.row.room.update(desc: params[:desc])
      end
    end

    def code_must_be_unique
      if self.shelf.row.shelves.any? { |s| s.code == code && s.id != id }
        errors.add(:code, 'must be unique')
      end
    end
  end
end
