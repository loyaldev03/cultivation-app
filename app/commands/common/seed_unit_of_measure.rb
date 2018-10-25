module Common
  class SeedUnitOfMeasure
    prepend SimpleCommand
    UOM = Common::UnitOfMeasure

    def call
      ## Pieces
      UOM.find_or_create_by!(name: 'piece',
                             unit: 'pc',
                             dimension: 'pieces',
                             is_base_unit: true,
                             base_unit: 'pc',
                             conversion: 1)

      UOM.find_or_create_by(name: 'dozen',
                            unit: 'dz',
                            dimension: 'pieces',
                            is_base_unit: false,
                            base_unit: 'pc',
                            conversion: 12)

      ## Weight
      UOM.find_or_create_by(name: 'kilogramme',
                            unit: 'kg',
                            dimension: 'weights',
                            is_base_unit: true,
                            base_unit: 'kg',
                            conversion: 1)

      UOM.find_or_create_by(name: 'gram',
                            unit: 'g',
                            dimension: 'weights',
                            is_base_unit: false,
                            base_unit: 'kg',
                            conversion: 0.001)

      UOM.find_or_create_by(name: 'milligram',
                            unit: 'mg',
                            dimension: 'weights',
                            is_base_unit: false,
                            base_unit: 'kg',
                            conversion: 0.000001)

      UOM.find_or_create_by(name: 'ounce',
                            unit: 'oz',
                            dimension: 'weights',
                            is_base_unit: false,
                            base_unit: 'kg',
                            conversion: 0.028349523)

      UOM.find_or_create_by(name: 'pound',
                            unit: 'lb',
                            dimension: 'weights',
                            is_base_unit: false,
                            base_unit: 'kg',
                            conversion: 0.45359237)

      ## Volume
      UOM.find_or_create_by(name: 'litre',
                            unit: 'l',
                            dimension: 'volumes',
                            is_base_unit: true,
                            base_unit: 'l',
                            conversion: 1)

      UOM.find_or_create_by(name: 'millilitre',
                            unit: 'ml',
                            dimension: 'volumes',
                            is_base_unit: false,
                            base_unit: 'l',
                            conversion: 0.001)

      UOM.find_or_create_by(name: 'gallon',
                            unit: 'gal',
                            dimension: 'volumes',
                            is_base_unit: false,
                            base_unit: 'l',
                            conversion: 4.54609)

      UOM.find_or_create_by(name: 'fluid ounce',
                            unit: 'fl oz',
                            dimension: 'volumes',
                            is_base_unit: false,
                            base_unit: 'l',
                            conversion: 0.0284130625)

      ## Lengths
      UOM.find_or_create_by(name: 'meter',
                            unit: 'm',
                            dimension: 'lengths',
                            is_base_unit: true,
                            base_unit: 'm',
                            conversion: 1)

      UOM.find_or_create_by(name: 'centimeter',
                            unit: 'cm',
                            dimension: 'lengths',
                            is_base_unit: false,
                            base_unit: 'm',
                            conversion: 0.01)

      UOM.find_or_create_by(name: 'millimeter',
                            unit: 'mm',
                            dimension: 'lengths',
                            is_base_unit: false,
                            base_unit: 'l',
                            conversion: 0.0284130625)

      UOM.find_or_create_by(name: 'inch',
                            unit: 'in',
                            dimension: 'lengths',
                            is_base_unit: false,
                            base_unit: 'm',
                            conversion: 0.0254)

      UOM.find_or_create_by(name: 'foot',
                            unit: 'ft',
                            dimension: 'lengths',
                            is_base_unit: false,
                            base_unit: 'm',
                            conversion: 0.3048)

      UOM.find_or_create_by(name: 'yard',
                            unit: 'yd',
                            dimension: 'lengths',
                            is_base_unit: false,
                            base_unit: 'm',
                            conversion: 0.9144)

      nil
    end
  end
end
