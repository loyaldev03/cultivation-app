module People
  class QueryUserBySkill
    prepend SimpleCommand

    def initialize(current_user, args = {})
      @current_user = current_user
      @args = args
    end

    def call
      skills = ['Packaging', 'Gardening', 'Trimming', 'Managing', 'Accounting', 'Multitasking', 'Management', 'Budgeting']

      users = User.where(facilities: @args[:facility_id].to_bson_id)
      json_array = []

      skills.each do |s|
        count_user = users.where(skills: s).count
        json_array << {
          name: s,
          value: count_user,
        }
      end

      {children: json_array}
    end
  end
end
