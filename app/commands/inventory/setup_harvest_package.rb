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
      @facility_id = facility_strain.present? ? facility_strain.facility_id : nil

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

      # 1. Check package id is not duplicate unless its an update
      if package_tag.blank?
        errors.add(:package_tag, 'Tag is required.')
      else
        errors.add(:package_tag, 'Tag is already taken.') if Inventory::ItemTransaction.
          in(catalogue_id: sales_catalogue_ids).
          where(package_tag: package_tag, id: {:$not => {:$eq => id}}).
          exists?
      end

      # 2. Quantity should be > 0
      errors.add(:quantity, 'Quantity must be more than zero.') if quantity.to_f <= 0

      # 3. UOM should not be empty
      errors.add(:uom, 'Unit is required.') if uom.blank?

      # 4. Cost should be > 0
      errors.add(:cost_per_unit, 'Cost must be more than zero.') if cost_per_unit.to_f <= 0

      # 5. production date < expiration date
      if production_date.blank?
        errors.add(:production_date, 'Production date is required.') if production_date.blank?
      end

      if expiration_date.blank?
        errors.add(:expiration_date, 'Expiration date is required.') if expiration_date.blank?
      end

      if !expiration_date.blank? && !production_date.blank?
        errors.add(:expiration_date, 'Expiration date should be after production date.') if expiration_date.to_date <= production_date.to_date
      end

      # 6. if product is new,  product name, catalogue, strain should exist
      if product_id.blank?
        errors.add(:name, 'Product name is required') if name.blank?
        errors.add(:catalogue_id, 'Product type is required') if catalogue_id.blank?
        errors.add(:facility_strain_id, 'Strain is required') if facility_strain_id.blank?
      end

      # 8. location should not be empty
      errors.add(:location_id, 'Stored location is required') if location_id.blank?

      # 9. if there is harvest, qty used and uom should not be empty.
      if !harvest_batch_id.blank? || !other_harvest_batch.blank?
        errors.add(:drawdown_quantity, 'Quantity is required') if drawdown_quantity.to_f <= 0
        errors.add(:drawdown_uom, 'Unit is required') if drawdown_uom.blank?
      end

      errors.empty?
    end

    def sales_catalogue_ids
      Inventory::QueryCatalogueTree.call(Constants::SALES_KEY, 'raw_sales_product').result.pluck(:value)
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
      package.event_type = 'create_package'
      package.save!
      package
    end
  end
end
