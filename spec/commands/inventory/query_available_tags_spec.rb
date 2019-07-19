require 'rails_helper'

RSpec.describe Inventory::QueryAvailableMetrcTags, type: :command do
  context "When no available metrc tags" do
    let(:facility) { create(:facility) }

    it ".call" do
      result = Inventory::QueryAvailableMetrcTags.call(
        facility.id,
        10,
        Constants::METRC_TAG_TYPE_PLANT,
      ).result

      expect(result.empty?).to be true
    end
  end

  context "When metrc tags available" do
    let!(:facility) { create(:facility) }
    let!(:tags) do
      res = []
      res << create(:metrc_tag, facility: facility)
      res << create(:metrc_tag, facility: facility)
      res << create(:metrc_tag, facility: facility)
    end

    it ".call" do
      result = Inventory::QueryAvailableMetrcTags.call(
        facility.id,
        10,
        Constants::METRC_TAG_TYPE_PLANT,
      ).result

      expect(result.size).to eq tags.size
    end
  end
end
