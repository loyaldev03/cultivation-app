class PlantsMovementsSerializer
  include FastJsonapi::ObjectSerializer

  attributes :quantity

  attributes :id do |object|
    object.id.to_s
  end

  attributes :selected_plants do |object|
    if object.selected_plants.present?
      object.selected_plants.map do |p|
        {
          plant_id: p.plant_id&.to_s,
          quantity: p.quantity,
          plant_code: p.plant_code,
          plant_location: p.plant_location&.to_s,
        }
      end
    else
      []
    end
  end

  attributes :selected_trays do |object|
    if object.selected_trays.present?
      object.selected_trays.map do |t|
        {
          destination_id: t.tray_id&.to_s,
          destination_code: t.tray_code&.to_s,
          capacity: t.capacity,
        }
      end
    end
  end

  attributes :movements do |object|
    if object.movements.present?
      object.movements.map do |h|
        {
          phase: h.phase,
          activity: h.activity,
          mother_plant_id: h.mother_plant_id&.to_s,
          mother_plant_code: h.mother_plant_code,
          destination_id: h.destination_id&.to_s,
          destination_code: h.destination_code,
          destination_type: h.destination_type,
          plants: h.plants,
        }
      end
    else
      []
    end
  end
end
