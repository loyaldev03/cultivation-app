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
        if task.isPhase
          params = {isPhase: false, isCategory: true, task_category: task.phase, name: nil}
        elsif task.isCategory
          params = {isPhase: false, isCategory: false, name: task.task_category}
        end
      elsif args[:action] == 'out'
        #task become category or phase
        if task.isCategory
          params = {isPhase: true, isCategory: false, phase: task.task_category, name: nil}
        elsif !task.isPhase && !task.isCategory
          params = {isPhase: false, isCategory: true, task_category: task.name, name: nil}
        end
      end
      task.update(params)
      task
    end
  end
end
