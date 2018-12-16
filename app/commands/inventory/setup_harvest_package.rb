module Inventory
  class SetupHarvestPackage
    prepend SimpleCommand
    attr_reader :user,
      :product_id,
      :name,
      :sku,
      :catalogue_id,
      :facility_strain_id,
      :facility_strain,
      :facility_id,
      :id,
      :package_tag,
      :quantity,
      :uom,
      :production_date,
      :expiration_date,
      :location_id,
      :harvest_batch_id,
      :other_harvest_batch,
      :drawdown_quantity,
      :drawdown_uom,
      :cost_per_unit,
      :transaction_limit

    def initialize(user, args)
      @user = user
      @product_id = args[:product_id]
      @name = args[:name]
      @sku = args[:sku]
      @catalogue_id = args[:catalogue_id]

      @facility_strain_id = args[:facility_strain_id]
      @facility_strain = Inventory::FacilityStrain.find(facility_strain_id)
      @facility_id = facility_strain.facility_id

      @id = args[:id]
      @package_tag = args[:package_tag]
      @quantity = args[:quantity]
      @uom = args[:uom]
      @production_date = args[:production_date]
      @expiration_date = args[:expiration_date]
      @location_id = args[:location_id]
      @harvest_batch_id = args[:harvest_batch_id]
      @other_harvest_batch = args[:other_harvest_batch]
      @drawdown_quantity = args[:drawdown_quantity]
      @drawdown_uom = args[:drawdown_uom]
      @cost_per_unit = args[:cost_per_unit]
      @transaction_limit = args[:transaction_limit]
    end

    def call
      if valid_user? && valid_data?
        product = save_product!
        package = save_package!(product)
        package
      end
    end

    def valid_user?
      true
    end

    def valid_data?
      tx = Inventory::ItemTransaction.find_by(package_tag: package_tag)
      if tx.nil? || tx.id != id
        # no problem
      end

      errors.empty?
    end

    # Product should not be editable from setup procedure as it can inadvertently
    # affect too many packages (ItemTransaction). User has to be very clear on
    # the impact before making the change.
    def save_product!
      product = nil
      if product_id.blank?
        product = Inventory::Product.new
        product.name = name
        product.sku = sku
        product.catalogue_id = catalogue_id
        product.facility_strain_id = facility_strain_id
        product.facility_id = facility_id
        product.transaction_limit = transaction_limit
        product.status = 'available'
        product.save!
      else
        product = Inventory::Product.find(product_id)
      end

      product
    end

    def save_package!(product)
      package = nil
      if id.blank?
        package = product.packages.build(
          facility_id: facility_id,
          facility_strain_id: facility_strain_id,
          catalogue_id: catalogue_id,
        )
      else
        package = product.packages.find(id)
      end

      package.package_tag = package_tag
      package.quantity = quantity
      package.uom = uom
      package.production_date = production_date
      package.expiration_date = expiration_date
      package.location_id = location_id
      package.harvest_batch_id = harvest_batch_id
      package.other_harvest_batch = other_harvest_batch
      package.drawdown_quantity = drawdown_quantity
      package.drawdown_uom = drawdown_uom
      package.cost_per_unit = cost_per_unit
      package.ref_id = harvest_batch_id
      package.ref_type = 'Inventory::HarvestBatch'
      package.save!
      package
    end
  end
end
