module Inventory
  class CreateRawMaterials
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
        {label: 'Others', category: '', key: 'others', is_active: true},
        {label: 'Antibacterial Soap', category: 'others', key: 'antibacterial_soap', is_active: true, uom_dimension: 'pieces'},
        {label: 'Antibacterial Soap', category: 'others', key: 'antibacterial_soap', is_active: true, uom_dimension: 'pieces'},
        {label: 'Eye drops', category: 'others', key: 'eye_drops', is_active: true, uom_dimension: 'pieces'},
        {label: 'Eye Protection', category: 'others', key: 'eye_protection', is_active: true, uom_dimension: 'pieces'},
        {label: 'Garbage Bags', category: 'others', key: 'garbage_bags', is_active: true, uom_dimension: 'pieces'},
        {label: 'Nitrile Gloves', category: 'others', key: 'nitrile_gloves', is_active: true, uom_dimension: 'pieces'},
        {label: 'Rubbing Alcohol', category: 'others', key: 'rubbing_alcohol', is_active: true, uom_dimension: 'pieces'},
        {label: 'Scale', category: 'others', key: 'scale', is_active: true, uom_dimension: 'pieces'},
        {label: 'Seal Bags', category: 'others', key: 'seal_bags', is_active: true, uom_dimension: 'pieces'},
        # {label: 'Supplements',         category: 'others', key: 'supplements', is_active: true, uom_dimension: 'pieces'},
        {label: 'Trim Station', category: 'others', key: 'trim_station', is_active: true, uom_dimension: 'pieces'},
        {label: 'Trim Trays', category: 'others', key: 'trim_trays', is_active: true, uom_dimension: 'pieces'},
        {label: 'Trimming Scissors', category: 'others', key: 'trimming_scissors', is_active: true, uom_dimension: 'pieces'},
        {label: 'Vacuum Sealer ', category: 'others', key: 'vacuum_sealer', is_active: true, uom_dimension: 'pieces'},
        {label: 'Other', category: 'others', key: 'others_other', is_active: true, uom_dimension: 'pieces'},

        # Grow light and its child
        {label: 'Grow lights', category: '', key: 'grow_light', is_active: true},
        {label: 'CMH', category: 'grow_light', key: 'cmh', is_active: true, uom_dimension: 'pieces'},
        {label: 'HID', category: 'grow_light', key: 'hid', is_active: true, uom_dimension: 'pieces'},
        {label: 'HPS', category: 'grow_light', key: 'hps', is_active: true, uom_dimension: 'pieces'},
        {label: 'LED', category: 'grow_light', key: 'led', is_active: true, uom_dimension: 'pieces'},
        {label: 'MS', category: 'grow_light', key: 'ms', is_active: true, uom_dimension: 'pieces'},
        {label: 'T5 Fluorescent', category: 'grow_light', key: 't5_fluorescent', is_active: true, uom_dimension: 'pieces'},

        # Grow medium and its child
        {label: 'Grow medium', category: '', key: 'grow_medium', is_active: true},
        {label: 'Coco coir', category: 'grow_medium', key: 'coco_coir', is_active: true, uom_dimension: 'weights'},
        {label: 'Compost soil', category: 'grow_medium', key: 'compost_soil', is_active: true, uom_dimension: 'weights'},
        {label: 'Hardened Expanded Clay (HEC)', category: 'grow_medium', key: 'hec', is_active: true, uom_dimension: 'weights'},
        {label: 'Mineral Wool', category: 'grow_medium', key: 'mineral_wool', is_active: true, uom_dimension: 'weights'},
        {label: 'Peat', category: 'grow_medium', key: 'peat', is_active: true, uom_dimension: 'weights'},
        {label: 'Perlite', category: 'grow_medium', key: 'perlite', is_active: true, uom_dimension: 'weights'},
        {label: 'Soil', category: 'grow_medium', key: 'soil', is_active: true, uom_dimension: 'weights'},
        {label: 'Sphagnum', category: 'grow_medium', key: 'sphagnum', is_active: true, uom_dimension: 'weights'},
        {label: 'Vermiculite', category: 'grow_medium', key: 'vermiculite', is_active: true, uom_dimension: 'weights'},

        # Nutrient and its child (2 level)
        {label: 'Nutrients', category: '', key: 'nutrients', is_active: true},
        # Blend has no child
        {label: 'Blend', category: 'nutrients', key: 'blend', sub_category: '', is_active: true, uom_dimension: 'weights'},

        {label: 'Nitrogen Product', category: 'nutrients', key: 'nitrogen', sub_category: '', is_active: true},
        {label: 'Ammonia (NH3)', category: 'nutrients', key: 'ammonia', sub_category: 'nitrogen', is_active: true, uom_dimension: 'weights'},
        {label: 'Blood Meal', category: 'nutrients', key: 'blood_meal', sub_category: 'nitrogen', is_active: true, uom_dimension: 'weights'},
        {label: 'Cottonseed Meal', category: 'nutrients', key: 'cottonseed_meal', sub_category: 'nitrogen', is_active: true, uom_dimension: 'weights'},
        {label: 'Fish Emulsion', category: 'nutrients', key: 'fish_emulsion', sub_category: 'nitrogen', is_active: true, uom_dimension: 'weights'},
        {label: 'Urea', category: 'nutrients', key: 'urea', sub_category: 'nitrogen', is_active: true, uom_dimension: 'weights'},

        {label: 'Phosphate Product', category: 'nutrients', key: 'phosphate', sub_category: '', is_active: true},
        {label: 'Bone Meal', category: 'nutrients', key: 'bone_meal', sub_category: 'phosphate', is_active: true, uom_dimension: 'weights'},
        {label: 'Rock Phosphate', category: 'nutrients', key: 'rock phosphate', sub_category: 'phosphate', is_active: true, uom_dimension: 'weights'},
        {label: 'Slag', category: 'nutrients', key: 'slag', sub_category: 'phosphate', is_active: true, uom_dimension: 'weights'},
        {label: 'Super Phosphate', category: 'nutrients', key: 'super_phosphate', sub_category: 'phosphate', is_active: true, uom_dimension: 'weights'},

        {label: 'Potassium Product', category: 'nutrients', key: 'potassium', sub_category: '', is_active: true},
        {label: 'Seaweed', category: 'nutrients', key: 'seaweed', sub_category: 'potassium', is_active: true, uom_dimension: 'weights'},
        {label: 'Wood ashes', category: 'nutrients', key: 'wood_ashes', sub_category: 'potassium', is_active: true, uom_dimension: 'weights'},

        # Supplement and its child
        {label: 'Supplements', category: '', key: 'supplements', is_active: true},
        {label: 'Amino Acid', category: 'supplements', key: 'amino_acid', is_active: true, uom_dimension: 'volumes'},
        {label: 'Azomite', category: 'supplements', key: 'azomite', is_active: true, uom_dimension: 'weights'},
        {label: 'Bat Guano', category: 'supplements', key: 'bat_guano', is_active: true, uom_dimension: 'weights'},
        {label: 'Blood Meal', category: 'supplements', key: 'blood_meal', is_active: true, uom_dimension: 'weights'},
        {label: 'Carbohydrates', category: 'supplements', key: 'carbohydrates', is_active: true, uom_dimension: 'weights'},
        {label: 'Citric acids', category: 'supplements', key: 'citric_acids', is_active: true, uom_dimension: 'volumes'},
        {label: 'Compost tea', category: 'supplements', key: 'compost_tea', is_active: true, uom_dimension: 'weights'},
        {label: 'Dolomite Lime', category: 'supplements', key: 'dolomite_lime', is_active: true, uom_dimension: 'weights'},
        {label: 'Enzymes', category: 'supplements', key: 'enzymes', is_active: true, uom_dimension: 'weights'},
        {label: 'Epsom Salt', category: 'supplements', key: 'epsom_salt', is_active: true, uom_dimension: 'weights'},
        {label: 'Fulvic acid', category: 'supplements', key: 'fulvic_acid', is_active: true, uom_dimension: 'volumes'},
        {label: 'Gibberellic Acid', category: 'supplements', key: 'gibberellic_acid', is_active: true, uom_dimension: 'volumes'},
        {label: 'Humic Acid', category: 'supplements', key: 'humic_acid', is_active: true, uom_dimension: 'volumes'},
        {label: 'Mycorrhiza', category: 'supplements', key: 'mycorrhiza', is_active: true, uom_dimension: 'weights'},
        {label: 'Silica', category: 'supplements', key: 'silica', is_active: true, uom_dimension: 'weights'},
        {label: 'Sulfur based additives', category: 'supplements', key: 'sulfur_based_additives', is_active: true, uom_dimension: 'weights'},
        {label: 'Vitamin', category: 'supplements', key: 'vitamin', is_active: true, uom_dimension: 'weights'},
        {label: 'Worm Castings', category: 'supplements', key: 'worm castings', is_active: true, uom_dimension: 'weights'},
      ]
    end
  end
end
