require 'rails_helper'

RSpec.describe SaveUnitOfMeasure, type: :command do
  context "when params has no id" do
    subject(:params) {
      {
        name: Faker::Lorem.word,
        unit: Faker::Number.number(3),
        desc: Faker::Lorem.sentence,
      }
    }

    it "save as new record" do
      initial_size = Common::UnitOfMeasure.count

      SaveUnitOfMeasure.call(params)
      params[:name] = Faker::Name.name
      SaveUnitOfMeasure.call(params)

      # Expect same unit to be saved only once
      expect(Common::UnitOfMeasure.count).to eq initial_size + 1
    end

    it "save all attributes" do
      cmd = SaveUnitOfMeasure.call(params)

      expect(cmd.errors.to_h).to eq({})
      expect(cmd.success?).to be true
      expect(cmd.result.c_at).to_not be nil
      expect(cmd.result.u_at).to_not be nil
      expect(cmd.result).to have_attributes(
        name: params[:name],
        unit: params[:unit],
        desc: params[:desc],
      )
    end
  end
end
