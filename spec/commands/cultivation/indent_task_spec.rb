require 'rails_helper'

RSpec.describe Cultivation::IndentTask, type: :command do
  subject {
    strain = Common::Strain.create(name: 'Zkittles', strain_type: 'indica')
    params ={
      batch_source: 'seeds',
      strain_id: strain.id,
      start_date: Date.new(2018, 1, 1)
    }
    result = Cultivation::SaveBatch.call(params).result #create batch
    result.tasks
  }

  context "Indent In" do

    it "phase (indent in) should become category" do
      phase = subject.first #first task is phase
      params = {id: phase.id, action: 'in'}

      result = Cultivation::IndentTask.call(params).result

      expect(result).to have_attributes(
        is_phase: false,
        is_category: true,
        task_category: result.phase
      )
    end

    it "category (indent in) should become task" do
      category = subject.second #second task is category
      params = {id: category.id, action: 'in'}

      result = Cultivation::IndentTask.call(params).result

      expect(result).to have_attributes(
        is_phase: false,
        is_category: false,
        name: result.task_category
      )
    end

    it "task (indent in) should remain the same" do
      task = subject.third #second task is category
      params = {id: task.id, action: 'in'}

      result = Cultivation::IndentTask.call(params).result

      expect(result).to have_attributes(
        is_phase: task.is_phase,
        is_category: task.is_category,
        name: task.name,
        task_category: task.task_category
      )
    end
  end

  context "Indent Out" do 
    it "phase (indent out) should remain the same" do 
      phase = subject.first #second phase is category
      params = {id: phase.id, action: 'out'}

      result = Cultivation::IndentTask.call(params).result

      expect(result).to have_attributes(
        is_phase: phase.is_phase,
        is_category: phase.is_category,
      )
    end

    it "category (indent out) should become phase" do
      category = subject.second #second category is category
      params = {id: category.id, action: 'out'}

      result = Cultivation::IndentTask.call(params).result

      expect(result).to have_attributes(
        is_phase: true,
        is_category: false
      )
    end

    it "task (indent out) should become category" do
      task = subject.third #second task is category
      params = {id: task.id, action: 'out'}

      result = Cultivation::IndentTask.call(params).result

      expect(result).to have_attributes(
        is_phase: false,
        is_category: true
      )
    end
  end

end
