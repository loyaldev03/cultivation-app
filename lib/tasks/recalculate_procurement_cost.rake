task :recalculate_procurement_cost => :environment do
  Inventory::Product.all.each do |p|
    Inventory::CalculateAverageProductPrice.call(p.id)
  end
end