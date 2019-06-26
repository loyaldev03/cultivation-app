class SeedFacilityPreferences < Mongoid::Migration
  def self.up
    Facility.all.each do |facility|
      facility.preferences.find_or_create_by!(code: "ONBOARDING_COMP_INFO")
  
      facility.preferences.find_or_create_by!(code: "ONBOARDING_GROW_METHOD")

      facility.preferences.find_or_create_by!(code: "ONBOARDING_COMP_PHASES")

      facility.preferences.find_or_create_by!(code: "ONBOARDING_UOM")

      facility.preferences.find_or_create_by!(code: "ONBOARDING_MATERIAL_TYPE")

      facility.preferences.find_or_create_by!(code: "ONBOARDING_INVITE_TEAM")

      facility.preferences.find_or_create_by!(code: "ONBOARDING_ACTIVE_PLANTS")

      facility.preferences.find_or_create_by!(code: "ONBOARDING_PACKAGE_INVENTORY")

      facility.preferences.find_or_create_by!(code: "ONBOARDING_RAW_MATERIALS")

      facility.preferences.find_or_create_by!(code: "ONBOARDING_FACILITY")

      facility.preferences.find_or_create_by!(code: "ONBOARDING_OTHER_MATERIALS")

      facility.preferences.find_or_create_by!(code: "ONBOARDING_SETUP_BATCH")

      facility.preferences.find_or_create_by!(code: "ONBOARDING_DONE")
    end
  end

  def self.down
    Facility.all.each do |facility|
      facility.preferences.delete_all
    end
  end
end