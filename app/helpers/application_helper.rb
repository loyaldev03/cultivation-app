module ApplicationHelper
  def blank(val)
    val.blank? ? '- empty -' : val
  end

  def breadcrumbs(*paths)
    paths.map do |pair|
      if pair.length == 2
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

  def flash_css_class(msg_type)
    case msg_type
    when 'notice' then 'subtitle-2 ph3 pv2 mb2 bg-orange white tc'
    when 'success' then 'subtitle-2 ph3 pv2 mb2 bg-green white tc'
    when 'error' then 'subtitle-2 ph3 pv2 mb2 bg-yellow tc'
    when 'alert' then 'subtitle-2 ph3 pv2 mb2 bg-yellow tc'
    end
  end

  def flash_messages(opts = {})
    flash.each do |msg_type, message|
      concat(content_tag(:div, message, class: flash_css_class(msg_type)) do
        concat message
      end)
    end
    nil
  end

  def onboarding_tasks
    [
      {label: 'Review and confirm general company settings', desc: 'Time zone, unit of measurements, and other thing like that are set here', code: 'Constant::ONBOARDING_COMP_INFO', link: '/settings/company/company_info/my-company/edit?'},
      {label: 'Setup Grow Method', desc: 'Lorem ipsum dolor sit amet, vel te ceteros luptatum atomorum', code: 'Constant::ONBOARDING_GROW_METHOD', link: '/settings/core/grow_methods?'},
      {label: 'Setup Grow phases', desc: 'Lorem ipsum dolor sit amet, vel te ceteros luptatum atomorum', code: 'Constant::ONBOARDING_COMP_PHASES', link: '/settings/core/grow_phases?'},
      {label: 'Review and add unit of masurement', desc: 'Lorem ipsum dolor sit amet, vel te ceteros luptatum atomorum', code: 'Constant::ONBOARDING_UOM', link: '/settings/core/unit_of_measures?'},
      {label: 'Set Raw Materials Type', desc: 'Lorem ipsum dolor sit amet, vel te ceteros luptatum atomorum', code: 'Constant::ONBOARDING_MATERIAL_TYPE', link: '/settings/core/raw_materials?'},
      {label: 'Invite your teammates', desc: 'Lorem ipsum dolor sit amet, vel te ceteros luptatum atomorum', code: 'Constant::ONBOARDING_INVITE_TEAM', link: '/settings/company/team?'},
      {label: 'Setup facilities, rooms and shelves for proper planting', desc: 'Lorem ipsum dolor sit amet, vel te ceteros luptatum atomorum', code: 'Constant::ONBOARDING_FACILITY', link: "/facility_setup/new?facility_id=#{@facility.id}&&"},
      {label: 'Active plants', desc: 'Lorem ipsum dolor sit amet, vel te ceteros luptatum atomorum', code: 'Constant::ONBOARDING_ACTIVE_PLANTS', link: "/inventory/plants/mothers?facility_id=#{@facility.id}&&"},
      {label: 'Packages inventory', desc: 'Lorem ipsum dolor sit amet, vel te ceteros luptatum atomorum', code: 'Constant::ONBOARDING_PACKAGE_INVENTORY', link: "/inventory/sales_products/products?facility_id=#{@facility.id}&&"},
      {label: 'Add raw materials', desc: 'Lorem ipsum dolor sit amet, vel te ceteros luptatum atomorum', code: 'Constant::ONBOARDING_RAW_MATERIALS', link: "/inventory/raw_materials/nutrients?facility_id=#{@facility.id}&&"},
      {label: 'Other inventory', desc: 'Lorem ipsum dolor sit amet, vel te ceteros luptatum atomorum', code: 'Constant::ONBOARDING_OTHER_MATERIALS', link: "/inventory/raw_materials/others?facility_id=#{@facility.id}&&"},
      {label: 'Setup batches', desc: 'Lorem ipsum dolor sit amet, vel te ceteros luptatum atomorum', code: 'Constant::ONBOARDING_SETUP_BATCH', link: "/cultivation/batches/new?facility_id=#{@facility.id}&&"},
    ]
  end
end
