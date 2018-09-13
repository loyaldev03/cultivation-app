module Cultivation
  class CreateTask
    prepend SimpleCommand

    attr_reader :args

    def initialize(args)
      @args = args
    end

    def call
      save_record(@args)
    end

    private

    def save_record(args)
      Rails.logger.debug "Errors ==> #{args.inspect}"

      task = Cultivation::Task.create(args)
      Rails.logger.debug "Errors ==> #{task.inspect}"
      task
    end
  end
end
