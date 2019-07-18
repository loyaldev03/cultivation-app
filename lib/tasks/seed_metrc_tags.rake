desc "Seed Metrc Tags for testing"

task seed_metrc_tags: :environment do

  last_tag = Inventory::MetrcTag.last&.tag
  last_tag ||= "1A4ZZ0100000022000001"

  metrc_tags = []

  # Generate plant metrc tags
  1000.times do
    last_tag = last_tag.next
    metrc_tags << {
      tag: last_tag,
      tag_type: "plant",
      status: "available",
    }
  end

  # Generate package metrc tags
  500.times do
    last_tag = last_tag.next
    metrc_tags << {
      tag: last_tag,
      tag_type: "package",
      status: "available",
    }
  end

  Inventory::MetrcTag.create(plant_tags)
end
