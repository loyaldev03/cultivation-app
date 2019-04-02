class PlantsMovementsSerializer
  include FastJsonapi::ObjectSerializer

  attributes :quantity

  attributes :id do |object|
    object.id.to_s
  end

  attributes :selected_plants do |object|
    object.selected_plants.map do |p|
      {
        plant_id: p.plant_id&.to_s,
        quantity: p.quantity,
        plant_code: p.plant_code,
        plant_location: p.plant_location&.to_s,
      }
    end
  end

  attributes :movements do |object|
    object.movements.map do |h|
      {
        phase: h.phase,
        activity: h.activity,
        mother_plant_id: h.mother_plant_id&.to_s,
        mother_plant_code: h.mother_plant_code,
        plants: h.plants,
      }
    end
  end
end
