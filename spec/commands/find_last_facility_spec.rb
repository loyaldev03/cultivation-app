require 'rails_helper'

RSpec.describe FindLastFacility, type: :command do
  context ".call with args" do
    it "return last record" do
      Facility.create!([
        { name: Faker::Lorem.word, code: "1", },
        { name: Faker::Lorem.word, code: "2" },
        { name: "Last Facility", code: "3" },
      ])

      cmd = FindLastFacility.call

      expect(cmd.errors).to be {}
      expect(cmd.success?).to be true
      expect(cmd.result).to have_attributes(
        name: "Last Facility",
        code: "3",
      )
    end
  end
end
