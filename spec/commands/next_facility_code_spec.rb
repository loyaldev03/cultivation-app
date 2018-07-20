require 'rails_helper'

RSpec.describe NextFacilityCode do
  context "generate next code for facility" do
    it "should return next code given facility" do
      cmd = NextFacilityCode.call(:facility, "FA1")

      expect(cmd.result).to eq "FA2"
    end

    it "should return next code no facility" do
      cmd = NextFacilityCode.call(:facility, nil)

      expect(cmd.result).to eq "F01"
    end

    it "should return next code given room" do
      cmd = NextFacilityCode.call(:room, "Room1")

      expect(cmd.result).to eq "Room2"
    end

    it "should return next code given room with increment" do
      cmd = NextFacilityCode.call(:room, "Room1", 2)

      expect(cmd.result).to eq "Room3"
    end

    it "should return next code no room" do
      cmd = NextFacilityCode.call(:room)

      expect(cmd.result).to eq "M01"
    end

    it "should return next code no room with increment" do
      cmd = NextFacilityCode.call(:room, nil, 3)

      expect(cmd.result).to eq "M03"
    end

    it "should return next code no section with increment" do
      cmd = NextFacilityCode.call(:section, nil, 6)

      expect(cmd.result).to eq "C06"
    end

    it "should return next code no row with increment" do
      cmd = NextFacilityCode.call(:row, nil, 3)

      expect(cmd.result).to eq "R03"
    end

    it "should return next code no shelf with increment" do
      cmd = NextFacilityCode.call(:shelf, nil, 3)

      expect(cmd.result).to eq "S03"
    end

    it "should return next code no tray with increment" do
      cmd = NextFacilityCode.call(:tray, nil, 3)

      expect(cmd.result).to eq "T03"
    end
  end
end
