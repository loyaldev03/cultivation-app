require 'rails_helper'

RSpec.describe Inventory::UpdateMetrcTagsAssigned, type: :command do
  context "when missing args" do

    it "missing facility_id would raise error" do
      args = {metrc_tags: []}

      expect do
        Inventory::UpdateMetrcTagsAssigned.call(args)
      end.to raise_error(ArgumentError)
    end

    it "missing metrc_tags would raise error" do
      args = {facility_id: BSON::ObjectId.new}

      expect do
        Inventory::UpdateMetrcTagsAssigned.call(args)
      end.to raise_error(ArgumentError)
    end
  end

  context "when given correct params" do

    let!(:facility) { create(:facility) }
    let!(:tags) do
      res = []
      res << create(:metrc_tag, facility: facility)
      res << create(:metrc_tag, facility: facility)
      res << create(:metrc_tag, facility: facility)
    end

    it ".call" do
      metrc_tags = tags.map(&:tag)
      args = {
        facility_id: facility.id,
        metrc_tags: metrc_tags,
      }

      cmd = Inventory::UpdateMetrcTagsAssigned.call(args)
      saved = Inventory::MetrcTag.where(:tag.in => metrc_tags).pluck(:status)

      expect(cmd.success?).to be true
      expect(saved).to eq ["assigned", "assigned", "assigned"]
    end
  end
end
