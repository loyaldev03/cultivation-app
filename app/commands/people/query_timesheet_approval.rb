module People
  class QueryTimesheetApproval
    prepend SimpleCommand

    def initialize(current_user, args = {})
      @current_user = current_user
      @args = args
    end

    def call
      json = {
        data: [
          {
            worker_name: 'Bobby Curry',
            roles: 'Gardener, Trimmer',
            photo_url: '',
            total_hours: 29,
            total_ot: 10,
            approver: 'Christian Morgan',
            Status: 'Open',
          },
          {
            worker_name: 'Fannie Snyder',
            roles: 'Trimmer',
            photo_url: '',
            total_hours: 75,
            total_ot: 11,
            approver: 'Eula McDonald',
            Status: 'Submitted',
          },
          {
            worker_name: 'Corey Wong',
            roles: 'Gardener',
            photo_url: '',
            total_hours: 28,
            total_ot: 11,
            approver: 'Jesse Sullivan',
            Status: 'Approved',
          },
          {
            worker_name: 'Eula Stephens',
            roles: 'Gardener',
            photo_url: '',
            total_hours: 15,
            total_ot: 11,
            approver: 'Addie Hill',
            Status: 'Submitted',
          },
          {
            worker_name: 'Cole Fletcher',
            roles: 'Gardener',
            photo_url: '',
            total_hours: 29,
            total_ot: 10,
            approver: 'Hattie Watts',
            Status: 'Open',
          },
          {
            worker_name: 'Jesse Sullivan',
            roles: 'Gardener, Trimmer',
            photo_url: '',
            total_hours: 40,
            total_ot: 23,
            approver: 'Corey Wong',
            Status: 'Approved',
          },
          {
            worker_name: 'Addie Hill',
            roles: 'Trimmer',
            photo_url: '',
            total_hours: 29,
            total_ot: 10,
            approver: 'Eula Stephens',
            Status: 'Submitted',
          },
          {
            worker_name: 'Fannie Snyder',
            roles: 'Trimmer',
            photo_url: '',
            total_hours: 29,
            total_ot: 10,
            approver: 'Christian Morgan',
            Status: 'Open',
          },
          {
            worker_name: 'Christian Morgan',
            roles: 'Gardener',
            photo_url: '',
            total_hours: 29,
            total_ot: 10,
            approver: 'Christian Morgan',
            Status: 'Submitted',
          },
          {
            worker_name: 'Christian Morgan',
            roles: 'Gardener',
            photo_url: '',
            total_hours: 29,
            total_ot: 10,
            approver: 'Christian Morgan',
            Status: 'Submitted',
          },
          {
            worker_name: 'Christian Morgan',
            roles: 'Gardener',
            photo_url: '',
            total_hours: 29,
            total_ot: 10,
            approver: 'Christian Morgan',
            Status: 'Submitted',
          },

        ],
        "metadata": {
          "total": 11,
          "page": 0,
          "pages": 2,
          "skip": 0,
          "limit": 10,
        },
      }

      json
    end
  end
end
