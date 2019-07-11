class MetrcUpdateItemWorker
  include Sidekiq::Worker
  sidekiq_options queue: 'low'

  def perform(facility_id)
    @facility_id = facility_id

    # Overview of the logic flow
    # Get Items from api (1)
    # Get Items from db (2)
    # When found new Items in (2)
    #   call create Item api
    # When found existing item from db in Api
    #   call update Item api

    new_items = get_new_items(metrc_items, local_items)

    # Delee locally deleted items from Metrc
    delete_items_on_metrc(local_items)

    # Create new Item in Metrc
    create_items_on_metrc(new_items, local_items)

    # Detect changes and update local changes to Metrc
    update_items_on_metrc(new_items, local_items)

    # Update metrc_id to local copy
    update_local_metrc_ids(local_items)

    true
  rescue RestClient::ExceptionWithResponse => e
    logger.debug e
    logger.error JSON.parse(e.response.body)
    raise
  end

  private

  def facility
    @facility ||= Facility.find(@facility_id)
  end

  def local_items
    @local_items ||= facility.items.to_a
  end

  def metrc_items
    @metrc_items ||= MetrcApi.get_items(facility.site_license)
  end

  def get_new_items(metrc_items, local_items)
    metrc_items_name = metrc_items.map { |s| s['Name'].downcase }
    new_items = []
    local_items.each do |item|
      if !metrc_items_name.include?(item.name.downcase)
        # clear metrc_id if item not found on metrc_items (possibly being deleted)
        item.metrc_id = nil
        item.metrc_strain_id = nil
        item.save
        # remember the new item that exists in db
        new_items << item.name
      end
    end
    new_items
  end

  def delete_items_on_metrc(local_items)
    if local_items.any?
      local_items.each do |item|
        # If item is mark as deleted, delete it from Metrc
        if item.metrc_id && item.deleted
          call_delete_item(item)
          item.delete
          # item.destroy
        end
      end
    end
  end

  def call_delete_item(item)
    MetrcApi.delete_items(facility.site_license, item.metrc_id)
    item.metrc_id = nil
  rescue RestClient::ExceptionWithResponse => e
    item.metrc_id = nil
    logger.error 'error while deleting from metrc'
    logger.error JSON.parse(e.response.body)
  end

  def create_items_on_metrc(new_items, local_items)
    if new_items.any?
      new_items.each do |item_name|
        found = local_items.detect { |i| i.name == item_name }
        # Only create new Metrc Item if metrc_id found (have not create in Metrc)
        # and not mark as deleted
        if found&.metrc_id.nil? && !found&.deleted
          params = {
            "Name": found.name,
            "ItemCategory": found.product_category_name,
            "UnitOfMeasure": found.uom_name,
            "Strain": found.strain_name,
            "UnitVolume": found.unit_volume,
            "UnitVolumeUnitOfMeasure": found.unit_volume_uom_name,
            "UnitWeight": found.unit_weight,
            "UnitWeightUnitOfMeasure": found.unit_weight_uom_name,
            "ServingSize": found.serving_size,
            "Ingredients": found.ingredients,
          }
          MetrcApi.create_items(facility.site_license, [params])
        end
      end
    end
  end

  def update_items_on_metrc(metrc_items, local_items)
    if local_items.any?
      local_items.each do |item|
        if item.metrc_id
          found = metrc_items.detect do |i|
            if i['Name'].blank?
              false
            else
              i['Name'].casecmp(item.name).zero?
            end
          end
          if found && found['Name'] != item.name
            # Only call update when metrc_id exists and
            # item name not same (case sensitive)
            params = {
              "Id": item.metrc_id,
              "Name": item.name,
              "ItemCategory": item.product_category_name,
              "UnitOfMeasure": item.uom_name,
              "Strain": item.strain_name,
              "UnitVolume": item.unit_volume,
              "UnitVolumeUnitOfMeasure": item.unit_volume_uom_name,
              "UnitWeight": item.unit_weight,
              "UnitWeightUnitOfMeasure": item.unit_weight_uom_name,
              "ServingSize": item.serving_size,
              "Ingredients": item.ingredients,
            }
            MetrcApi.update_items(site_license, [params])
          end
        end
      end
    end
  end

  def update_local_metrc_ids(local_items)
    metrc_items = MetrcApi.get_items(facility.site_license) # Hash format
    if local_items.any?
      local_items.each do |item|
        found = metrc_items.detect do |i|
          if i['Name'].blank?
            false
          else
            i['Name'].casecmp(item.name).zero?
          end
        end
        if found
          item.metrc_id = found['Id']
          item.metrc_strain_id = found['StrainId']
          item.product_category_name = found['ProductCategoryName']
          item.product_category_type = found['ProductCategoryType']
          item.quantity_type = found['QuantityType']
          item.uom_name = found['UnitOfMeasureName']
          item.approval_status = found['ApprovalStatus']
          item.strain_name = found['StrainName']
          item.unit_volume = found['UnitVolume']
          item.unit_volume_uom_name = found['UnitVolumeUnitOfMeasureName']
          item.unit_weight = found['UnitWeight']
          item.unit_weight_uom_name = found['UnitWeightUnitOfMeasureName']
          item.is_used = found['IsUsed']
          item.save
        end
      end
    end
  end
end
