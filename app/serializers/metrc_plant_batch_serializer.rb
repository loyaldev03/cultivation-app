class MetrcPlantBatchSerializer
  include FastJsonapi::ObjectSerializer

  attributes :lot_no,
    :count,
    :strain,
    :metrc_tag,
    :metrc_tag_verified,
    :metrc_id

  attribute :id do |object|
    object.id.to_s
  end
end
