module Common
  class SaveWorkRequest
    prepend SimpleCommand

    attr_reader :current_user, :request_type, :start_time, :end_time, :description

    def initialize(current_user, request_type, start_time, end_time, description)
      @current_user = current_user
      @request_type = request_type
      @start_time = start_time
      @end_time = end_time
      @description = description
    end

    def call
      save_record
    end

    private

    def save_record
      work_request = @current_user.work_requests.new
      work_request.request_type = @request_type
      work_request.start_time = @start_time
      work_request.end_time = @end_time
      work_request.description = @description
      work_request.reporting_manager_id = @current_user.reporting_manager_id
      work_request.save
      work_request
    end
  end
end
