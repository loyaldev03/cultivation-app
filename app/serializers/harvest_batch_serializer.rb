class HarvestBatchSerializer
  include FastJsonapi::ObjectSerializer

  attribute :id do |object|
    object.id&.to_s
  end

  attributes :harvest_name, :created_at, :updated_at

  attribute :strain_name do |object|
    object.facility_strain&.strain_name
  end

  attribute :total_dry_weight do |object|
    "#{object.total_dry_weight}#{object.uom}"
  end

  attribute :total_wet_weight do |object|
    "#{object.total_wet_weight}#{object.uom}"
  end

  attribute :plants_count do |object|
    "#{object.plants&.map { |a| a }.count}#{object.uom}"
  end

  attribute :waste_weight do |object|
    "#{object.total_wet_waste_weight + object.total_trim_waste_weight}#{object.uom}"
  end

  attribute :package_count do |object|
    "#{object.packages.map { |a| a.quantity }.sum}#{object.uom}"
  end
end
