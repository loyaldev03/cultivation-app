class SaveFacility
  prepend SimpleCommand

  def initialize(basic_info_form = {}, current_user)
    @form_object = basic_info_form
    @current_user = current_user
  end

  def call
    save_record(@form_object)
  end

  private

  def save_record(form_object)
    record = Facility.where(id: form_object.id.to_bson_id).first
    is_new = false
    if record.nil?
      record = Facility.new
      is_new = true
    end
    map_attributes(record, form_object)
    record.save!

    # Note: Seed data for new Facility
    SeedFacilityDataJob.perform_later(facility_id: record.id.to_s, current_user_id: @current_user.id.to_s) if is_new

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

    address = record.address ||= Address.new
    address.address = form_object.address_address
    address.city = form_object.address_city
    address.state = form_object.address_state
    address.zipcode = form_object.address_zipcode
    address.country = form_object.address_country
    address.email = form_object.address_email
    address.main_number = form_object.address_main_number
    address.fax_number = form_object.address_fax_number

    record.address = address
  end
end
