module ApplicationHelper
  def blank(val)
    val.blank? ? '- empty -' : val
  end

  def breadcrumbs(*paths)
    paths.map do |pair|
      if pair.length == 2
        link_to pair[0], pair[1], class: 'blue link'
      elsif pair.is_a? String
        pair
      else
        pair[0]
      end
    end.join(
      content_tag :span, '>', class: 'ph2'
    ).html_safe
  end

  def flash_css_class(msg_type)
    case msg_type
    when 'notice' then 'ma3 ph3 pv2 mb2 bg-blue white tc'
    when 'success' then 'ma3 ph3 pv2 mb2 bg-green white tc'
    when 'error' then 'ma3 ph3 pv2 mb2 bg-yellow tc'
    when 'alert' then 'ma3 ph3 pv2 mb2 bg-yellow tc'
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
