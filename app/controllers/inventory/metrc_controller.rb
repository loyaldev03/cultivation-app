class Inventory::MetrcController < ApplicationController
  def index
    @facility_id = current_default_facility.id.to_s
  end
end