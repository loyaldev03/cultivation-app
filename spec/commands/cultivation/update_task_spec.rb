require 'rails_helper'

RSpec.describe Cultivation::UpdateTask, type: :command do
  context ".call with args" do
    subject {
      params ={
        batch_source: 'Seeds',
        strain_id: 'AK-47',
        start_date: Date.new(2018, 1, 1)
      }
      result = Cultivation::SaveBatch.call(params).result
    }


    it "should update all task child start_date after updating task start_date" do
      task = subject.tasks.first
      task.start_date = Date.today
      result = Cultivation::UpdateTask.call(task.attributes).result
      result.children.each do |child_task|
        expect(child_task).to have_attributes(
          start_date: Date.today
        )
      end

      # puts result.children.first.inspect
    end

    it "should update all depending task start_date after updating task end_date" do
    end

    it "should not update any task child start_date after updating task other attributes" do
    end

    it "should not update any depending task start_date after updating task end_date" do
    end

    it "task end date beyond parent end_date, should update parent end_date" do
    end

    #handle validation

    # it "return result when name exists" do
    #   cmd = FindFacility.call({name: subject.name})

    #   expect(cmd.errors).to be {}
    #   expect(cmd.success?).to be true
    #   expect(cmd.result.c_at).to_not be nil
    #   expect(cmd.result.u_at).to_not be nil
    #   expect(cmd.result).to have_attributes(
    #     id: subject.id,
    #     name: subject.name,
    #   )
    # end

    # it "return error if record not found" do
    #   new_record = Facility.new

    #   cmd = FindFacility.call({id: new_record.id.to_s})

    #   expect(cmd.success?).to be false
    #   expect(cmd.errors).to eq ({ not_found: ["Record Not Found"] })
    # end
  end
end
