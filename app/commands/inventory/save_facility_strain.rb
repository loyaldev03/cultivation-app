module Inventory
  class SaveFacilityStrain
    prepend SimpleCommand
    attr_reader :facility_strain

    def initialize(current_user, args)
      @current_user = current_user
      @id = args[:id]
      @facility_id = args[:facility_id]
      @strain_name = args[:strain_name]
      @strain_type = args[:strain_type]
      @sativa_makeup = args[:sativa_makeup]
      @indica_makeup = args[:indica_makeup]
      @testing_status = args[:testing_status]
      @thc = args[:thc]
      @cbd = args[:cbd]
    end

    def call
      build_facility_strain
      facility_strain.save! if valid?
      facility_strain
    end

    private

    def build_facility_strain
      if @id.present?
        @facility_strain = Inventory::FacilityStrain.find(@id)
      else
        @facility_strain = Inventory::FacilityStrain.new(
          facility_id: @facility_id,
          created_by: @current_user,
        )
      end

      @facility_strain.strain_name = @strain_name
      @facility_strain.strain_type = @strain_type
      @facility_strain.sativa_makeup = @sativa_makeup
      @facility_strain.indica_makeup = @indica_makeup
      @facility_strain.testing_status = @testing_status
      @facility_strain.thc = @thc
      @facility_strain.cbd = @cbd
    end

    def valid?
      valid_permission? && valid_data?
    end

    def valid_permission?
      true
    end

    def valid_data?
      errors.add(:strain_name, 'Strain name is required') if facility_strain.strain_name.empty?
      errors.add(:strain_type, 'Strain type is required') if facility_strain.strain_type.empty?
      errors.add(:facility_id, 'Facility is required') if facility_strain.facility_id.nil?

      if FacilityStrain.find_by(
        strain_name: facility_strain.strain_name,
        facility_id: facility_strain.facility_id,
      ).present? &&
         !facility_strain.persisted?
        errors.add(:strain_name, 'Strain name is already taken.')
      end

      # errors.add(:thc, 'THC quantity is requried') if facility_strain.thc.nil?
      # errors.add(:cbd, 'CBD quantity is required') if facility_strain.cbd.nil?
      # errors.add(:testing_status, 'Testing status is required') if facility_strain.testing_status.empty?

      # TODO: Check testing status is valid
      # TODO: Check indica + sativa makesup equals 100
      errors.empty?
    end
  end
end
