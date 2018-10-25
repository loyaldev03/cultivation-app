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
        Inventory::Catalogue.create!(
          catalogue_type: 'raw_materials',
          label: raw_material[:name],
          category: raw_material[:category],
          sub_category: raw_material[:sub_category],
          facility_id: args[:facility_id],
        )
      end
    end

    def raw_materials_template
      [
        {name: 'Antibacterial Soap', category: 'Antibacterial Soap', is_active: true},
        {name: 'Eye drops', category: 'Eye drops', is_active: true},
        {name: 'Eye Protection', category: 'Eye Protection', is_active: true},
        {name: 'Garbage Bags', category: 'Garbage Bags', is_active: true},
        {name: 'Nitrile Gloves', category: 'Nitrile Gloves', is_active: true},
        {name: 'Rubbing Alcohol', category: 'Rubbing Alcohol', is_active: true},
        {name: 'Scale', category: 'Scale', is_active: true},
        {name: 'Seal Bags', category: 'Seal Bags', is_active: true},
        {name: 'Supplements', category: 'Supplements', is_active: true},
        {name: 'Trim Station', category: 'Trim Station', is_active: true},
        {name: 'Trim Trays', category: 'Trim Trays', is_active: true},
        {name: 'Trimming Scissors', category: 'Trimming Scissors', is_active: true},
        {name: 'Vacuum Sealer ', category: 'Vacuum Sealer', is_active: true},
        {name: 'Other', category: 'Other', is_active: true},

        {name: 'CMH', category: 'Grow Light', is_active: true},
        {name: 'HID', category: 'Grow Light', is_active: true},
        {name: 'HPS', category: 'Grow Light', is_active: true},
        {name: 'LED', category: 'Grow Light', is_active: true},
        {name: 'MS', category: 'Grow Light', is_active: true},
        {name: 'T5 Fluorescent', category: 'Grow Light', is_active: true},

        {name: 'Coco coir', category: 'Grow Medium', is_active: true},
        {name: 'Compost soil', category: 'Grow Medium', is_active: true},
        {name: 'Hardened Expanded Clay (HEC)', category: 'Grow Medium', is_active: true},
        {name: 'Mineral Wool', category: 'Grow Medium', is_active: true},
        {name: 'Peat', category: 'Grow Medium', is_active: true},
        {name: 'Perlite', category: 'Grow Medium', is_active: true},
        {name: 'Soil', category: 'Grow Medium', is_active: true},
        {name: 'Sphagnum', category: 'Grow Medium', is_active: true},
        {name: 'Vermiculite', category: 'Grow Medium', is_active: true},

        {name: 'Ammonia (NH3)', category: 'Nutrients', sub_category: 'Nitrogen', is_active: true},
        {name: 'Blood Meal', category: 'Nutrients', sub_category: 'Nitrogen', is_active: true},
        {name: 'Cottonseed Meal', category: 'Nutrients', sub_category: 'Nitrogen', is_active: true},
        {name: 'Fish Emulsion', category: 'Nutrients', sub_category: 'Nitrogen', is_active: true},
        {name: 'Urea', category: 'Nutrients', sub_category: 'Nitrogen', is_active: true},

        {name: 'Bone Meal', category: 'Nutrients', sub_category: 'Phosphate', is_active: true},
        {name: 'Rock Phosphate', category: 'Nutrients', sub_category: 'Phosphate', is_active: true},
        {name: 'Slag', category: 'Nutrients', sub_category: 'Phosphate', is_active: true},
        {name: 'Super Phosphate', category: 'Nutrients', sub_category: 'Phosphate', is_active: true},

        {name: 'Seaweed', category: 'Nutrients', sub_category: 'Potassium', is_active: true},
        {name: 'Wood ashes', category: 'Nutrients', sub_category: 'Potassium', is_active: true},
      ]
    end
  end
end
