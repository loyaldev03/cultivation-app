require 'rails_helper'

RSpec.describe Cultivation::CreateTask, type: :command do
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

  context "Creation New Task With Top and Bottom from selected task" do

    it "Task Saved" do
      phase = subject.last
      params = {task_related_id: phase.id, position: 'top', name: 'Testing Task'}

      result = Cultivation::CreateTask.call(params).result

      expect(result.errors).to be {}
      expect(result).to have_attributes(
        name: params[:name]
      )
    end

    it "New Task position above the task related" do
      phase = subject.third
      params = {task_related_id: phase.id, batch_id: phase.batch_id, position: 'top', name: 'Testing Task'}

      result = Cultivation::CreateTask.call(params).result

      expect(result.errors).to be {}
      expect(result).to have_attributes(
        position: phase.position
      )
    end

    it "New Task position below the task related" do
      phase = subject.third
      params = {task_related_id: phase.id, batch_id: phase.batch_id, position: 'bottom', name: 'Testing Task'}

      result = Cultivation::CreateTask.call(params).result

      expect(result.errors).to be {}
      expect(result).to have_attributes(
        position: (phase.position + 1)
      )
    end

  end


end
