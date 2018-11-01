module Inventory
  class SeedCatalogue
    prepend SimpleCommand

    def initialize(args = {})
      @args = args
    end

    def call
      seed_raw_material_catalogue!
      seed_plant_catalogue!
      seed_sales_catalogue!
      nil
    end

    private

    def seed_raw_material_catalogue!
      raw_materials_template.each do |raw_material|
        Inventory::Catalogue.find_or_create_by!(catalogue_type: 'raw_materials', key: raw_material[:key]) do |c|
          c.label = raw_material[:label]
          c.category = raw_material[:category]
          c.sub_category = raw_material[:sub_category] || ''
          c.uom_dimension = raw_material[:uom_dimension]
          c.is_active = true
        end
      end
    end

    def seed_plant_catalogue!
      Inventory::Catalogue.find_or_create_by!(catalogue_type: Constants::PLANTS_KEY, key: Constants::PLANTS_KEY) do |c|
        c.label = 'Plants'
        c.category = Constants::PLANTS_KEY
        c.is_active = true
        c.uom_dimension = Constants::PLANTS_KEY
      end

      # Inventory::Catalogue.find_or_create_by!(catalogue_type: Constants::PLANTS_KEY, key: Constants::SEEDS_KEY) do |c|
      #   c.label = Constants::PLANTS_KEY
      #   c.category = Constants::PLANTS_KEY
      #   c.is_active = true
      #   c.uom_dimension = Constants::PLANTS_KEY
      # end

      # Inventory::Catalogue.find_or_create_by!(catalogue_type: Constants::PLANTS_KEY, key: Constants::PURCHASED_CLONES_KEY) do |c|
      #   c.label = 'Purchased Clones'
      #   c.category = Constants::PLANTS_KEY
      #   c.is_active = true
      #   c.uom_dimension = Constants::PLANTS_KEY
      # end
    end

    def seed_sales_catalogue!
      sales_template.each do |item|
        Inventory::Catalogue.find_or_create_by!(catalogue_type: Constants::SALES_KEY, key: item[:key]) do |c|
          c.label = item[:label]
          c.category = item[:category]
          c.sub_category = item[:sub_category] || ''
          c.uom_dimension = item[:uom_dimension]
          c.uom_dimension = Constants::SALES_KEY
          c.is_active = true
        end
      end
    end

    def raw_materials_template
      [
        # General rule: Only selectable by user has uom_dimension.
        # If main parent, category is empty.
        # The child must use parent key in category field.
        # Child of the child must use its parent key in subcategory field.

        # Others and its child
        {label: 'Others', category: '', key: Constants::OTHERS_KEY, is_active: true},
        {label: 'Antibacterial Soap', category: Constants::OTHERS_KEY, key: 'antibacterial_soap', is_active: true, uom_dimension: 'pieces'},
        {label: 'Antibacterial Soap', category: Constants::OTHERS_KEY, key: 'antibacterial_soap', is_active: true, uom_dimension: 'pieces'},
        {label: 'Eye drops', category: Constants::OTHERS_KEY, key: 'eye_drops', is_active: true, uom_dimension: 'pieces'},
        {label: 'Eye Protection', category: Constants::OTHERS_KEY, key: 'eye_protection', is_active: true, uom_dimension: 'pieces'},
        {label: 'Garbage Bags', category: Constants::OTHERS_KEY, key: 'garbage_bags', is_active: true, uom_dimension: 'pieces'},
        {label: 'Nitrile Gloves', category: Constants::OTHERS_KEY, key: 'nitrile_gloves', is_active: true, uom_dimension: 'pieces'},
        {label: 'Rubbing Alcohol', category: Constants::OTHERS_KEY, key: 'rubbing_alcohol', is_active: true, uom_dimension: 'pieces'},
        {label: 'Scale', category: Constants::OTHERS_KEY, key: 'scale', is_active: true, uom_dimension: 'pieces'},
        {label: 'Seal Bags', category: Constants::OTHERS_KEY, key: 'seal_bags', is_active: true, uom_dimension: 'pieces'},
        # {label: 'Supplements',         category: Constants::OTHERS_KEY, key: 'supplements', is_active: true, uom_dimension: 'pieces'},
        {label: 'Trim Station', category: Constants::OTHERS_KEY, key: 'trim_station', is_active: true, uom_dimension: 'pieces'},
        {label: 'Trim Trays', category: Constants::OTHERS_KEY, key: 'trim_trays', is_active: true, uom_dimension: 'pieces'},
        {label: 'Trimming Scissors', category: Constants::OTHERS_KEY, key: 'trimming_scissors', is_active: true, uom_dimension: 'pieces'},
        {label: 'Vacuum Sealer ', category: Constants::OTHERS_KEY, key: 'vacuum_sealer', is_active: true, uom_dimension: 'pieces'},
        {label: 'Other', category: Constants::OTHERS_KEY, key: 'others_other', is_active: true, uom_dimension: 'pieces'},

        # Grow light and its child
        {label: 'Grow lights', category: '', key: Constants::GROW_LIGHT_KEY, is_active: true},
        {label: 'CMH', category: Constants::GROW_LIGHT_KEY, key: 'cmh', is_active: true, uom_dimension: 'pieces'},
        {label: 'HID', category: Constants::GROW_LIGHT_KEY, key: 'hid', is_active: true, uom_dimension: 'pieces'},
        {label: 'HPS', category: Constants::GROW_LIGHT_KEY, key: 'hps', is_active: true, uom_dimension: 'pieces'},
        {label: 'LED', category: Constants::GROW_LIGHT_KEY, key: 'led', is_active: true, uom_dimension: 'pieces'},
        {label: 'MS', category: Constants::GROW_LIGHT_KEY, key: 'ms', is_active: true, uom_dimension: 'pieces'},
        {label: 'T5 Fluorescent', category: Constants::GROW_LIGHT_KEY, key: 't5_fluorescent', is_active: true, uom_dimension: 'pieces'},

        # Grow medium and its child
        {label: 'Grow medium', category: '', key: Constants::GROW_MEDIUM_KEY, is_active: true},
        {label: 'Coco coir', category: Constants::GROW_MEDIUM_KEY, key: 'coco_coir', is_active: true, uom_dimension: 'weights'},
        {label: 'Compost soil', category: Constants::GROW_MEDIUM_KEY, key: 'compost_soil', is_active: true, uom_dimension: 'weights'},
        {label: 'Hardened Expanded Clay (HEC)', category: Constants::GROW_MEDIUM_KEY, key: 'hec', is_active: true, uom_dimension: 'weights'},
        {label: 'Mineral Wool', category: Constants::GROW_MEDIUM_KEY, key: 'mineral_wool', is_active: true, uom_dimension: 'weights'},
        {label: 'Peat', category: Constants::GROW_MEDIUM_KEY, key: 'peat', is_active: true, uom_dimension: 'weights'},
        {label: 'Perlite', category: Constants::GROW_MEDIUM_KEY, key: 'perlite', is_active: true, uom_dimension: 'weights'},
        {label: 'Soil', category: Constants::GROW_MEDIUM_KEY, key: 'soil', is_active: true, uom_dimension: 'weights'},
        {label: 'Sphagnum', category: Constants::GROW_MEDIUM_KEY, key: 'sphagnum', is_active: true, uom_dimension: 'weights'},
        {label: 'Vermiculite', category: Constants::GROW_MEDIUM_KEY, key: 'vermiculite', is_active: true, uom_dimension: 'weights'},

        # Nutrient and its child (2 level)
        {label: 'Nutrients', category: '', key: Constants::NUTRIENTS_KEY, is_active: true},
        # Blend has no child
        {label: 'Blend', category: Constants::NUTRIENTS_KEY, key: 'blend', sub_category: '', is_active: true},
        {label: 'Blend', category: Constants::NUTRIENTS_KEY, key: 'blend_blend', sub_category: 'blend', is_active: true, uom_dimension: 'weights'},

        {label: 'Nitrogen Product', category: Constants::NUTRIENTS_KEY, key: 'nitrogen', sub_category: '', is_active: true},
        {label: 'Ammonia (NH3)', category: Constants::NUTRIENTS_KEY, key: 'ammonia', sub_category: 'nitrogen', is_active: true, uom_dimension: 'weights'},
        {label: 'Blood Meal', category: Constants::NUTRIENTS_KEY, key: 'blood_meal', sub_category: 'nitrogen', is_active: true, uom_dimension: 'weights'},
        {label: 'Cottonseed Meal', category: Constants::NUTRIENTS_KEY, key: 'cottonseed_meal', sub_category: 'nitrogen', is_active: true, uom_dimension: 'weights'},
        {label: 'Fish Emulsion', category: Constants::NUTRIENTS_KEY, key: 'fish_emulsion', sub_category: 'nitrogen', is_active: true, uom_dimension: 'weights'},
        {label: 'Urea', category: Constants::NUTRIENTS_KEY, key: 'urea', sub_category: 'nitrogen', is_active: true, uom_dimension: 'weights'},

        {label: 'Phosphate Product', category: Constants::NUTRIENTS_KEY, key: 'phosphate', sub_category: '', is_active: true},
        {label: 'Bone Meal', category: Constants::NUTRIENTS_KEY, key: 'bone_meal', sub_category: 'phosphate', is_active: true, uom_dimension: 'weights'},
        {label: 'Rock Phosphate', category: Constants::NUTRIENTS_KEY, key: 'rock phosphate', sub_category: 'phosphate', is_active: true, uom_dimension: 'weights'},
        {label: 'Slag', category: Constants::NUTRIENTS_KEY, key: 'slag', sub_category: 'phosphate', is_active: true, uom_dimension: 'weights'},
        {label: 'Super Phosphate', category: Constants::NUTRIENTS_KEY, key: 'super_phosphate', sub_category: 'phosphate', is_active: true, uom_dimension: 'weights'},

        {label: 'Potassium Product', category: Constants::NUTRIENTS_KEY, key: 'potassium', sub_category: '', is_active: true},
        {label: 'Seaweed', category: Constants::NUTRIENTS_KEY, key: 'seaweed', sub_category: 'potassium', is_active: true, uom_dimension: 'weights'},
        {label: 'Wood ashes', category: Constants::NUTRIENTS_KEY, key: 'wood_ashes', sub_category: 'potassium', is_active: true, uom_dimension: 'weights'},

        # Supplement and its child
        {label: 'Supplements', category: '', key: Constants::SUPPLEMENTS_KEY, is_active: true},
        {label: 'Amino Acid', category: Constants::SUPPLEMENTS_KEY, key: 'amino_acid', is_active: true, uom_dimension: 'volumes'},
        {label: 'Azomite', category: Constants::SUPPLEMENTS_KEY, key: 'azomite', is_active: true, uom_dimension: 'weights'},
        {label: 'Bat Guano', category: Constants::SUPPLEMENTS_KEY, key: 'bat_guano', is_active: true, uom_dimension: 'weights'},
        {label: 'Blood Meal', category: Constants::SUPPLEMENTS_KEY, key: 'blood_meal', is_active: true, uom_dimension: 'weights'},
        {label: 'Carbohydrates', category: Constants::SUPPLEMENTS_KEY, key: 'carbohydrates', is_active: true, uom_dimension: 'weights'},
        {label: 'Citric acids', category: Constants::SUPPLEMENTS_KEY, key: 'citric_acids', is_active: true, uom_dimension: 'volumes'},
        {label: 'Compost tea', category: Constants::SUPPLEMENTS_KEY, key: 'compost_tea', is_active: true, uom_dimension: 'weights'},
        {label: 'Dolomite Lime', category: Constants::SUPPLEMENTS_KEY, key: 'dolomite_lime', is_active: true, uom_dimension: 'weights'},
        {label: 'Enzymes', category: Constants::SUPPLEMENTS_KEY, key: 'enzymes', is_active: true, uom_dimension: 'weights'},
        {label: 'Epsom Salt', category: Constants::SUPPLEMENTS_KEY, key: 'epsom_salt', is_active: true, uom_dimension: 'weights'},
        {label: 'Fulvic acid', category: Constants::SUPPLEMENTS_KEY, key: 'fulvic_acid', is_active: true, uom_dimension: 'volumes'},
        {label: 'Gibberellic Acid', category: Constants::SUPPLEMENTS_KEY, key: 'gibberellic_acid', is_active: true, uom_dimension: 'volumes'},
        {label: 'Humic Acid', category: Constants::SUPPLEMENTS_KEY, key: 'humic_acid', is_active: true, uom_dimension: 'volumes'},
        {label: 'Mycorrhiza', category: Constants::SUPPLEMENTS_KEY, key: 'mycorrhiza', is_active: true, uom_dimension: 'weights'},
        {label: 'Silica', category: Constants::SUPPLEMENTS_KEY, key: 'silica', is_active: true, uom_dimension: 'weights'},
        {label: 'Sulfur based additives', category: Constants::SUPPLEMENTS_KEY, key: 'sulfur_based_additives', is_active: true, uom_dimension: 'weights'},
        {label: 'Vitamin', category: Constants::SUPPLEMENTS_KEY, key: 'vitamin', is_active: true, uom_dimension: 'weights'},
        {label: 'Worm Castings', category: Constants::SUPPLEMENTS_KEY, key: 'worm castings', is_active: true, uom_dimension: 'weights'},

        # Purchased clones and seed
        {label: 'Seeds', category: Constants::SEEDS_KEY, key: Constants::SEEDS_KEY, is_active: true, uom_dimension: Constants::PLANTS_KEY},
        {label: 'Purchased clone', category: Constants::PURCHASED_CLONES_KEY, key: Constants::PURCHASED_CLONES_KEY, is_active: true, uom_dimension: Constants::PLANTS_KEY},
      ]
    end

    def sales_template
      [
        {label: 'Capsule/Tablet', category: Constants::SALES_PRODUCT_KEY, key: Constants::SALES_PRODUCT_KEY},
        {label: 'Concentrate (liquid)', category: Constants::SALES_PRODUCT_KEY, key: 'concentrate_liquid'},
        {label: 'Concentrate (liquid each)', category: Constants::SALES_PRODUCT_KEY, key: 'concentrate_liquid_each'},
        {label: 'Concentrate (solid)', category: Constants::SALES_PRODUCT_KEY, key: 'concentrate_solid'},
        {label: 'Concentrate (solid each)', category: Constants::SALES_PRODUCT_KEY, key: 'concentrate_solid each'},
        {label: 'Edible', category: Constants::SALES_PRODUCT_KEY, key: 'edible'},
        {label: 'Edible (each)', category: Constants::SALES_PRODUCT_KEY, key: 'edible_each'},
        {label: 'Extract (liquid)', category: Constants::SALES_PRODUCT_KEY, key: 'extract_liquid'},
        {label: 'Extract (liquid-each)', category: Constants::SALES_PRODUCT_KEY, key: 'extract_liquid_each'},
        {label: 'Extract (solid)', category: Constants::SALES_PRODUCT_KEY, key: 'extract_solid'},
        {label: 'Extract (solid-each)', category: Constants::SALES_PRODUCT_KEY, key: 'extract_solid_each'},
        {label: 'Flower', category: Constants::SALES_PRODUCT_KEY, key: 'flower'},
        {label: 'Fresh Cannabis Plant', category: Constants::SALES_PRODUCT_KEY, key: 'fresh_cannabis_plant'},
        {label: 'Immature Plant', category: Constants::SALES_PRODUCT_KEY, key: 'immature_plant'},
        {label: 'Kief', category: Constants::SALES_PRODUCT_KEY, key: 'kief'},
        {label: 'Leaf', category: Constants::SALES_PRODUCT_KEY, key: 'leaf'},
        {label: 'Liquid', category: Constants::SALES_PRODUCT_KEY, key: 'liquid'},
        {label: 'Liquid (each)', category: Constants::SALES_PRODUCT_KEY, key: 'liquid_each'},
        {label: 'Pre-Roll Flower', category: Constants::SALES_PRODUCT_KEY, key: 'pre_roll_flower'},
        {label: 'Pre-Roll Leaf', category: Constants::SALES_PRODUCT_KEY, key: 'pre_roll_leaf'},
        {label: 'Suppository (each)', category: Constants::SALES_PRODUCT_KEY, key: 'suppository_each'},
        {label: 'Tincture', category: Constants::SALES_PRODUCT_KEY, key: 'tincture'},
        {label: 'Tincture (each)', category: Constants::SALES_PRODUCT_KEY, key: 'tincture_each'},
        {label: 'Topical', category: Constants::SALES_PRODUCT_KEY, key: 'topical'},
        {label: 'Topical (liquid)', category: Constants::SALES_PRODUCT_KEY, key: 'topical_liquid'},
        {label: 'Topical (liquid-each)', category: Constants::SALES_PRODUCT_KEY, key: 'topical_liquid_each'},
        {label: 'Topical (solid)', category: Constants::SALES_PRODUCT_KEY, key: 'topical_solid'},
        {label: 'Topical (solid-each)', category: Constants::SALES_PRODUCT_KEY, key: 'topical_solid_each'},
        {label: 'Vape Oil', category: Constants::SALES_PRODUCT_KEY, key: 'vape_oil'},
        {label: 'Vape Oil (each)', category: Constants::SALES_PRODUCT_KEY, key: 'vape_oil_each'},
        {label: 'Wax', category: Constants::SALES_PRODUCT_KEY, key: 'wax'},
        {label: 'Other', category: Constants::SALES_PRODUCT_KEY, key: 'other'},
      ]
    end
  end
end
