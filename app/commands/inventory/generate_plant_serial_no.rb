module Inventory
  class GeneratePlantSerialNo
    prepend SimpleCommand

    def initialize(plant_qty)
      @plant_qty = plant_qty
    end

    def call
      current_count = Inventory::Plant.unscoped.where(
        status: {:$in => %w(mother clone veg veg1 veg2)},
        c_at: {:$gte => DateTime.new(Date.today.year, 1, 1)},
      ).count

      ids = []
      @plant_qty.times do |i|
        ids << '%d%03d.%06d' % [Date.today.year, Date.today.yday, current_count + i + 1]
      end
      ids
    end
  end
end
