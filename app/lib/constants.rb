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

  CULTIVATION_PHASES_1V = [
    CONST_CLONE,
    CONST_VEG,
    CONST_FLOWER,
    CONST_DRY,
    CONST_CURE,
  ].freeze

  CULTIVATION_PHASES_2V = [
    CONST_CLONE,
    CONST_VEG1,
    CONST_VEG2,
    CONST_FLOWER,
    CONST_DRY,
    CONST_CURE,
  ].freeze

  CULTIVATION_PHASES_3V = [
    CONST_CLONE,
    CONST_VEG,
    CONST_VEG1,
    CONST_VEG2,
    CONST_FLOWER,
    CONST_DRY,
    CONST_CURE,
  ].freeze

  BATCH_STATUS_DRAFT = 'DRAFT'.freeze
  BATCH_STATUS_SCHEDULED = 'SCHEDULED'.freeze
  BATCH_STATUS_ACTIVE = 'ACTIVE'.freeze

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
  ]

  PLANT_SOURCE_TYPES = [
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
  NUTRIENTS_KEY = 'nutrients'
  SUPPLEMENTS_KEY = 'supplements'
  GROW_MEDIUM_KEY = 'grow_medium'
  GROW_LIGHT_KEY = 'grow_light'
  OTHERS_KEY = 'others'
  CONVERTED_PRODUCT_KEY = 'converted_product'
  PLANTS_KEY = 'plants'
  SEEDS_KEY = 'seeds'
  PURCHASED_CLONES_KEY = 'purchased_clones'
  SALES_KEY = 'sales_products'
  NON_SALES_KEY = 'non_sales'
  RAW_MATERIALS_KEY = 'raw_materials'

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

  # TODO: To be removed
  SALES_PRODUCT_TYPE = [
    {code: :blunt, name: 'Blunt'},
    {code: :tinctures, name: 'Tinctures'},
    {code: :topical, name: 'Topical'},
    {code: :concentrate, name: 'Concentrate'},
    {code: :edibles_liquid, name: 'Edibles - Liquid'},
    {code: :edibles_solid, name: 'Edibles - Solid'},
    {code: :extract, name: 'Extract'},
    {code: :flowers, name: 'Flowers'},
    {code: :oil, name: 'Oil'},
    {code: :part, name: 'Part'},
    {code: :preroll, name: 'Preroll'},
    {code: :shakes_trim, name: 'Shakes/Trim'},
    {code: :wax, name: 'Wax'},
    {code: :other, name: 'Other'},
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

  APP_MODULES = [
    {
      code: 1000,
      name: 'Finance',
      features: [
        {code: 1010, name: 'Invoices'},
        {code: 1020, name: 'Purchase Order'},
        {code: 1030, name: 'Manifest'},
        {code: 1040, name: 'Cost'},
        {code: 1050, name: 'User costs'},
        {code: 1060, name: 'Expenses'},
        {code: 1070, name: 'Product Sales'},
        {code: 1080, name: 'All users payroll'},
        {code: 1090, name: 'My Direct Reports payroll'},
        {code: 1100, name: 'My Payroll'},
      ],
    },
    {
      code: 2000,
      name: 'Inventory',
      features: [
        {code: 2010, name: 'Inventory type'},
        {code: 2020, name: 'Active plants'},
        {code: 2030, name: 'Sales Products'},
        {code: 2040, name: 'Non-sales items'},
        {code: 2050, name: 'Strain type'},
      ],
    },
    {
      code: 3000,
      name: 'Cultivation',
      features: [
        {code: 3010, name: 'Templates'},
        {code: 3020, name: 'All batches'},
        {code: 3030, name: 'Batch assigned to my direct reports'},
        {code: 3040, name: 'Batch assigned to me'},
        {code: 3050, name: 'Asssign tasks to all users'},
        {code: 3060, name: 'Assign tasks only to my direct reports'},
        {code: 3070, name: 'All Tasks'},
        {code: 3080, name: 'Tasks assigned to my direct reports'},
        {code: 3090, name: 'Tasks assigned to me'},
        {code: 3100, name: 'All hours worked'},
        {code: 3110, name: 'Hours assigned to my direct reports'},
        {code: 3120, name: 'My hours worked'},
      ],
    },
    {
      code: 4000,
      name: 'Issues',
      features: [
        {code: 4010, name: 'All issues'},
        {code: 4020, name: 'Issues reported by my direct reports'},
        {code: 4030, name: 'Issues reported by me'},
        {code: 4040, name: 'Assign tasks to all issues'},
        {code: 4050, name: 'Assign tasks to issues reported by my direct report'},
      ],
    },
    {
      code: 9000,
      name: 'Settings',
      features: [
        {code: 9010, name: 'Team Settings / Users'},
        {code: 9020, name: 'Team Settings / Roles'},
      ],
    },
  ].freeze
end

CAN_READ = 1
CAN_UPDATE = 2
CAN_CREATE = 4
CAN_DELETE = 8
