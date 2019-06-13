class CalculateAverageProductPriceJob < ApplicationJob
  queue_as :default

  def perform(product_id)
    Inventory::CalculateAverageProductPrice.call(product_id)
  end
end
