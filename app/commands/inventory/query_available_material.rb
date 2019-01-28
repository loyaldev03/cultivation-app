module Inventory
  class QueryAvailableMaterial
    prepend SimpleCommand

    def initialize(product_id, batches_ids, filter = {})
      raise ArgumentError, 'product_id' if product_id.nil?
      raise ArgumentError, 'batches_ids' if batches_ids.nil?
      Rails.logger.debug "Product id => #{product_id}"
      @product = Inventory::Product.find(product_id)
      Rails.logger.debug "Product  => #{@product.inspect}"

      # @batches = batches
      # Rails.logger.debug "Batches => #{@batches.count}"
      @plant_tasks = Cultivation::Task.where(:batch_id.in => batches_ids, indelible: 'plants')
    end

    def call
      query_records
    end

    private

    def query_records
      material_available = @product.packages.sum { |a| a.quantity }.to_i
      material_booked = 0
      @plant_tasks.each do |task|
        task.material_use.each do |material|
          product = material.product
          if product == @product
            material_booked += material.quantity
          end
        end
      end

      return {material_available: material_available, material_booked: material_booked}
    end
  end
end
