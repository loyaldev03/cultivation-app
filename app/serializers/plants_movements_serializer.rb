class PlantsMovementsSerializer
  include FastJsonapi::ObjectSerializer

  attributes :id, :quantity

  attributes :selected_plants do |object|
    object.selected_plants.map do |p|
      {
        plant_id: p.plant_id,
        quantity: p.quantity,
        plant_code: p.plant_code,
        plant_location: p.plant_location,
      }
    end
  end
end
