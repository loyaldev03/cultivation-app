module Inventory
  class SetupConvertedProduct
    prepend SimpleCommand

    attr_reader :user,
      :id,
      :product_id,
      :name,
      :sku,
      :catalogue_id,
      :facility_id,
      :package_tags,
      :quantity,
      :uom,
      :production_date,
      :expiration_date,
      :location_id,
      :cost_per_unit,
      :transaction_limit,
      :breakdowns

    def initialize(user, args)
      @user = user
      @id = args[:id]
      @product_id = args[:product_id]
      @name = args[:name]
      @sku = args[:sku]
      @catalogue_id = args[:catalogue_id]
      @facility_id = args[:facility_id]
      @package_tags = args[:package_tags]
      @quantity = args[:quantity]
      @uom = args[:uom]
      @production_date = args[:production_date]
      @expiration_date = args[:expiration_date]
      @location_id = args[:location_id]
      @cost_per_unit = args[:cost_per_unit]
      @transaction_limit = args[:transaction_limit]
      @breakdowns = args[:breakdowns]
    end

    def call
      if valid_user? && valid_data?
        product = save_product!
        packages = save_packages!(product)
        packages
      end
    end

    private

    def valid_user?
      true
    end

    def valid_data?
      # 1. Check package id is not duplicate unless its an update
      tags = split(package_tags)

      if tags.blank?
        errors.add(:package_tag, 'Tag is required.')
      else
        tags.each do |tag|
          if Inventory::ItemTransaction.in(catalogue_id: catalogue_ids).
            where(package_tag: tag, id: {:$not => {:$eq => id}}).exists?
            errors.add(:package_tags, 'Tag is already taken.')
            next
          end
        end
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
        errors.add(:facility_id, 'Facility is required') if facility_id.blank?
      end

      errors.add(:location_id, 'Stored location is required') if location_id.blank?
      true
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
        product.facility_id = facility_id
        product.transaction_limit = transaction_limit
        product.status = 'available'
        product.save!
      else
        product = Inventory::Product.find(product_id)
      end

      product
    end

    def save_packages!(product)
      if id.blank?
        packages = create_packages!(product)
      else
        packages = update_package!(product)
      end
    end

    def create_packages!(product)
      tags = split(package_tags)
      packages = []
      tags.each do |tag|
        package = product.packages.create!(
          facility_id: facility_id,
          catalogue_id: catalogue_id,
          package_tag: tag,
          quantity: quantity,
          uom: uom,
          production_date: production_date,
          expiration_date: expiration_date,
          location_id: location_id,
          cost_per_unit: cost_per_unit,
          event_type: 'create_converted_product',
          breakdowns: breakdowns,
        )
        packages << package
      end
      packages
    end

    def update_package!(product)
      package = Inventory::ItemTransaction.find(id)
      package.product_id = product.id
      package.facility_id = facility_id
      package.catalogue_id = catalogue_id
      package.package_tag = package_tags.strip
      package.quantity = quantity
      package.uom = uom
      package.production_date = production_date
      package.expiration_date = expiration_date
      package.location_id = location_id
      package.cost_per_unit = cost_per_unit
      package.breakdowns = breakdowns
      package.save!
      [package]
    end

    def catalogue_ids
      Inventory::Catalogue.where(catalogue_type: Constants::SALES_KEY, category: Constants::CONVERTED_PRODUCT_KEY).map { |x| x.id.to_s }
    end

    def split(tags)
      tags.gsub(/[\n\r]/, ',').split(',').reject { |x| x.empty? }.map(&:strip)
    end
  end
end
