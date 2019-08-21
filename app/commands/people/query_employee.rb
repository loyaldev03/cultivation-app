module People
  class QueryEmployee
    prepend SimpleCommand

    def initialize(current_user, args = {})
      @current_user = current_user
      @args = args
    end

    def call
      #try using aggregate. Refer to query_metrc.rb because we need metadata included in the json
      json_array = {
        data: [
          {
            role_name: 'Gardener',
            total_workers: '10',
            user: 'Steven Alexander',
            photo_url: 'https://cdn.business2community.com/wp-content/uploads/2017/08/blank-profile-picture-973460_640.png',
            ontime_arrival_data: 64,
            task_on_time_data: 100,
            capacity_hours: 40,
            absents: 2,
            ot_hours: 5,
            reported_to: 'Gilbert Hawkins',
          },
          {
            role_name: 'Gardener',
            total_workers: '10',
            user: 'Maria Alexander',
            photo_url: 'https://cdn.business2community.com/wp-content/uploads/2017/08/blank-profile-picture-973460_640.png',
            ontime_arrival_data: 64,
            task_on_time_data: 100,
            capacity_hours: 40,
            absents: 2,
            ot_hours: 5,
            reported_to: 'Gilbert Hawkins',
          },
          {
            role_name: 'Finance',
            total_workers: '2',
            user: 'Steven Alexander',
            photo_url: 'https://cdn.business2community.com/wp-content/uploads/2017/08/blank-profile-picture-973460_640.png',
            ontime_arrival_data: 64,
            task_on_time_data: 100,
            capacity_hours: 40,
            absents: 2,
            ot_hours: 5,
            reported_to: 'Gilbert Hawkins',
          },
          {
            role_name: 'Trimmer',
            total_workers: '2',
            user: 'Gabs Alexander',
            photo_url: 'https://cdn.business2community.com/wp-content/uploads/2017/08/blank-profile-picture-973460_640.png',
            ontime_arrival_data: 64,
            task_on_time_data: 100,
            capacity_hours: 40,
            absents: 2,
            ot_hours: 5,
            reported_to: 'Gilbert Hawkins',
          },
        ],
        "metadata": {
          "total": 1500,
          "page": 0,
          "pages": 75,
          "skip": 0,
          "limit": 20,
        },

      }

      json_array
    end

    def match_search
      if !args[:search].blank?
        {"$match": {"name": Regexp.new(args[:search], Regexp::IGNORECASE)}}
      else
        {"$match": {}}
      end
    end
  end
end
