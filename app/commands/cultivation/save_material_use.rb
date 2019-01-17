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
        record.material_use.build({product_id: item[:product_id], quantity: item[:quantity]})
      end
      record.save!
      record
    rescue
      errors.add(:error, $!.message)
    end
  end
end
