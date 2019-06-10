class Inventory::MetrcController < ApplicationController
  authorize_resource class: false

  def index
    @facility_id = current_default_facility.id.to_s
  end
end
