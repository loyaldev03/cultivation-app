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
      task = Cultivation::Task.find(@record_id)
      if task&.indelible.present?
        errors.add(:id, "\"#{task.name}\" is indelible")
        true
      elsif task
        task.delete
      else
        false
      end
    end
  end
end
