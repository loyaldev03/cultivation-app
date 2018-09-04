require 'rails_helper'

RSpec.describe SaveUnitOfMeasure, type: :command do
  context "when params has no id" do
    subject(:params) {
      {
        name: Faker::Lorem.word,
        code: Faker::Number.number(3),
        desc: Faker::Lorem.sentence
      }
    }

    it "save as new record" do
      SaveUnitOfMeasure.call(params)
      SaveUnitOfMeasure.call(params)

      expect(Common::UnitOfMeasure.count).to eq 2
    end

    it "save all attributes" do
      cmd = SaveUnitOfMeasure.call(params)

      saved = Common::UnitOfMeasure.find_by(id: cmd.result.id)
      expect(cmd.errors).to be {}
      expect(cmd.success?).to be true
      expect(cmd.result.c_at).to_not be nil
      expect(cmd.result.u_at).to_not be nil
      expect(cmd.result).to have_attributes(
        name: params[:name],
        code: params[:code],
        desc: params[:desc]
      )
    end
  end
end