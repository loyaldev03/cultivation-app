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
#   uom = UOM.weight('g')
#   kg_value = uom.to(1500, 'kg')
#   kg == 1.5
#
#   no_match = uom.to(1500, 'm3')
#   no_match == nil
#
# ====================================
# 5. Future enhancement to make it more intuitive
#
#   bag_weight = UOM.weight(5, 'kg')
#   bag_weight_in_gram = bag_weight.to('g')
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
    field :conversion, type: BigDecimal # multiplier to get to base unit
    field :dimension, type: String      # { weight, volume, length, pieces, plants, custom }

    scope :base_unit, -> { where(is_base_unit: true) }

    validates_uniqueness_of :unit

    # TODO: all self.XXX below should be removed.
    def self.custom(unit)
      find_by(dimension: 'custom', unit: unit)
    end

    def self.plants(unit)
      find_by(dimension: 'plants', unit: unit)
    end

    def self.pieces(unit)
      find_by(dimension: 'piece', unit: unit)
    end

    def self.weights(unit)
      find_by(dimension: 'weight', unit: unit)
    end

    def self.volumes(unit)
      find_by(dimension: 'volume', unit: unit)
    end

    def self.lengths(unit)
      find_by(dimension: 'length', unit: unit)
    end

    ###
    # Usage example, convert 5kg to gram:
    #
    # kg_uom = UOM.weight('kg')
    # gram_qty = kg_uom.convert(5, 'g')
    # gram_qty == 5000
    #
    # Given g conversion to kg (base unit) is 0.001, then
    # converting g to kg is:
    # g -> kg = qty x 0.001
    #
    # kg to g is then:
    # kg -> g = qty / 0.001
    def to(quantity, target_unit)
      target_uom = Common::UnitOfMeasure.find_by(unit: target_unit, dimension: self.dimension, base_unit: self.base_unit)
      return nil if target_uom.nil?
      base_qty = conversion * quantity.to_i
      base_qty / target_uom.conversion
    end
  end
end
