module Cultivation
  class IndentTask
    prepend SimpleCommand

    attr_reader :args, :task, :array

    def initialize(args = nil)
      @args = args
    end

    def call
      task = Cultivation::Task.find(@args[:id])
      indent(task, @args)
    end

    private

    def indent(task, args)
      if args[:action] == 'in'
        #task become child
        if task.is_phase
          params = {is_phase: false, is_category: true, task_category: task.phase}
        elsif task.is_category
          params = {is_phase: false, is_category: false, name: task.task_category}
        end
      elsif args[:action] == 'out'
        #task become category or phase
        if task.is_category
          params = {is_phase: true, is_category: false, phase: task.task_category, task_category: nil}
        elsif !task.is_phase && !task.is_category
          params = {is_phase: false, is_category: true, task_category: task.name}
        end
      end
      task.update(params)
      task
    end
  end
end
