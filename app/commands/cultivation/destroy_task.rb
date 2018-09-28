module Cultivation
  class DestroyTask
    prepend SimpleCommand

    attr_reader :args

    def initialize(record_id)
      if record_id.nil?
        raise 'Invalid record id'
      else
        @record_id = record_id
      end
    end

    def call
      @record = Cultivation::Task.find(@record_id).delete
    end
  end
end
