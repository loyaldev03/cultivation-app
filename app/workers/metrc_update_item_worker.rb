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

    # Create new Item in Metrc
    create_items_on_metrc(new_items, local_items)

    # Detect changes and update local changes to Metrc
    update_items_on_metrc(new_items, local_items)

    # Update metrc_id to local copy
    update_local_metrc_ids(local_items)

    true
  rescue RestClient::ExceptionWithResponse => e
    pp JSON.parse(e.response.body)
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

  def create_items_on_metrc(new_items, local_items)
    if new_items.any?
      new_items.each do |item_name|
        found = local_items.detect { |i| i.name == item_name }
        if found&.metrc_id.nil?
          # Only create new record when no metrc_id found
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
          found = metrc_items.detect { |i| i['Name'].casecmp(item.name).zero? }
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
        found = metrc_items.detect { |i| i['Name'].casecmp(item.name).zero? }
        if found
          item.metrc_id = found['Id']
          item.metrc_strain_id = found['StrainId']
          item.is_used = found['IsUsed']
          item.save
        end
      end
    end
  end
end
