module Inventory
  class ConvertPackageFromScan
    prepend SimpleCommand

    attr_reader :user,
      :id,
      :product_type,
      :package_type,
      :source_package_id,
      :source_package,
      :tag,
      :product,                 # Deduce from product_type, package type & strain from batch
      :name,                    # Deduce from product_type, package type & strain from batch
      :catalogue,               # Deduce from product_type, package type & strain from batch
      :facility,                # Deduce from source package
      :cultivation_batch,       # Deduce from source package
      :facility_strain,         # Deduce from source package
      :quantity,                # Hardcoded to 1
      :production_date,         # Hardcoded to Time.now
      :harvest_batch,           # Deduce from source package
      :metrc_tag,               # Deduce from tag
      :name,
      :task_id,
      :task

    def initialize(user, args)
      @user = user
      @id = args[:id]
      @tag = args[:tag]
      @source_package_id = args[:source_package_id]
      @product_type = args[:product_type]
      @package_type = args[:package_type]
      @task_id = args[:task_id]
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
      raise 'task_id is required' if task_id.nil?
      raise 'source_package_id is required' if source_package_id.nil?
      raise 'product_type is required' if product_type.nil?
      raise 'package_type is required' if package_type.nil?
      raise 'tag is required' if tag.nil?
    end

    def prepare!
      @task = Cultivation::Task.find(task_id)
      @source_package = Inventory::ItemTransaction.find(source_package_id)
      @facility = @source_package.facility
      @facility_strain = @source_package.facility_strain
      @name = "#{facility_strain.strain_name} - #{product_type}, #{package_type}"
      @harvest_batch = @source_package.harvest_batch

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
        raise 'Not implemented'
      end
    end

    def create_package!
      package = product.packages.create!(
        facility_id: facility.id,
        catalogue_id: catalogue.id,
        package_tag: tag,
        quantity: quantity,
        uom: product.common_uom,
        production_date: production_date,
        event_type: 'convert_package_from_scan',
        event_date: production_date,
        ref_id: source_package_id,
        ref_type: 'Inventory::ItemTransaction',
        harvest_batch: harvest_batch,
        product_name: name,
        facility_strain: facility_strain,
      )

      deduction = source_package.dup
      deduction.quantity -= package.quantity
      deduction.uom = package.uom
      deduction.event_type = 'deduction_of_convert_package_from_scan'
      deduction.event_date = Time.now
      deduction.ref_id = deduction.id
      deduction.ref_type = 'Inventory::ItemTransaction'
      deduction.save!

      metrc_tag.update!(status: 'assigned')
      package
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

    # TASK 980
    def calculate_cost(package)
      # Assuming we converted 50g then we need to:
      #   1. find out total cost to complete the task. Then divide equally to all product created by the task, which is X
      #   2. Then get the cost of the used fraction from the source product, Y
      #
      x = task.actual_cost / package.common_quantity
      y = source_package.production_cost / source_package.common_quantity
      production_cost = (x + y) * package.common_quantity
      package.production_cost = production_cost
      package.save!
    end
  end
end
