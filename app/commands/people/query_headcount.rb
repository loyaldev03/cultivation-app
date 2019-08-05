module People
  class QueryHeadcount
    prepend SimpleCommand

    def initialize(current_user, args = {})
      @current_user = current_user
      @args = args
    end

    def call
      user = User.where(is_active: true).map { |x| x if x.facilities.include?(@args[:facility_id].to_bson_id) }.compact
      bar_colors = ['red', 'blue', 'orange', 'purple', 'yellowgreen', 'mediumvioletred', 'cadetblue', 'dodgerblue', 'sienna', 'palevioletred', 'cornflowerblue']

      user_by_group = user.group_by(&:title)
      headcount_json = user_by_group.map do |a, b|
        bar_colors.shuffle
        color_pick = bar_colors.sample
        bar_colors.delete(color_pick)
        {
          title: a,
          value: b.count,
          color: color_pick,
        }
      end

      headcount_json
    end
  end
end
