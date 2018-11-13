class HomeSetupStatus
  prepend SimpleCommand

  def initialize(facility)
    @facility = facility
  end

  def call
    if @facility.present?
      # TODO: Check if other rooms type too. Cannot add inventory or start cultivation batch without
      # those rooms setup
      have_mother_rooms = @facility.rooms.detect { |r| r.purpose == Constants::CONST_MOTHER }
      have_strains = @facility.strains.exists?
      have_plants = Inventory::Plant.exists?
      OpenStruct.new({
        has_facility: have_mother_rooms ? true : false,
        facility: @facility,
        has_inventories: have_strains && have_plants,
        has_batches: Cultivation::Batch.where(facility_id: @facility.id).count > 0,
      })
    else
      OpenStruct.new({
        has_facility: false,
        facility: nil,
        has_inventories: false,
        has_batches: false,
      })
    end
  end
end
