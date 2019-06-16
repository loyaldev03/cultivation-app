desc "Create onboarding 1 at a time"
task seed_onboarding: :environment  do
    facility = Facility.first
    if facility.preferences.count == 0
        
        facility.preferences.create!([
          { code: "Constant::ONBOARDING_COMP_INFO"},
          { code: "Constant::ONBOARDING_GROW_METHOD"},
          { code: "Constant::ONBOARDING_COMP_PHASES"},
          { code: "Constant::ONBOARDING_UOM"},
          { code: "Constant::ONBOARDING_MATERIAL_TYPE"},
          { code: "Constant::ONBOARDING_INVITE_TEAM"},
          { code: "Constant::ONBOARDING_ACTIVE_PLANTS"},
          { code: "Constant::ONBOARDING_PACKAGE_INVENTORY"},
          { code: "Constant::ONBOARDING_RAW_MATERIALS"},
          { code: "Constant::ONBOARDING_FACILITY"},
          { code: "Constant::ONBOARDING_OTHER_MATERIALS"},
          { code: "Constant::ONBOARDING_SETUP_BATCH"},
          { code: "Constant::ONBOARDING_DONE"}
          
        ])
    end
end