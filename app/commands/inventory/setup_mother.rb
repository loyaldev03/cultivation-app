########################################################################
#   Creates new mother plant along with other dependency if they doesnt exists.
#   This includes: vendor, strain, inventory item
########################################################################
module Inventory
  class SetupMother
    prepend SimpleCommand
    attr_reader :user,
      :args,
      :id,
      :is_draft,
      :user,
      :facility_strain_id,
      :plant_ids,
      :location_id,
      :planted_on,
      :vendor_id,
      :vendor_name,
      :vendor_no,
      :invoice_no,
      :address,
      :vendor_state_license_num,
      :vendor_state_license_expiration_date,
      :vendor_location_license_expiration_date,
      :vendor_location_license_num

    def initialize(user, args)
      @user = user
      @args = HashWithIndifferentAccess.new(args)
      # Rails.logger.debug '>>>> SetupMother'
      # Rails.logger.debug @args

      @is_draft = false
      @id = args[:id]
      @facility_strain_id = args[:facility_strain_id]
      @plant_ids = generate_or_extract_plant_ids(args[:plant_ids])
      @location_id = args[:location_id]
      @planted_on = args[:planted_on]
      @vendor_id = args[:vendor_id] || ''
      @vendor_name = args[:vendor_name] && args[:vendor_name].strip
      @vendor_no = args[:vendor_no]
      @address = args[:address]
      @vendor_state_license_num = args[:vendor_state_license_num]
      @vendor_state_license_expiration_date = args[:vendor_state_license_expiration_date]
      @vendor_location_license_expiration_date = args[:vendor_location_license_expiration_date]
      @vendor_location_license_num = args[:vendor_location_license_num]
    end

    def call
      if valid_permission? && valid_data?
        plants = create_mother_plants

        if is_purchased?
          Rails.logger.debug 'save vendor called...'
          vendor = create_vendor
          create_invoice(plants, vendor, invoice_no)
        end
        plants
      end
    end

    private

    def generate_or_extract_plant_ids(ids)
      ids.gsub(/[\n\r]/, ',').split(',').reject { |x| x.empty? }.map(&:strip)
    end

    def valid_permission?
      raise 'User is missing' if user.nil?
      errors.empty?
    end

    def valid_data?
      # All serial number should be new or draft.
      # - add filter by facility strain id & status not available.
      existing_records = Inventory::Plant.in(plant_id: plant_ids).pluck(:plant_id)

      errors.add(:plant_ids, "These plant ID #{existing_records.join(', ')} already exists in the system.") if existing_records.count > 0
      errors.add(:facility_strain_id, 'Strain is required') if facility_strain_id.blank?
      errors.add(:planted_on, 'Planted date is required') if planted_on.blank?
      valid_location?
      valid_vendor? if is_purchased?
      errors.empty?
    end

    def valid_location?
      errors.add(:location_id, 'Mother room is required') if location_id.blank?

      facility_strain = Inventory::FacilityStrain.find(facility_strain_id)
      location_exists = Facility.find_by('rooms._id': BSON::ObjectId(location_id), id: facility_strain.facility_id)
      errors.add(:location_id, 'Mother room must be within facility where you register the strain.') if location_id.present? && location_exists.nil?
    end

    def valid_vendor?
      if vendor_id.blank?
        errors.add(:vendor_name, 'Vendor name is required.') if vendor_name.blank?
        errors.add(:vendor_state_license_num, 'State license number is required.') if vendor_state_license_num.blank?
        errors.add(:vendor_state_license_expiration_date, 'State license experiation date is required.') if vendor_state_license_expiration_date.blank?
        errors.add(:vendor_location_license_expiration_date, 'Location expiration date is required.') if vendor_location_license_expiration_date.blank?
        errors.add(:vendor_location_license_num, 'Location license number is required.') if vendor_location_license_num.blank?
      end
    end

    def is_purchased?
      vendor_name.present?
    end

    def create_vendor
      vendor = Inventory::Vendor.find(vendor_id)
      return if vendor.present?

      command = Inventory::SaveVendor.call(
        id: vendor_id,
        name: vendor_name,
        vendor_no: vendor_no,
        address: address,
        state_license_num: vendor_state_license_num,
        state_license_expiration_date: vendor_state_license_expiration_date,
        location_license_expiration_date: vendor_location_license_expiration_date,
        location_license_num: vendor_location_license_num,
        vendor_type: 'plant_supplier',
      )

      if command.success?
        command.result
      else
        Rails.logger.debug "\t\t\t>>>>>>>>>>>>>>>>>>"
        Rails.logger.debug command.errors
        # Maybe need to bypass this validation message mapping.
        combine_errors(command.errors, :vendor_name, :name)
        combine_errors(command.errors, :vendor_no, :vendor_no)
        combine_errors(command.errors, :address, :address)
        combine_errors(command.errors, :vendor_state_license_num, :state_license_num)
        combine_errors(command.errors, :vendor_state_license_expiration_date, :state_license_expiration_date)
        combine_errors(command.errors, :vendor_location_license_expiration_date, :location_license_expiration_date)
        combine_errors(command.errors, :vendor_location_license_num, :location_license_num)
        nil
      end
    end

    def create_mother_plants
      plants = []
      plant_ids.each do |plant_id|
        plant = Inventory::Plant.find_or_initialize_by(
          plant_id: plant_id,
          facility_strain_id: facility_strain_id,
        ) do |t|
          t.current_growth_stage = 'mother'
          t.created_by = user
          t.location_id = location_id
          t.location_type = 'room'
          t.status = is_draft ? 'draft' : 'available'
          t.planting_date = planted_on
          t.mother_date = ''
        end
        plant.save!
        plants << plant
      end

      plants
    end

    def create_invoice(plants, vendor, invoice_no)
      # Link plant to invoice
      #
      # command = Inventory::SaveBlankInvoice.call(nil, plants, vendor, invoice_no)
      # unless command.success?
      #   combine_errors(command.errors, :errors, :plant_ids)
      # end
    end

    def combine_errors(errors_source, from_field, to_field)
      errors.add(to_field, errors_source[from_field]) if errors_source.key?(from_field)
    end
  end
end
