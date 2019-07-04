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
      UOM.find_or_create_by!(name: Constants::UOM_DMS_PIECES,
                             unit: 'pc',
                             dimension: Constants::UOM_DMS_PIECES,
                             is_base_unit: true,
                             base_unit: 'pc',
                             conversion: 1)

      UOM.find_or_create_by!(name: 'dozen',
                             unit: 'dz',
                             dimension: Constants::UOM_DMS_PIECES,
                             is_base_unit: false,
                             base_unit: 'pc',
                             conversion: 12)

      UOM.find_or_create_by!(name: 'each',
                             unit: 'ea',
                             dimension: Constants::UOM_DMS_PIECES,
                             is_base_unit: false,
                             base_unit: 'pc',
                             conversion: 1)

      UOM.find_or_create_by!(name: 'bottle',
                             unit: 'bot',
                             dimension: Constants::UOM_DMS_PIECES,
                             is_base_unit: false,
                             base_unit: 'pc',
                             conversion: 1)

      UOM.find_or_create_by!(name: 'bag',
                             unit: 'bag',
                             dimension: Constants::UOM_DMS_PIECES,
                             is_base_unit: false,
                             base_unit: 'pc',
                             conversion: 1)

      ## Weight
      UOM.find_or_create_by!(name: 'kilogramme',
                             unit: 'kg',
                             dimension: Constants::UOM_DMS_WEIGHT,
                             is_base_unit: true,
                             base_unit: 'kg',
                             conversion: 1)

      UOM.find_or_create_by!(name: 'gram',
                             unit: 'g',
                             dimension: Constants::UOM_DMS_WEIGHT,
                             is_base_unit: false,
                             base_unit: 'kg',
                             conversion: 0.001)

      UOM.find_or_create_by!(name: 'milligram',
                             unit: 'mg',
                             dimension: Constants::UOM_DMS_WEIGHT,
                             is_base_unit: false,
                             base_unit: 'kg',
                             conversion: 0.000001)

      UOM.find_or_create_by!(name: 'ounce',
                             unit: 'oz',
                             dimension: Constants::UOM_DMS_WEIGHT,
                             is_base_unit: false,
                             base_unit: 'kg',
                             conversion: 0.028349523)

      UOM.find_or_create_by!(name: 'pound',
                             unit: 'lb',
                             dimension: Constants::UOM_DMS_WEIGHT,
                             is_base_unit: false,
                             base_unit: 'kg',
                             conversion: 0.45359237)

      ## Volume
      UOM.find_or_create_by!(name: 'litre',
                             unit: 'l',
                             dimension: Constants::UOM_DMS_VOLUME,
                             is_base_unit: true,
                             base_unit: 'l',
                             conversion: 1)

      UOM.find_or_create_by!(name: 'millilitre',
                             unit: 'ml',
                             dimension: Constants::UOM_DMS_VOLUME,
                             is_base_unit: false,
                             base_unit: 'l',
                             conversion: 0.001)

      UOM.find_or_create_by!(name: 'gallon',
                             unit: 'gal',
                             dimension: Constants::UOM_DMS_VOLUME,
                             is_base_unit: false,
                             base_unit: 'l',
                             conversion: 4.54609)

      UOM.find_or_create_by!(name: 'fluid ounce',
                             unit: 'fl oz',
                             dimension: Constants::UOM_DMS_VOLUME,
                             is_base_unit: false,
                             base_unit: 'l',
                             conversion: 0.0284130625)

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
