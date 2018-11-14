require "rails_helper"

FactoryBot.factories.map(&:name).each do |factory_name|
  describe "build('#{factory_name}')", focus: true do
    it "should be valid" do
      obj = build(factory_name)

      expect(obj.valid?).to be true
    end
  end
end
