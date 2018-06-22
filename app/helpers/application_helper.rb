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
end
