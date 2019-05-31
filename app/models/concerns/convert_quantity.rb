module ConvertQuantity
  extend ActiveSupport::Concern

  included do
    before_save -> { calculate_common_value }
  end

  def calculate_common_value
    Rails.logger.debug "\t\t\t>>>>> uom: #{uom}, catalogue: #{catalogue.common_uom}"
    temp_uom = Common::UnitOfMeasure.find_by(unit: uom)
    self.common_uom = catalogue.common_uom
    self.common_quantity = temp_uom.to(quantity, catalogue.common_uom) #convert quantity to common uom in catalogue
  end
end
