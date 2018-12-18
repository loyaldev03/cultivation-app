module Common
  class SeedUnitOfMeasure
    prepend SimpleCommand
    UOM = Common::UnitOfMeasure

    def call
      ## Plants
      UOM.find_or_create_by!(name: 'plant',
                             unit: 'plant',
                             dimension: Constants::PLANTS_KEY,
                             is_base_unit: true,
                             base_unit: 'plant',
                             conversion: 1)

      UOM.find_or_create_by!(name: 'seed',
                             unit: 'seed',
                             dimension: Constants::PLANTS_KEY,
                             is_base_unit: false,
                             base_unit: 'plant',
                             conversion: 1)

      UOM.find_or_create_by!(name: 'pot',
                             unit: 'pot',
                             dimension: Constants::PLANTS_KEY,
                             is_base_unit: false,
                             base_unit: 'plant',
                             conversion: 1)

      UOM.find_or_create_by!(name: 'cup',
                             unit: 'cup',
                             dimension: Constants::PLANTS_KEY,
                             is_base_unit: false,
                             base_unit: 'plant',
                             conversion: 1)

      ## Pieces
      UOM.find_or_create_by!(name: 'piece',
                             unit: 'pc',
                             dimension: 'piece',
                             is_base_unit: true,
                             base_unit: 'pc',
                             conversion: 1)

      UOM.find_or_create_by!(name: 'dozen',
                             unit: 'dz',
                             dimension: 'piece',
                             is_base_unit: false,
                             base_unit: 'pc',
                             conversion: 12)

      UOM.find_or_create_by!(name: 'each',
                             unit: 'ea',
                             dimension: 'piece',
                             is_base_unit: false,
                             base_unit: 'pc',
                             conversion: 1)

      UOM.find_or_create_by!(name: 'bottle',
                             unit: 'bot',
                             dimension: 'piece',
                             is_base_unit: false,
                             base_unit: 'pc',
                             conversion: 1)

      UOM.find_or_create_by!(name: 'bag',
                             unit: 'bag',
                             dimension: 'piece',
                             is_base_unit: false,
                             base_unit: 'pc',
                             conversion: 1)

      ## Weight
      UOM.find_or_create_by!(name: 'kilogramme',
                             unit: 'kg',
                             dimension: 'weight',
                             is_base_unit: true,
                             base_unit: 'kg',
                             conversion: 1)

      UOM.find_or_create_by!(name: 'gram',
                             unit: 'g',
                             dimension: 'weight',
                             is_base_unit: false,
                             base_unit: 'kg',
                             conversion: 0.001)

      UOM.find_or_create_by!(name: 'milligram',
                             unit: 'mg',
                             dimension: 'weight',
                             is_base_unit: false,
                             base_unit: 'kg',
                             conversion: 0.000001)

      UOM.find_or_create_by!(name: 'ounce',
                             unit: 'oz',
                             dimension: 'weight',
                             is_base_unit: false,
                             base_unit: 'kg',
                             conversion: 0.028349523)

      UOM.find_or_create_by!(name: 'pound',
                             unit: 'lb',
                             dimension: 'weight',
                             is_base_unit: false,
                             base_unit: 'kg',
                             conversion: 0.45359237)

      ## Volume
      UOM.find_or_create_by!(name: 'litre',
                             unit: 'l',
                             dimension: 'volume',
                             is_base_unit: true,
                             base_unit: 'l',
                             conversion: 1)

      UOM.find_or_create_by!(name: 'millilitre',
                             unit: 'ml',
                             dimension: 'volume',
                             is_base_unit: false,
                             base_unit: 'l',
                             conversion: 0.001)

      UOM.find_or_create_by!(name: 'gallon',
                             unit: 'gal',
                             dimension: 'volume',
                             is_base_unit: false,
                             base_unit: 'l',
                             conversion: 4.54609)

      UOM.find_or_create_by!(name: 'fluid ounce',
                             unit: 'fl oz',
                             dimension: 'volume',
                             is_base_unit: false,
                             base_unit: 'l',
                             conversion: 0.0284130625)

      ## Length
      UOM.find_or_create_by!(name: 'meter',
                             unit: 'm',
                             dimension: 'length',
                             is_base_unit: true,
                             base_unit: 'm',
                             conversion: 1)

      UOM.find_or_create_by!(name: 'centimeter',
                             unit: 'cm',
                             dimension: 'length',
                             is_base_unit: false,
                             base_unit: 'm',
                             conversion: 0.01)

      UOM.find_or_create_by!(name: 'millimeter',
                             unit: 'mm',
                             dimension: 'length',
                             is_base_unit: false,
                             base_unit: 'l',
                             conversion: 0.0284130625)

      UOM.find_or_create_by!(name: 'inch',
                             unit: 'in',
                             dimension: 'length',
                             is_base_unit: false,
                             base_unit: 'm',
                             conversion: 0.0254)

      UOM.find_or_create_by!(name: 'foot',
                             unit: 'ft',
                             dimension: 'length',
                             is_base_unit: false,
                             base_unit: 'm',
                             conversion: 0.3048)

      UOM.find_or_create_by!(name: 'yard',
                             unit: 'yd',
                             dimension: 'length',
                             is_base_unit: false,
                             base_unit: 'm',
                             conversion: 0.9144)

      ## TODO: Sales uom
      # Constants::SALES_KEY
      #
      # 1/4 oz
      # 1/8 oz
      # Assorted Box
      # Case 
      # Catridge
      # Gram
      # Half gr.
      # Kg
      # Ounce
      # Pound
      # Quarter Lb
      # Sumpin
      # Unit

      nil
    end
  end
end
