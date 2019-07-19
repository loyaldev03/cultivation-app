desc "Seed Metrc Tags for testing"

task seed_metrc_tags: :environment do

  facility = Facility.first
  last_tag = Inventory::MetrcTag.last&.tag
  last_tag ||= "1A4ZZ0100000022000001"

  metrc_tags = []

  # Generate plant metrc tags
  1000.times do
    last_tag = last_tag.next
    metrc_tags << {
      tag: last_tag,
      tag_type: Constants::METRC_TAG_TYPE_PLANT,
      status: Constants::METRC_TAG_STATUS_AVAILABLE,
      facility_id: facility.id,
    }
  end

  # Generate package metrc tags
  500.times do
    last_tag = last_tag.next
    metrc_tags << {
      tag: last_tag,
      tag_type: Constants::METRC_TAG_TYPE_PACKAGE,
      status: Constants::METRC_TAG_STATUS_AVAILABLE,
      facility_id: facility.id,
    }
  end

  Inventory::MetrcTag.create(metrc_tags)
end
