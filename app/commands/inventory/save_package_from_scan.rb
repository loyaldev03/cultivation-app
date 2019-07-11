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
      :name,
      :task_id                  # TODO: need this to find PackagePlan!!!

    def initialize(user, args)
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
        calculate_cost(package)
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

      size, uom = find_size_uom_from_package_type(package_type)
      raise 'No size found for package type' if size.nil?
      raise 'No UOM found for package type' if uom.nil?

      @product = Inventory::Product.find_or_create_by!(
        facility: @facility,
        facility_strain: facility_strain,
        catalogue: @catalogue,
        name: @name,
        package_type: package_type,
      ) do |p|
        p.uom_dimension = catalogue.uom_dimension
        p.common_uom = uom
        p.size = size
      end

      @metrc_tag = facility.metrc_tags.find_by(tag: tag, tag_type: 'package')
      @production_date = Time.now
      @quantity = size
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
        event_type: 'create_package_from_scan',
        event_date: production_date,
        ref_id: ref_id,
        ref_type: ref_type,
        harvest_batch: harvest_batch,
        product_name: name,
        facility_strain: facility_strain,
        common_uom: harvest_batch.uom,
      )

      metrc_tag.update!(status: 'assigned')
      package
    end

    def update_package!
      nil
    end

    def find_size_uom_from_package_type(package_type)
      case package_type.upcase
      when '1/2 GRAM'
        return 0.5, 'g'
      when '1/2 KG'
        return 0.5, 'kg'
      when '1/4 LB'
        return 0.25, 'lb'
      when '1/4 OZ'
        return 0.25, 'oz'
      when 'EIGTH'
        return 0.125, 'oz'
      when 'GRAM'
        return 1, 'g'
      when '1/2 OZ'
        return 0.5, 'oz'
      when 'LB'
        return 1, 'lb'
      when 'OUNCE'
        return 1, 'oz'
      else
        return nil
      end
    end

    def calculate_cost(package)
      cost_per_unit = harvest_batch.cultivation_batch.output_cost_per_unit

      # TODO: Calculation over here is not really correct.
      # I should calculate cost at end of the day after all logged hours are completed.
      # Only then divide the final hours spent to all produced packages.
      package.production_cost = package.common_quantity * cost_per_unit
      package.save!
    end
  end
end
