module Cultivation
  class SaveMaterialUse
    prepend SimpleCommand

    attr_reader :args

    def initialize(id, items)
      @id = id
      @items = items
    end

    def call
      save_record
    end

    private

    def save_record
      record = Cultivation::Task.find(@id)
      record.material_use = []
      @items.each do |item|
        Rails.logger.debug "\t\t\t\t>>>>>>> item[:product_id]: #{item[:product_id]}, quantity: item[:quantity]: #{item[:quantity]}, uom: item[:uom]: #{item[:uom]})"
        record.material_use.create!({product_id: item[:product_id], quantity: item[:quantity], uom: item[:uom]})
      end
      # record.save!
      record
    rescue
      errors.add(:error, $!.message)
    end
  end
end
