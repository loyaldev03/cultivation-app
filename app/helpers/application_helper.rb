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
    when 'notice' then 'f7 ph3 pv2 mb2 bg-blue white tc'
    when 'success' then 'f7 ph3 pv2 mb2 bg-green white tc'
    when 'error' then 'f7 ph3 pv2 mb2 bg-yellow tc'
    when 'alert' then 'f7 ph3 pv2 mb2 bg-yellow tc'
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
end
