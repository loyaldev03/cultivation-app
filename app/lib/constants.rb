module Constants
  SUPER_ADMIN = 'Super Admin'.freeze

  CONST_CLONE = 'clone'.freeze
  CONST_CURE = 'cure'.freeze
  CONST_DRY = 'dry'.freeze
  CONST_FLOWER = 'flower'.freeze
  CONST_MOTHER = 'mother'.freeze
  CONST_SEED = 'seed'.freeze
  CONST_STORAGE = 'storage'.freeze
  CONST_VAULT = 'vault'.freeze
  CONST_TRIM = 'trim'.freeze
  CONST_VEG = 'veg'.freeze
  CONST_VEG1 = 'veg1'.freeze
  CONST_VEG2 = 'veg2'.freeze
  CONST_HARVEST = 'harvest'.freeze
  CONST_PACKAGING = 'packaging'.freeze

  INDELIBLE_GROUP = 'group'.freeze
  INDELIBLE_CLIP_POT_TAG = 'clip_pot_tag'.freeze
  INDELIBLE_MOVING_TO_TRAY = 'moving_to_tray'.freeze
  INDELIBLE_MOVING_NEXT_PHASE = 'moving_to_next_phase'.freeze
  INDELIBLE_STAYING = 'staying'.freeze
  INDELIBLE_CLEANING = 'cleaning'.freeze
  INDELIBLE_MEASURE_HARVEST = 'measure_harvest_weight'.freeze
  INDELIBLE_ADD_NUTRIENT = 'add_nutrient'.freeze

  WORK_STATUS_NEW = 'new'.freeze
  WORK_STATUS_STARTED = 'started'.freeze
  WORK_STATUS_STOPPED = 'stopped'.freeze
  WORK_STATUS_STUCK = 'stuck'.freeze
  WORK_STATUS_DONE = 'done'.freeze

  UOM_QTY_TYPE_COUNT = 'CountBased'.freeze
  UOM_QTY_TYPE_VOLUME = 'VolumeBased'.freeze
  UOM_QTY_TYPE_WEIGHT = 'WeightBased'.freeze

  METRC_TAG_TYPE_PLANT = 'plant'.freeze
  METRC_TAG_TYPE_PACKAGE = 'package'.freeze

  METRC_TAG_STATUS_AVAILABLE = 'available'.freeze
  METRC_TAG_STATUS_ASSIGNED = 'assigned'.freeze
  METRC_TAG_STATUS_DISPOSED = 'disposed'.freeze

  UOM_DMS_PIECES = 'pieces'.freeze
  UOM_DMS_VOLUME = 'volume'.freeze
  UOM_DMS_WEIGHT = 'weight'.freeze

  CULTIVATION_PHASES_1V = [
    CONST_CLONE,
    CONST_VEG,
    CONST_FLOWER,
  ].freeze

  CULTIVATION_PHASES_2V = [
    CONST_CLONE,
    CONST_VEG1,
    CONST_VEG2,
    CONST_FLOWER,
  ].freeze

  # Phases that require tray booking are growing phases
  REQUIRED_BOOKING_PHASES = [
    CONST_CLONE,
    CONST_VEG1,
    CONST_VEG2,
    CONST_VEG,
    CONST_FLOWER,
  ].freeze

  FACILITY_ROOMS_ORDER = [
    CONST_MOTHER,
    CONST_CLONE,
    CONST_VEG,
    CONST_VEG1,
    CONST_VEG2,
    CONST_FLOWER,
    CONST_HARVEST,
    CONST_TRIM,
    CONST_DRY,
    CONST_CURE,
    CONST_STORAGE,
    CONST_VAULT,
  ].freeze

  ROOM_ONLY_SETUP = [
    CONST_CURE,
    CONST_DRY,
    CONST_HARVEST,
    CONST_STORAGE,
    CONST_TRIM,
    CONST_VAULT,
  ].freeze

  BATCH_STATUS_DRAFT = 'DRAFT'.freeze
  BATCH_STATUS_SCHEDULED = 'SCHEDULED'.freeze
  BATCH_STATUS_ACTIVE = 'ACTIVE'.freeze
  BATCH_STATUS_COMPLETED = 'COMPLETED'.freeze

  NOTIFY_TYPE_TASK = 'Cultivation::Task'.freeze
  NOTIFY_TYPE_BATCH = 'Cultivation::Batch'.freeze
  NOTIFY_TYPE_REQUEST = 'Common::WorkRequest'.freeze

  BATCH_TYPES_CLONE = 'Clone'.freeze
  BATCH_TYPES_SEED = 'Seed'.freeze

  PLANT_GROWTH_PHASE_FLOWERING = 'Flowering'.freeze

  GROW_PHASES = [
    CONST_MOTHER,
    CONST_CLONE,
    CONST_VEG,
    CONST_VEG1,
    CONST_VEG2,
    CONST_FLOWER,
    CONST_HARVEST,
    CONST_DRY,
    CONST_CURE,
    CONST_PACKAGING,
  ].freeze

  PLANT_TYPES = [
    {code: CONST_CLONE, name: 'Clone'},
    {code: CONST_MOTHER, name: 'Mother'},
    {code: CONST_SEED, name: 'Seed'},
    {code: CONST_VEG, name: 'Veg Group'},
  ].freeze

  STRAIN_TYPES = [
    {code: :hybrid, name: 'Hybrid'},
    {code: :indica, name: 'Indica'},
    {code: :sativa, name: 'Sativa'},
  ].freeze

  ROOM_PURPOSE = [
    {code: CONST_CLONE, name: 'Clone'},
    {code: CONST_CURE, name: 'Cure'},
    {code: CONST_DRY, name: 'Drying'},
    {code: CONST_FLOWER, name: 'Flower'},
    {code: CONST_MOTHER, name: 'Mother'},
    {code: CONST_STORAGE, name: 'Storage'},
    {code: CONST_VAULT, name: 'Vault'},
    {code: CONST_TRIM, name: 'Trim'},
    {code: CONST_VEG, name: 'Veg'},
    {code: CONST_VEG1, name: 'Veg 1'},
    {code: CONST_VEG2, name: 'Veg 2'},
    {code: CONST_HARVEST, name: 'Harvest'},
  ].freeze

  SECTION_PURPOSE = [
    {code: :cure, name: 'Cure'},
    {code: :drying_plants, name: 'Drying Plants'},
  ].freeze

  DRYING_METHOD = [
    {code: :wire_lines, name: 'Wire lines'},
    {code: :dry_racks, name: 'Dry racks'},
    {code: :highrise_dry_racks, name: 'High rise drying racks'},
  ].freeze

  CURE_METHOD = [
    {code: :highrise_cure_racks, name: 'Hanging high rise curing rack'},
    {code: :curing_racks, name: 'Curing rack'},
  ].freeze

  PLANT_SOURCE_TYPES = [
    {code: :purchased_plants, name: 'Purchased plants'},
    {code: :clones_from_mother, name: 'Clones from Mother plant'},
    {code: :clones_purchased, name: 'Pre-purchased clones'},
    {code: :seeds, name: 'Seeds'},
  ].freeze

  CLONE_TYPES = [
    {code: :purchased, name: 'Purchased'},
    {code: :mother, name: 'Mother'},
  ].freeze

  ACCOUNTING_CATEGORY = [
    {code: :cogs, name: 'Cost of Goods'},
    {code: :finished_goods, name: 'Finished Goods'},
    {code: :raw_materials, name: 'Raw Materials'},
    {code: :wip, name: 'Work in Process'},
    {code: :other, name: 'Other'},
  ].freeze

  INVENTORY_TYPES = [
    {code: :harvest_yield, name: 'Harvest Yield'},
    {code: :non_sales, name: 'Non Sales'},
    {code: :raw_materials, name: 'Raw Materials'},
    {code: :sales_product, name: 'Sales Product'},
  ].freeze

  RAW_MATERIALS = [
    {code: :antibacterial_soap, name: 'Antibacterial Soap'},
    {code: :eye_drops, name: 'Eye drops'},
    {code: :eye_protection, name: 'Eye Protection'},
    {code: :garbage_bags, name: 'Garbage Bags'},
    {code: :grow_lights, name: 'Grow Lights'},
    {code: :grow_medium, name: 'Grow Medium'},
    {code: :nitrile_gloves, name: 'Nitrile Gloves'},
    {code: :nutrients, name: 'Nutrients'},
    {code: :rubbing_alcohol, name: 'Rubbing Alcohol'},
    {code: :scale, name: 'Scale'},
    {code: :seal_bags, name: 'Seal Bags'},
    {code: :supplements, name: 'Supplements'},
    {code: :trim_station, name: 'Trim Station'},
    {code: :trim_trays, name: 'Trim Trays'},
    {code: :trimming_scissors, name: 'Trimming Scissors'},
    {code: :vacuum_sealer, name: 'Vacuum Sealer'},
    {code: :other, name: 'Other'},
  ].freeze

  GROW_LIGHTS = [
    {code: :cmh, name: 'CMH'},
    {code: :hid, name: 'HID'},
    {code: :hps, name: 'HPS'},
    {code: :led, name: 'LED'},
    {code: :ms, name: 'MS'},
    {code: :t5_fluorescent, name: 'T5 Fluorescent'},
  ].freeze

  GROW_MEDIUM = [
    {code: :coco_coir, name: 'Coco coir'},
    {code: :compost_soil, name: 'Compost soil'},
    {code: :hardened_expanded_clay_hec, name: 'Hardened Expanded Clay (HEC)'},
    {code: :hydrophonics, name: 'Hydrophonics'},
    {code: :mineral_wool, name: 'Mineral Wool'},
    {code: :peat, name: 'Peat'},
    {code: :perlite, name: 'Perlite'},
    {code: :soil, name: 'Soil'},
    {code: :sphagnum, name: 'Sphagnum'},
    {code: :vermiculite, name: 'Vermiculite'},
  ].freeze

  # Constants for Catalogue's category fields
  NUTRIENTS_KEY = 'nutrients'.freeze
  SUPPLEMENTS_KEY = 'supplements'.freeze
  GROW_MEDIUM_KEY = 'grow_medium'.freeze
  GROW_LIGHT_KEY = 'grow_light'.freeze
  OTHERS_KEY = 'others'.freeze
  CONVERTED_PRODUCT_KEY = 'converted_product'.freeze
  PLANTS_KEY = 'plants'.freeze
  SEEDS_KEY = 'seeds'.freeze
  PURCHASED_CLONES_KEY = 'purchased_clones'.freeze
  SALES_KEY = 'sales_products'.freeze
  NON_SALES_KEY = 'non_sales'.freeze
  RAW_MATERIALS_KEY = 'raw_materials'.freeze

  SPECIAL_TYPE = [
    {code: :others, name: 'Others'},
    {code: :grow_lights, name: 'Grow Lights'},
    {code: :grow_medium, name: 'Grow Medium'},
    {code: :nutrients, name: 'Nutrients'},
    {code: :supplements, name: 'Supplements'},
  ].freeze

  NUTRIENT_TYPE = [
    {code: :blend, name: 'Blend'},
    {code: :nitrogen, name: 'Nitrogen'},
    {code: :phosphate, name: 'Phosphate'},
    {code: :potassium, name: 'Potassium'},
  ].freeze

  NITROGEN_PRODUCTS = [
    {code: :ammonia_nh3, name: 'Ammonia (NH3)'},
    {code: :blood_meal, name: 'Blood Meal'},
    {code: :cottonseed_meal, name: 'Cottonseed Meal'},
    {code: :fish_emulsion, name: 'Fish Emulsion'},
    {code: :urea, name: 'Urea'},
  ].freeze

  PHOSPHATE_PRODUCT = [
    {code: :bone_meal, name: 'Bone Meal'},
    {code: :rock_phosphate, name: 'Rock Phosphate'},
    {code: :slag, name: 'Slag'},
    {code: :super_phosphate, name: 'Super Phosphate'},
  ].freeze

  POTASSIUM_PRODUCT = [
    {code: :seaweed, name: 'Seaweed'},
    {code: :wood_ashes, name: 'Wood ashes'},
  ].freeze

  SUPPLEMENTS = [
    {code: :amino_acid, name: 'Amino Acid'},
    {code: :azomite, name: 'Azomite'},
    {code: :bat_guano, name: 'Bat Guano'},
    {code: :blood_meal, name: 'Blood Meal'},
    {code: :carbohydrates, name: 'Carbohydrates'},
    {code: :citric_acids, name: 'Citric acids'},
    {code: :compost_tea, name: 'Compost tea'},
    {code: :dolomite_lime, name: 'Dolomite Lime'},
    {code: :enzymes, name: 'Enzymes'},
    {code: :epsom_salt, name: 'Epsom Salt'},
    {code: :fulvic_acid, name: 'Fulvic acid'},
    {code: :gibberellic_acid, name: 'Gibberellic Acid-'},
    {code: :humic_acid, name: 'Humic Acid'},
    {code: :mycorrhiza, name: 'Mycorrhiza'},
    {code: :silica, name: 'Silica'},
    {code: :sulfur_based_additives, name: 'Sulfur based additives'},
    {code: :vitamin, name: 'Vitamin'},
    {code: :worm_castings, name: 'Worm Castings'},
  ].freeze

  YIELD_WEIGHT_TYPE = [
    {code: :dry, name: 'Dry'},
    {code: :wet, name: 'Wet'},
  ].freeze

  HARVEST_YIELD = [
    {code: :flower, name: 'Flower'},
    {code: :shakes, name: 'Shakes'},
    {code: :trim, name: 'Trim'},
    {code: :waste, name: 'Waste'},
    {code: :wet_plant, name: 'Wet Plant'},
    {code: :other, name: 'Other'},
  ].freeze

  DEFAULT_PRODUCT_CATEGORIES = [
    'Leaf',
    'Parts',
    'Pre-roll',
    'Flowers',
    'Shakes',
    'Trim',
  ].freeze

  BUILTIN_PRODUCT_CATEGORIES = [
    {name: 'Leaf', quantity_type: 'WeightBased', built_in: true, package_units: [], has_children: false},
    {name: 'Parts', quantity_type: 'WeightBased', built_in: true, package_units: [], has_children: false},
    {name: 'Pre-roll', quantity_type: 'CountBased', built_in: true, has_children: true,
     package_units: [
      {value: 'Pre-roll', is_active: true, quantity: 0},
      {value: 'Blunt', is_active: true, quantity: 0},
      {value: 'Joint', is_active: true, quantity: 0},
      {value: 'Mini Pre-roll', is_active: true, quantity: 0},
      {value: 'Spliff', is_active: true, quantity: 0},
    ]},
    {name: 'Concentrates', quantity_type: 'CountBased', built_in: true, has_children: true,
     package_units: [
      {value: 'Badder', is_active: true, quantity: 0},
      {value: 'Cartridge', is_active: true, quantity: 0},
      {value: 'Crumble', is_active: true, quantity: 0},
      {value: 'Crystalline', is_active: true, quantity: 0},
      {value: 'Dabs', is_active: true, quantity: 0},
      {value: 'Distillate', is_active: true, quantity: 0},
      {value: 'Dry Sift', is_active: true, quantity: 0},
      {value: 'Hash', is_active: true, quantity: 0},
      {value: 'Honeycomb', is_active: true, quantity: 0},
      {value: 'Kief', is_active: true, quantity: 0},
      {value: 'Oil', is_active: true, quantity: 0},
      {value: 'Resin', is_active: true, quantity: 0},
      {value: 'Sap', is_active: true, quantity: 0},
      {value: 'Shatter', is_active: true, quantity: 0},
      {value: 'Wax', is_active: true, quantity: 0},
    ]},
    {name: 'Edibles', quantity_type: 'CountBased', built_in: true, has_children: true,
     package_units: [
      {value: 'Beverages', is_active: true, quantity: 0},
      {value: 'Brownies', is_active: true, quantity: 0},
      {value: 'Candy', is_active: true, quantity: 0},
      {value: 'Capsules', is_active: true, quantity: 0},
      {value: 'Chocolates', is_active: true, quantity: 0},
      {value: 'Condiments', is_active: true, quantity: 0},
      {value: 'Cookies', is_active: true, quantity: 0},
      {value: 'Cooking', is_active: true, quantity: 0},
      {value: 'Frozen', is_active: true, quantity: 0},
      {value: 'Snack Foods', is_active: true, quantity: 0},
      {value: 'Tinctures & Sublingual', is_active: true, quantity: 0},
    ]},
    {name: 'Flowers', quantity_type: 'WeightBased', built_in: true, package_units: [], has_children: false},
    {name: 'Shakes', quantity_type: 'WeightBased', built_in: true, package_units: [], has_children: false},
    {name: 'Trim', quantity_type: 'WeightBased', built_in: true, package_units: [], has_children: false},
  ]

  BUILTIN_PACKAGE_UNITS = [
    {value: '3pk', label: '3pk'},
    {value: '5pk', label: '5pk'},
    {value: '12pk', label: '12pk'},
    {value: '24pk', label: '24pk'},
  ].freeze

  BUILTIN_WEIGHT_UNITS = [
    {value: 'half_g', label: '1/2 gram', uom: 'g', quantity_in_uom: '0.5'},
    {value: 'half_kg', label: '1/2 kg', uom: 'g', quantity_in_uom: '500'},
    {value: 'quarter_lb', label: '1/4 lb', uom: 'g', quantity_in_uom: '113.4'},
    {value: 'quarter_oz', label: '1/4 ounce', uom: 'g', quantity_in_uom: '14'},
    {value: 'eighth', label: 'Eighth', uom: 'g', quantity_in_uom: '3.5'},
    {value: 'g', label: 'Gram', uom: 'g', quantity_in_uom: '1'},
    {value: 'half_oz', label: 'Half ounce', uom: 'g', quantity_in_uom: '14'},
    {value: 'kg', label: 'Kg', uom: 'g', quantity_in_uom: '1000'},
    {value: 'lb', label: 'Lb', uom: 'g', quantity_in_uom: '453.592'},
    {value: 'oz', label: 'Ounce', uom: 'g', quantity_in_uom: '28.3495'},
  ].freeze

  SALES_PRODUCT_CATEGORY = [
    {code: :high_cbd, name: 'High CBD'},
    {code: :hybrid, name: 'Hybrid'},
    {code: :indica, name: 'Indica'},
    {code: :indica_dominant, name: 'Indica Dominant'},
    {code: :vapes, name: 'Vapes'},
    {code: :sativa, name: 'Sativa'},
    {code: :other, name: 'Other'},
  ].freeze

  NON_SALES_TYPES = [
    {code: :a, name: 'A'},
    {code: :b, name: 'B'},
    {code: :c, name: 'C'},
    {code: :d, name: 'D'},
    {code: :other, name: 'Other'},
  ].freeze

  TRAY_CAPACITY_TYPES = [
    {code: :pots, name: 'Pots'},
    {code: :cups, name: 'Cups'},
  ].freeze

  YES_NO = [
    {code: :yes, name: 'Yes'},
    {code: :no, name: 'No'},
  ].freeze

  APP_MOD_INVOICES = 1010
  APP_MOD_PURCHASEORDER = 1020
  APP_MOD_MANIFEST = 1030
  APP_MOD_COST = 1040
  APP_MOD_USER_COSTS = 1050
  APP_MOD_EXPENSES = 1060
  APP_MOD_PRODUCT_SALES = 1070
  APP_MOD_ALL_USERS_PAYROLL = 1080
  APP_MOD_MY_DIRECT_REPORTS_PAYROLL = 1090
  APP_MOD_MY_PAYROLL = 1100
  APP_MOD_INVENTORY_TYPE = 2010
  APP_MOD_ACTIVE_PLANTS = 2020
  APP_MOD_SALES_PRODUCTS = 2030
  APP_MOD_NON_SALES_ITEMS = 2040
  APP_MOD_STRAIN_TYPE = 2050
  APP_MOD_METRC_TAG = 2060
  APP_MOD_TEMPLATES = 3010
  APP_MOD_ALL_BATCHES = 3020
  APP_MOD_BATCH_ASSIGNED_TO_MY_DIRECT_REPORTS = 3030
  APP_MOD_BATCH_ASSIGNED_TO_ME = 3040
  APP_MOD_ASSSIGN_TASKS_TO_ALL_USERS = 3050
  APP_MOD_ASSIGN_TASKS_ONLY_TO_MY_DIRECT_REPORTS = 3060
  APP_MOD_ALL_TASKS = 3070
  APP_MOD_TASKS_ASSIGNED_TO_MY_DIRECT_REPORTS = 3080
  APP_MOD_TASKS_ASSIGNED_TO_ME = 3090
  APP_MOD_ALL_HOURS_WORKED = 3100
  APP_MOD_HOURS_ASSIGNED_TO_MY_DIRECT_REPORTS = 3110
  APP_MOD_MY_HOURS_WORKED = 3120
  APP_MOD_ALL_ISSUES = 4010
  APP_MOD_ISSUES_REPORTED_BY_MY_DIRECT_REPORTS = 4020
  APP_MOD_ISSUES_REPORTED_BY_ME = 4030
  APP_MOD_ASSIGN_TASKS_TO_ALL_ISSUES = 4040
  APP_MOD_ASSIGN_TASKS_TO_ISSUES_REPORTED_BY_MY_DIRECT_REPORT = 4050
  APP_MOD_TEAM_SETTINGS_USERS = 9010
  APP_MOD_TEAM_SETTINGS_ROLES = 9020

  APP_MODULES = [
    {
      code: 1000,
      name: 'Finance',
      features: [
        {code: APP_MOD_INVOICES, name: 'Invoices'},
        {code: APP_MOD_PURCHASEORDER, name: 'Purchase Order'},
        {code: APP_MOD_MANIFEST, name: 'Manifest'},
        {code: APP_MOD_COST, name: 'Cost'},
        {code: APP_MOD_USER_COSTS, name: 'User costs'},
        {code: APP_MOD_EXPENSES, name: 'Expenses'},
        {code: APP_MOD_PRODUCT_SALES, name: 'Product Sales'},
        {code: APP_MOD_ALL_USERS_PAYROLL, name: 'All users payroll'},
        {code: APP_MOD_MY_DIRECT_REPORTS_PAYROLL, name: 'My Direct Reports payroll'},
        {code: APP_MOD_MY_PAYROLL, name: 'My Payroll'},
      ],
    },
    {
      code: 2000,
      name: 'Inventory',
      features: [
        {code: APP_MOD_INVENTORY_TYPE, name: 'Inventory type'},
        {code: APP_MOD_ACTIVE_PLANTS, name: 'Active plants'},
        {code: APP_MOD_SALES_PRODUCTS, name: 'Sales Products'},
        {code: APP_MOD_NON_SALES_ITEMS, name: 'Non-sales items'},
        {code: APP_MOD_STRAIN_TYPE, name: 'Strain type'},
      ],
    },
    {
      code: 3000,
      name: 'Cultivation',
      features: [
        {code: APP_MOD_TEMPLATES, name: 'Templates'},
        {code: APP_MOD_ALL_BATCHES, name: 'All batches'},
        {code: APP_MOD_BATCH_ASSIGNED_TO_MY_DIRECT_REPORTS, name: 'Batch assigned to my direct reports'},
        {code: APP_MOD_BATCH_ASSIGNED_TO_ME, name: 'Batch assigned to me'},
        {code: APP_MOD_ASSSIGN_TASKS_TO_ALL_USERS, name: 'Asssign tasks to all users'},
        {code: APP_MOD_ASSIGN_TASKS_ONLY_TO_MY_DIRECT_REPORTS, name: 'Assign tasks only to my direct reports'},
        {code: APP_MOD_ALL_TASKS, name: 'All Tasks'},
        {code: APP_MOD_TASKS_ASSIGNED_TO_MY_DIRECT_REPORTS, name: 'Tasks assigned to my direct reports'},
        {code: APP_MOD_TASKS_ASSIGNED_TO_ME, name: 'Tasks assigned to me'},
        {code: APP_MOD_ALL_HOURS_WORKED, name: 'All hours worked'},
        {code: APP_MOD_HOURS_ASSIGNED_TO_MY_DIRECT_REPORTS, name: 'Hours assigned to my direct reports'},
        {code: APP_MOD_MY_HOURS_WORKED, name: 'My hours worked'},
      ],
    },
    {
      code: 4000,
      name: 'Issues',
      features: [
        {code: APP_MOD_ALL_ISSUES, name: 'All issues'},
        {code: APP_MOD_ISSUES_REPORTED_BY_MY_DIRECT_REPORTS, name: 'Issues reported by my direct reports'},
        {code: APP_MOD_ISSUES_REPORTED_BY_ME, name: 'Issues reported by me'},
        {code: APP_MOD_ASSIGN_TASKS_TO_ALL_ISSUES, name: 'Assign tasks to all issues'},
        {code: APP_MOD_ASSIGN_TASKS_TO_ISSUES_REPORTED_BY_MY_DIRECT_REPORT, name: 'Assign tasks to issues reported by my direct report'},
      ],
    },
    {
      code: 9000,
      name: 'Settings',
      features: [
        {code: APP_MOD_TEAM_SETTINGS_USERS, name: 'Team Settings / Users'},
        {code: APP_MOD_TEAM_SETTINGS_ROLES, name: 'Team Settings / Roles'},
      ],
    },
  ].freeze

  class << self
    def generate_full_code(facility, room = nil, row = nil, shelf = nil, tray = nil)
      if facility
        full_code = room.code
        if row.present?
          if row.section_id.present?
            section = room.sections.detect { |s| s.id == row.section_id }
            full_code = "#{full_code}.#{section.code}.#{row.code}"
          else
            full_code = "#{full_code}.#{row.code}"
          end
          if row.has_shelves && shelf.present?
            full_code = "#{full_code}.#{shelf.code}"
          end
          if row.has_trays && tray.present?
            full_code = "#{full_code}.#{tray.code}"
          end
        end
        full_code
      else
        ''
      end
    end
  end
end

CAN_READ = 1
CAN_UPDATE = 2
CAN_CREATE = 4
CAN_DELETE = 8
