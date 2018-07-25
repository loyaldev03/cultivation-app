class SaveFacility
  prepend SimpleCommand

  def initialize(basic_info_form = {})
    @form_object = basic_info_form
  end

  def call
    save_record(@form_object)
  end

  private

  def save_record(form_object)
    record = Facility.where(id: form_object.id).first
    record ||= Facility.new
    map_attributes(record, form_object)
    record.save!
    record
  end

  def map_attributes(record, form_object)
    record.name = form_object.name
    record.code = form_object.code
    record.company_name = form_object.company_name
    record.state_license = form_object.state_license
    record.site_license = form_object.site_license
    record.timezone = form_object.timezone
    record.is_complete = form_object.is_complete
    record.is_enabled = form_object.is_enabled
    record.wz_room_count = form_object.wz_room_count

    address = record.address ||= Address.new
    address.address = form_object.address_address
    address.city = form_object.address_city
    address.state = form_object.address_state
    address.zipcode = form_object.address_zipcode
    address.country = form_object.address_country
    address.main_number = form_object.address_main_number
    address.fax_number = form_object.address_fax_number

    record.address = address
  end
end
