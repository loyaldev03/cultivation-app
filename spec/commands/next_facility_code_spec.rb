require 'rails_helper'

RSpec.describe NextFacilityCode do
  context "generate next code for facility" do
    it "should return next code given facility" do
      cmd = NextFacilityCode.call(last_code: "FA1", code_type: :facility)

      expect(cmd.result).to eq "FA2"
    end

    it "should return next code no facility" do
      cmd = NextFacilityCode.call(last_code: nil, code_type: :facility)

      expect(cmd.result).to eq "F01"
    end

    it "should return next code given room" do
      cmd = NextFacilityCode.call(last_code: "Room1", code_type: :room)

      expect(cmd.result).to eq "Room2"
    end

    it "should return next code given room with offset" do
      cmd = NextFacilityCode.call(last_code: "Room1", code_type: :room, offset: 2)

      expect(cmd.result).to eq "Room3"
    end

    it "should return next code no room" do
      cmd = NextFacilityCode.call(code_type: :room)

      expect(cmd.result).to eq "M01"
    end

    it "should return next code no room with offset" do
      cmd = NextFacilityCode.call(last_code: nil, code_type: :room, offset: 3)

      expect(cmd.result).to eq "M03"
    end

    it "should return next code no section with offset" do
      cmd = NextFacilityCode.call(last_code: nil, code_type: :section, offset: 6)

      expect(cmd.result).to eq "C06"
    end

    it "should return next code no row with offset" do
      cmd = NextFacilityCode.call(last_code: nil, code_type: :row, offset: 3)

      expect(cmd.result).to eq "R03"
    end

    it "should return next code no shelf with offset" do
      cmd = NextFacilityCode.call(last_code: nil, code_type: :shelf, offset: 3)

      expect(cmd.result).to eq "S03"
    end

    it "should return next code no tray with offset" do
      cmd = NextFacilityCode.call(last_code: nil, code_type: :tray, offset: 3)

      expect(cmd.result).to eq "T03"
    end
  end

end
