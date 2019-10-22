class UpdateShelfIsUseTrays < Mongoid::Migration
  def self.up
    Facility.all.each do |f|
      if f.rooms
        f.rooms.each do |room|
          if room.rows
            room.rows.each do |row|
              if row.shelves
                row.shelves.each do |shelf|
                  shelf.is_use_trays = row.has_trays && row.wz_trays_count&.positive?
                end
              end
            end
          end
        end
      end
      f.save!
    end
  end

  def self.down
  end
end
