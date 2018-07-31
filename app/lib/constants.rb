module Constants
  PLANT_TYPES = [
    {code: :clone, name: 'Clone'},
    {code: :mother, name: 'Mother'},
    {code: :seed, name: 'Seed'},
    {code: :veg, name: 'Veg Group'},
  ].freeze

  STRAIN_TYPES = [
    {code: :hybrid, name: 'Hybrid'},
    {code: :indica, name: 'Indica'},
    {code: :sativa, name: 'Sativa'},
  ].freeze

  ROOM_PURPOSE = [
    {code: :clone, name: 'Clone'},
    {code: :cure, name: 'Cure Room'},
    {code: :dry, name: 'Dry Room'},
    {code: :flower, name: 'Flower'},
    {code: :mother, name: 'Mother'},
    {code: :storage, name: 'Storage'},
    {code: :vault, name: 'Vault'},
    {code: :trim, name: 'Trim'},
    {code: :veg, name: 'Veg'},
    {code: :veg1, name: 'Veg 1'},
    {code: :veg2, name: 'Veg 2'},
  ].freeze

  SOURCE_TYPES = [
    {code: :clone, name: 'Clone'},
    {code: :mother, name: 'Mother'},
    {code: :seed, name: 'Seed'},
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
    {code: :mineral_wool, name: 'Mineral Wool'},
    {code: :peat, name: 'Peat'},
    {code: :perlite, name: 'Perlite'},
    {code: :soil, name: 'Soil'},
    {code: :sphagnum, name: 'Sphagnum'},
    {code: :vermiculite, name: 'Vermiculite'},
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
    {code: :trays, name: 'Trays'},
    {code: :pots, name: 'Pots / Plants'},
    {code: :cups, name: 'Cups'},
  ].freeze

  YES_NO = [
    {code: :yes, name: 'Yes'},
    {code: :no, name: 'No'},
  ].freeze
end
