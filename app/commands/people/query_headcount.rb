module People
  class QueryHeadcount
    prepend SimpleCommand

    def initialize(current_user, args = {})
      @current_user = current_user
      @args = args
    end

    def call
      date = Date.parse("#{@args[:period]}-01-01")
      users = User.where(c_at: (date.beginning_of_year..date.end_of_year)).where(is_active: true).map { |x| x if x.facilities.include?(@args[:facility_id].to_bson_id) }.compact
      bar_colors = ['red', 'blue', 'orange', 'purple', 'yellowgreen', 'mediumvioletred', 'cadetblue', 'dodgerblue', 'sienna', 'palevioletred', 'cornflowerblue']
      json = []

      Common::Role.all.map do |role|
        bar_colors.shuffle
        color_pick = bar_colors.sample
        bar_colors.delete(color_pick)
        user_count = 0
        users.each do |user|
          if user.roles.include?(role.id)
            user_count += 1
          end
        end
        if color_pick == nil
          bar_colors = ['red', 'blue', 'orange', 'purple', 'yellowgreen', 'mediumvioletred', 'cadetblue', 'dodgerblue', 'sienna', 'palevioletred', 'cornflowerblue']
          bar_colors.shuffle
          color_pick = bar_colors.sample
          bar_colors.delete(color_pick)
        end
        if user_count != 0
          json << {
            title: role.name,
            color: color_pick,
            user_count: user_count,
          }
        end
      end
      json
    end
  end
end
