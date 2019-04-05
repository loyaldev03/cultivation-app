require 'rails_helper'

RSpec.describe "Generate Full Code", type: :lib do
  let!(:facility) do
    facility = create(:facility, :is_complete)
    facility.rooms.each do |room|
      room.rows.each do |row|
        row.shelves.each do |shelf|
          shelf.trays.each(&:save!)
        end
      end
    end
    facility
  end

  it "room full_code" do
    room = facility.rooms.first
    result = Constants.generate_full_code(facility, room)

    expect(result.nil?).to be false
    expect(result).to eq "#{facility.code}.#{room.code}"
    expect(result.length > 5).to eq true
  end

  it "row full_code" do
    room = facility.rooms.first
    row = room.rows.first
    result = Constants.generate_full_code(facility, room, row)

    expect(result.nil?).to be false
    expect(result).to eq "#{facility.code}.#{room.code}.#{row.code}"
    expect(result.length > 10).to eq true
  end

  it "row (with section) full_code" do
    room = facility.rooms.first
    first_section = room.sections.build(code: "SecA")
    second_section = room.sections.build(code: "SecB")
    room.save!
    first_row = room.rows.first
    last_row = room.rows.last
    first_row.section_id = first_section.id
    last_row.section_id = second_section.id

    result = Constants.generate_full_code(facility, room, first_row)
    expect(result).to eq "#{facility.code}.#{room.code}.#{first_section.code}.#{first_row.code}"

    result = Constants.generate_full_code(facility, room, last_row)
    expect(result).to eq "#{facility.code}.#{room.code}.#{second_section.code}.#{last_row.code}"
  end

  it "shelf full_code" do
    room = facility.rooms.first
    row = room.rows.first
    shelf = row.shelves.first
    result = Constants.generate_full_code(facility, room, row, shelf)

    expect(result.nil?).to be false
    expect(result).to eq "#{facility.code}.#{room.code}.#{row.code}.#{shelf.code}"
    expect(result.length > 15).to eq true
  end

  it "shelf (with section) full_code" do
    room = facility.rooms.first
    section = room.sections.build(code: "SecA")
    room.save!
    row = room.rows.first
    row.section_id = section.id
    shelf = row.shelves.first

    result = Constants.generate_full_code(facility, room, row, shelf)
    expect(result).to eq "#{facility.code}.#{room.code}.#{section.code}.#{row.code}.#{shelf.code}"
  end

  it "tray full_code" do
    room = facility.rooms.first
    row = room.rows.first
    shelf = row.shelves.first
    tray = shelf.trays.last
    result = Constants.generate_full_code(facility, room, row, shelf, tray)

    expect(result.nil?).to be false
    expect(result).to eq "#{facility.code}.#{room.code}.#{row.code}.#{shelf.code}.#{tray.code}"
    expect(result.length > 20).to eq true
  end

  it "tray (with section) full_code" do
    room = facility.rooms.first
    section = room.sections.build(code: "SecA")
    room.save!
    row = room.rows.first
    row.section_id = section.id
    shelf = row.shelves.first
    tray = shelf.trays.last
    result = Constants.generate_full_code(facility, room, row, shelf, tray)

    expect(result.nil?).to be false
    expect(result).to eq "#{facility.code}.#{room.code}.#{section.code}.#{row.code}.#{shelf.code}.#{tray.code}"
    expect(result.length > 20).to eq true
  end
end
