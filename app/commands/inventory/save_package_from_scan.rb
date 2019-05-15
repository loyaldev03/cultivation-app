module Inventory
  class SavePackageFromScan
    prepend SimpleCommand

    attr_reader :user,
      :id,
      :product_type,
      :package_type,
      :cultivation_batch_id,
      :tag,
      :product,                 # Deduce from product_type, package type & strain from batch
      :name,                    # Deduce from product_type, package type & strain from batch
      :catalogue,               # Deduce from product_type, package type & strain from batch
      :facility,                # Deduce from cultivation_batch_id
      :cultivation_batch,       # Deduce from cultivation_batch_id
      :facility_strain,         # Deduce from cultivation_batch_id
      :quantity,                # Hardcoded to 1
      :production_date,         # Hardcoded to Time.now
      :harvest_batch,           # Deduce from cultivation_batch_id
      :metrc_tag,               # Deduce from tag
      :name

    def initialize(user, args)
      Rails.logger.debug('>>>>>>>>>>>>>>>')
      Rails.logger.debug(args)
      Rails.logger.debug('>>>>>>>>>>>>>>>')

      @user = user
      @id = args[:id]
      @tag = args[:tag]
      @cultivation_batch_id = args[:cultivation_batch_id]
      @product_type = args[:product_type]
      @package_type = args[:package_type]
    end

    def call
      validate_params!
      prepare!

      if valid_user? && valid_data?
        package = save_package!
        package
      end
    end

    private

    def validate_params!
      raise 'cultivation_batch_id is required' if cultivation_batch_id.nil?
      raise 'product_type is required' if product_type.nil?
      raise 'package_type is required' if package_type.nil?
      raise 'tag is required' if tag.nil?
    end

    def prepare!
      @cultivation_batch = Cultivation::Batch.find(cultivation_batch_id)
      @facility = @cultivation_batch.facility
      @facility_strain = @cultivation_batch.facility_strain
      @name = "#{facility_strain.strain_name} - #{product_type}, #{package_type}"

      @harvest_batch = @cultivation_batch.harvest_batch.first

      @catalogue = Inventory::Catalogue.find_by(label: product_type, category: 'raw_sales_product')
      raise 'No matching catalogue found!' if @catalogue.nil?

      @product = Product.find_or_create_by!(
        facility: @facility,
        facility_strain: facility_strain,
        catalogue: @catalogue,
        name: @name,
      ) do |p|
        p.uom_dimension = catalogue.uom_dimension
        p.common_uom = catalogue.common_uom
      end

      @production_date = Time.now
      @quantity = 1
      @metrc_tag = facility.metrc_tags.find_by(tag: tag)
    end

    def valid_user?
      true
    end

    def valid_data?
      # 1. Check tag is already available
      if metrc_tag.nil?
        errors.add(:package_tag, 'METRC tag not exists')
      elsif metrc_tag.status == 'assigned'
        errors.add(:package_tag, 'METRC tag already assigend')
      elsif metrc_tag.status == 'disposed'
        errors.add(:package_tag, 'METRC tag is already disposed')
      end

      # 3. UOM should not be empty
      errors.add(:uom, 'Unit is required.') if product.common_uom.blank?

      # 4. Has the quota been fulfilled?
      # Check against product plan. Allow only when it is not more than planned.

      errors.empty?
    end

    def save_package!
      if id.blank?
        create_package!
      else
        update_package!
      end
    end

    def create_package!
      ref_type = ref_id = nil   # This to be replaced with package plan

      package = product.packages.create!(
        facility_id: facility.id,
        catalogue_id: catalogue.id,
        package_tag: tag,
        quantity: quantity,
        uom: product.common_uom,
        production_date: production_date,
        event_type: 'create_package',
        event_date: production_date,
        ref_id: ref_id,
        ref_type: ref_type,
        harvest_batch: harvest_batch,
        product_name: name,
      )

      metrc_tag.update!(status: 'assigned')
      package
    end

    def update_package!
      nil
    end
  end
end
