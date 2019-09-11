module People
  class QueryUserBySkill
    prepend SimpleCommand

    def initialize(current_user, args = {})
      @current_user = current_user
      @args = args
    end

    def call
      skills = ['Packaging', 'Gardening', 'Trimming', 'Managing', 'Accounting', 'Multitasking', 'Management', 'Budgeting']
      f_ids = @args[:facility_id].split(',').map { |x| x.to_bson_id }
      users = User.in(facilities: f_ids)
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
