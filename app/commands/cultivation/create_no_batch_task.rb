module Cultivation
  class CreateNoBatchTask
    prepend SimpleCommand

    attr_reader :args

    def initialize(current_user, args)
      @args = args
      @current_user = current_user
    end

    def call
      save_record
    end

    private

    def save_record
      indelible = get_indelible(@args[:task_type])
      task = Cultivation::Task.new(
        name: @args[:name],
        start_date: @args[:start_date],
        end_date: @args[:end_date],
        duration: @args[:duration],
        estimated_hours: @args[:estimated_hours],
        user_ids: @args[:user_ids],
        facility_id: @args[:facility_id],
        indelible: indelible,
      )
      task.save
      task
    end

    def get_indelible(task_type)
      if task_type != 'normal_task'
        task_type
      end
    end
  end
end
