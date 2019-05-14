class HarvestBatchSerializer
  include FastJsonapi::ObjectSerializer

  attribute :id do |object|
    object.id&.to_s
  end

  attributes :created_at, :updated_at, :total_wet_weight, :total_dry_weight

  attribute :strain_name do |object|
    object.facility_strain&.strain_name
  end

  #location ??

  attribute :plants_count do |object|
    object.plants&.map { |a| a }.count
  end

  attribute :waste_weight do |object|
    object.total_wet_waste_weight + object.total_trim_waste_weight
  end
end
