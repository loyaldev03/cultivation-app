class CalculateAverageProductPriceJob
  include Sidekiq::Worker

  def perform(product_id)
    Inventory::CalculateAverageProductPrice.call(product_id)
  end
end
