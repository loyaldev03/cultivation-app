module Common
  class SeedOnBoardingPreference
    prepend SimpleCommand

    def initialize(facility_id)
      @facility_id = facility_id.to_bson_id
    end

    def call
      preferences = Facility.find(@facility_id)

      preferences.find_or_create_by!(code: 'ONBOARDING_COMP_INFO')

      preferences.find_or_create_by!(code: 'ONBOARDING_GROW_METHOD')

      preferences.find_or_create_by!(code: 'ONBOARDING_COMP_PHASES')

      preferences.find_or_create_by!(code: 'ONBOARDING_UOM')

      preferences.find_or_create_by!(code: 'ONBOARDING_MATERIAL_TYPE')

      preferences.find_or_create_by!(code: 'ONBOARDING_INVITE_TEAM')

      preferences.find_or_create_by!(code: 'ONBOARDING_ACTIVE_PLANTS')

      preferences.find_or_create_by!(code: 'ONBOARDING_PACKAGE_INVENTORY')

      preferences.find_or_create_by!(code: 'ONBOARDING_RAW_MATERIALS')

      preferences.find_or_create_by!(code: 'ONBOARDING_FACILITY')

      preferences.find_or_create_by!(code: 'ONBOARDING_OTHER_MATERIALS')

      preferences.find_or_create_by!(code: 'ONBOARDING_SETUP_BATCH')

      preferences.find_or_create_by!(code: 'ONBOARDING_DONE')

      nil
    end
  end
end
