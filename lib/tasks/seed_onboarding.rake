desc "Create onboarding 1 at a time"
task seed_onboarding: :environment  do
    facility = Facility.first
    if facility.preferences.count == 0
        
        facility.preferences.create!([
          { code: "ONBOARDING_COMP_INFO"},
          { code: "ONBOARDING_GROW_METHOD"},
          { code: "ONBOARDING_COMP_PHASES"},
          { code: "ONBOARDING_UOM"},
          { code: "ONBOARDING_MATERIAL_TYPE"},
          { code: "ONBOARDING_INVITE_TEAM"},
          { code: "ONBOARDING_ACTIVE_PLANTS"},
          { code: "ONBOARDING_PACKAGE_INVENTORY"},
          { code: "ONBOARDING_RAW_MATERIALS"},
          { code: "ONBOARDING_FACILITY"},
          { code: "ONBOARDING_OTHER_MATERIALS"},
          { code: "ONBOARDING_SETUP_BATCH"},
          { code: "ONBOARDING_DONE"}
          
        ])
    end
end