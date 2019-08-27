class DailyTasksController < ApplicationController
  include WorkersDashboard

  def index
    @facility = current_default_facility
    @facility_id = current_default_facility.id.to_s
    @nutrient_ids = Inventory::Catalogue.where(category: Constants::NUTRIENTS_KEY).where(:sub_category.ne => '').map { |x| x.id.to_s }
    @nutrient_ids.concat(Inventory::Catalogue.where(category: Constants::SUPPLEMENTS_KEY).map { |x| x.id.to_s })
    @scanditLicense = ENV['SCANDIT_LICENSE'] || 'AVe8MQbfGjJxQJEE+QVlV0EBEY6rBvsRMWlDKqo98mQATwwAS1BtJrtGCslZEK53DH06b+Q/OgabNbrRrUUNNvBL2exdQfSWajf13ms38pvLRuJ6k2rnrW9nprt0R1W54lszn8Y+ryORQkFDzQkdqKGjLQDi1GIqkIlNPU4oKheZ1WLLq8wM7AP8VfdGYJ1BLkbtW3RygNb4b/sOYiO0OpIK6Wij7HcSOJZWnK56Uvk6vTKIBT6K74ULnFM1LG++KHFwAT3fqG19wXdJMwnOPzla1Pm02vqmO25V3nrpceNGm2+SKU8o1qqIe+y6HAITF7y29l/ilIiTtqkijjyK6i5u47akgqrjBNkerKUgX1/AYRrKLSV2xZqqNB8Ul9unKKBQsyygAi+ScpOvrU4Kj5hPhRnfSIfO9p5WsrG/8BtJ89Cf7K9eRlC3/y+78i2HbN/+f7iTOrI4/xTjK8+B4VHbvod6pa8Xu/hAENGqnj49drTVRvXhZFCg6FHfqVEoiodb/RNQAtZNigP48/2fAtte95KZSVwCW/0XFx9/ek4/ZSXFwRZYzzqn++xmIfGGMfbX9UbAKRiqb6IuO7yrnnxfcdOrOB8yYkcmjb8xx8+FLA+VajClyORrkMtv/Bhkgio6oribFw6tbC+RJeHPO1mLD8W3mY8WCrZPWrVwk767K5boEU6nna1gCQXvwfWPPGMwO5XFTxkU9KuutVvrs/sNyc/UAM5wWx6BQXtdfDn2codtOyDmkx1iHaSkXjAxfXlOsJcIn05P/7nJX+SBqbDtrbwf8VB724YgGcCjlS1AS/oPYOx1lkU8yOIzmzY='

    @total_tasks = get_tasks_today.count
    @next_payment_date = QueryNextPaymentDate.call(Time.current).result
    @hours_worked = get_hours_worked
    #for add inventory nutrient task
    @order_uoms = Common::UnitOfMeasure.where(:dimension.in => %w(piece)).pluck(:unit)
    @uoms = Common::UnitOfMeasure.all.pluck(:unit)
    @catalogue_id = Inventory::QueryCatalogue.call(Constants::NUTRIENTS_KEY).result&.id.to_s
    @catalogues = get_tasks_today.pluck(:indelible).include?('receive_inventory_nutrients') ? Inventory::QueryCatalogueTree.call('raw_materials', Constants::NUTRIENTS_KEY).result : []
    @grow_medium_catalogues = get_tasks_today.pluck(:indelible).include?('receive_grow_medium') ? Inventory::QueryCatalogueTree.call('raw_materials', Constants::GROW_MEDIUM_KEY).result : []
    @grow_light_catalogues = get_tasks_today.pluck(:indelible).include?('receive_grow_lights') ? Inventory::QueryCatalogueTree.call('raw_materials', Constants::GROW_LIGHT_KEY).result : []
    @supplement_catalogues = get_tasks_today.pluck(:indelible).include?('receive_supplements') ? Inventory::QueryCatalogueTree.call('raw_materials', Constants::SUPPLEMENTS_KEY).result : []
    @other_catalogues = get_tasks_today.pluck(:indelible).include?('receive_others') ? Inventory::QueryCatalogueTree.call('raw_materials', Constants::OTHERS_KEY).result : []
    #end add inventory nutrient task
    render 'index', layout: 'worker'
  end

  private

  def get_tasks_today
    @tasks_date = Time.current.beginning_of_day
    match = current_user.cultivation_tasks.expected_on(@tasks_date).selector
    tasks_by_batch = Cultivation::Task.collection.aggregate(
      [
        {"$match": match},
      ]
    )

    other_tasks = current_user.cultivation_tasks.
      expected_on(@tasks_date).
      in(user_ids: current_user.id).
      where(batch_id: nil)

    tasks_by_batch.to_a + other_tasks.to_a
  end
end
