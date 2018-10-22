######################################
# Example how to use this
# ====================================
#
# 1. Set up base unit
# name: 'kilogrammes', code: 'kg', base_unit: true, base_uom: 'kg', conversion: '1', dimension: 'weight'
#
# 2. Setup possible conversions
#   name: 'gram',       code: 'g',  base_unit: false, base_uom: 'kg', conversion: 0.001, dimension: 'weight'
#   name: 'milligram',  code: 'mg', base_unit: false, base_uom: 'kg', conversion: 0.000001, dimension: 'weight'
#   name: 'ton',        code: 'MT', base_unit: false, base_uom: 'kg', conversion: 1000, dimension: 'weight'
#
# ====================================
# 3. Method to perform conversion
#
#   def to(unit, value)
#     step 1 - convert to base
#     step 2 - base to new target
#     return nil if conversion not found
#   end
#
# ====================================
# 4. Using the conversion method. Example: Convert "1500 g" to kg
#
# uom = UOM.find_by(code: 'g', dimension: 'weight')
# kg_value = uom.to('kg', 1500)
# kg == 1.5
#
# no_match = uom.to('m3')
# no_match == nil
#
# converted = UOM.convert(100, 'g', 'kg')
# converted == 0.1
#
#######################################

module Common
  class UnitOfMeasure
    include Mongoid::Document
    include Mongoid::Timestamps::Short

    field :name, type: String
    field :unit, type: String
    field :desc, type: String
    field :is_base_unit, type: Boolean, default: false
    field :base_unit, type: String
    field :conversion, type: BigDecimal
    field :dimension, type: String      # { weights, volumes, lengths, pieces, custom }

    scope :base_unit, -> { where(base_unit: true) }

    # TODO: validate combo is unique
    # unit, base_unit, dimension must be unique

    def self.custom(unit)
      find_by(dimension: 'custom', unit: unit)
    end

    def self.pieces(unit)
      find_by(dimension: 'pieces', unit: unit)
    end

    def self.weights(unit)
      find_by(dimension: 'weights', unit: unit)
    end

    def self.volumes(unit)
      find_by(dimension: 'volumes', unit: unit)
    end

    def to(quantity, target_unit)
      _base_uom = UOM.find_by(unit: self.base_unit, dimension: self.dimension, is_base_unit: true)
      _target_uom = UOM.find_by(unit: target_unit, dimension: self.dimension, is_base_unit: true, base_unit: self.base_unit)

      return nil if _base_uom.nil? || _target_uom.nil?

      _base_qty = _base_uom.conversion * quantity
      _target_qty = _target_uom.conversion * _base_qty
      _target_qty
    end
  end
end
