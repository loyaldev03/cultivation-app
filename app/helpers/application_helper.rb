module ApplicationHelper
  def blank(val)
    val.blank? ? '- empty -' : val
  end

  def breadcrumbs(*paths)
    paths.map do |pair|
      if pair.is_a? Array and pair.length == 2
        link_to pair[0], pair[1], class: 'link subtitle-2 orange'
      elsif pair.is_a? String
        content_tag :span, pair, class: 'subtitle-2 grey'
      else
        content_tag :span, pair, class: 'subtitle-2 grey'
      end
    end.join(
      content_tag :i, 'keyboard_arrow_right', class: 'material-icons md-600 md-gray md-17 ph2'

    ).html_safe
  end

  def active_link(path)
    if path == 'plant'
      paths = [mothers_inventory_plants_path, cultivation_batches_inventory_plants_path, clones_inventory_plants_path, vegs_inventory_plants_path, flowers_inventory_plants_path, harvests_inventory_plants_path, harvest_batches_inventory_plants_path, seeds_inventory_plants_path, purchased_clones_inventory_plants_path]
      if paths.include?(request.path)
        'active'
      else
        'grey'
      end
    elsif path == 'raw_material'
      paths = [nutrients_inventory_raw_materials_path, grow_medium_inventory_raw_materials_path, grow_lights_inventory_raw_materials_path, supplements_inventory_raw_materials_path, others_inventory_raw_materials_path]
      if paths.include?(request.path)
        'active'
      else
        'grey'
      end
    elsif current_page?(path)
      'active'
    else
      'grey'
    end
  end

  def parent_active_link(parent)
    case parent
    when 'cultivation'
      paths = [dashboard_cultivation_batches_path, cult_batches_path, cult_plants_path, cult_harvests_path, cult_tasks_path, cult_issues_path, cult_destroyed_plants_path, cult_wastes_path]
    when 'inventory'
      paths = [inventory_strains_path, mothers_inventory_plants_path, nutrients_inventory_raw_materials_path, products_inventory_sales_products_path, inventory_metrc_index_path, convert_products_inventory_sales_products_path]
      plant_paths = [mothers_inventory_plants_path, cultivation_batches_inventory_plants_path, clones_inventory_plants_path, vegs_inventory_plants_path, flowers_inventory_plants_path, harvests_inventory_plants_path, harvest_batches_inventory_plants_path, seeds_inventory_plants_path, purchased_clones_inventory_plants_path]
      raw_material_path = [nutrients_inventory_raw_materials_path, grow_medium_inventory_raw_materials_path, grow_lights_inventory_raw_materials_path, supplements_inventory_raw_materials_path, others_inventory_raw_materials_path]
      paths = paths + plant_paths + raw_material_path
    when 'people'
      paths = [employees_dashboard_path, employees_path, employees_schedule_path, timesheets_path, requests_path]
    when 'procurement'
      paths = [procurement_path]
    when 'facility'
      paths = [facility_dashboard_path, facility_setup_new_path, facility_dashboard_summary_path, facility_dashboard_summary_path, facility_setup_rooms_info_path, facility_setup_room_summary_path, facility_setup_row_shelf_info_path]
    when 'integration'
      paths = [integration_path, metrc_setup_settings_company_metrc_integrations_path]
    when 'product'
      paths = [prod_dashboard_path, prod_packages_path, prod_sold_path, prod_unsold_path, prod_orders_path, prod_manifest_path]
    else
      paths = []
    end

    if paths.include?(request.path)
      'parent-active'
    else
      'grey'
    end
  end

  def onboarding_tasks
    [
      {label: 'Review and confirm general company settings', desc: 'Time zone, unit of measurements, and other thing like that are set here', code: 'ONBOARDING_COMP_INFO', link: '/settings/company/company_info/my-company/edit?'},
      {label: 'Setup Grow Method', desc: 'Lorem ipsum dolor sit amet, vel te ceteros luptatum atomorum', code: 'ONBOARDING_GROW_METHOD', link: '/settings/core/grow_methods?'},
      {label: 'Setup Grow phases', desc: 'Lorem ipsum dolor sit amet, vel te ceteros luptatum atomorum', code: 'ONBOARDING_COMP_PHASES', link: '/settings/core/grow_phases?'},
      {label: 'Review and add unit of masurement', desc: 'Lorem ipsum dolor sit amet, vel te ceteros luptatum atomorum', code: 'ONBOARDING_UOM', link: '/settings/core/unit_of_measures?'},
      {label: 'Set Raw Materials Type', desc: 'Lorem ipsum dolor sit amet, vel te ceteros luptatum atomorum', code: 'ONBOARDING_MATERIAL_TYPE', link: '/settings/core/raw_materials?'},
      {label: 'Invite your teammates', desc: 'Lorem ipsum dolor sit amet, vel te ceteros luptatum atomorum', code: 'ONBOARDING_INVITE_TEAM', link: '/settings/company/team?'},
      {label: 'Setup facilities, rooms and shelves for proper planting', desc: 'Lorem ipsum dolor sit amet, vel te ceteros luptatum atomorum', code: 'ONBOARDING_FACILITY', link: '/facility_setup/new?'},
      {label: 'Active plants', desc: 'Lorem ipsum dolor sit amet, vel te ceteros luptatum atomorum', code: 'ONBOARDING_ACTIVE_PLANTS', link: '/inventory/plants/mothers?'},
      {label: 'Packages inventory', desc: 'Lorem ipsum dolor sit amet, vel te ceteros luptatum atomorum', code: 'ONBOARDING_PACKAGE_INVENTORY', link: '/inventory/sales_products/products?'},
      {label: 'Add raw materials', desc: 'Lorem ipsum dolor sit amet, vel te ceteros luptatum atomorum', code: 'ONBOARDING_RAW_MATERIALS', link: '/inventory/raw_materials/nutrients?'},
      {label: 'Other inventory', desc: 'Lorem ipsum dolor sit amet, vel te ceteros luptatum atomorum', code: 'ONBOARDING_OTHER_MATERIALS', link: '/inventory/raw_materials/others?'},
      {label: 'Setup batches', desc: 'Lorem ipsum dolor sit amet, vel te ceteros luptatum atomorum', code: 'ONBOARDING_SETUP_BATCH', link: '/cultivation/batches/new?'},
    ]
  end
end
