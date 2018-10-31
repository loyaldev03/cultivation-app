module Inventory
  class SeedRawMaterials
    prepend SimpleCommand

    def initialize(args)
      @args = args
    end

    def call
      save_record(@args)
    end

    private

    def save_record(args)
      raw_materials_template.each do |raw_material|
        Inventory::Catalogue.find_or_create_by!(
          catalogue_type: 'raw_materials',
          key: raw_material[:key],
          label: raw_material[:label],
          category: raw_material[:category],
          sub_category: raw_material[:sub_category] || '',
          facility_id: args[:facility_id],
          uom_dimension: raw_material[:uom_dimension],
          is_active: true,
        )
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
      ]
    end
  end
end
