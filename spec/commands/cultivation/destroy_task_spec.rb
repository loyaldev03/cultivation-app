require 'rails_helper'

RSpec.describe Cultivation::DestroyTask, type: :command do
  context ".call" do

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

    it "should delete record from db" do
      task = subject.first
      cmd = Cultivation::DestroyTask.call(task.id.to_s)
      
      expect(cmd.errors).to be {}
      expect(cmd.success?).to be true
      expect(subject.count).to eq 96
    end
  end
end
