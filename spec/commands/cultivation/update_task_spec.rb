require 'rails_helper'

RSpec.describe Cultivation::UpdateTask, type: :command do

  context ".find_changes with task and temp_tasks" do
    subject {
      strain = Common::Strain.create(name: 'Zkittles', strain_type: 'indica')
      params ={
        batch_source: 'seeds',
        strain_id: strain.id,
        start_date: Date.new(2018, 1, 1)
      }
      result = Cultivation::SaveBatch.call(params).result #create batch
      result.tasks.sample(1).first
    }

    it "should update temp children task" do
      task = subject
      task.update(start_date: Date.today, end_date: Date.today + task.days.to_i.send('days'))
      temp_tasks = []
      Cultivation::UpdateTask.new.find_changes(task, temp_tasks) 
      
      children = task.children.first # first children
      if children.present?
        temp_children = temp_tasks.find{|x| x.id == BSON::ObjectId(children.id)}
        expect(temp_children).to have_attributes(
          start_date: task.start_date,
          end_date: task.start_date + temp_children.days.to_i.send('days')
        )
      end

      # finding the first children's children if there is 
      if temp_children and temp_children.children.count != 0
        temp_children = temp_tasks.find{|x| x.id == BSON::ObjectId(temp_children.children.first.id)}
        expect(temp_children).to have_attributes(
          start_date: task.start_date,
          end_date: task.start_date + temp_children.days.to_i.send('days')
        )
      end
    end

    it "should update temp depend task" do
      task = subject
      task.update(start_date: Date.today, end_date: Date.today + task.days.to_i.send('days'))
      temp_tasks = []
      Cultivation::UpdateTask.new.find_changes(task, temp_tasks) 

      #1st level depend task
      depend_task = task.tasks_depend.first
      unless depend_task.nil?
        depend_task_template1 = temp_tasks.find{|x| x.id == BSON::ObjectId(depend_task.id)}
        
        expect(depend_task_template1).to have_attributes(
          start_date: (task.end_date + 1.days),
          end_date: (task.end_date + 1.days) + depend_task_template1.days.to_i.send('days')
        )  
      end    

      #2nd level depend task
      depend_task = depend_task.tasks_depend.first if depend_task
      unless depend_task.nil?
        depend_task_template2 = temp_tasks.find{|x| x.id == BSON::ObjectId(depend_task.id)}
        
        expect(depend_task_template2).to have_attributes(
          start_date: (depend_task_template1.end_date + 1.days),
          end_date: (depend_task_template1.end_date + 1.days) + depend_task_template2.days.to_i.send('days')
        )
      end

      #3rd level depend task
      depend_task = depend_task.tasks_depend.first if depend_task
      unless depend_task.nil?
        depend_task_template3 = temp_tasks.find{|x| x.id == BSON::ObjectId(depend_task.id)}
        
        expect(depend_task_template3).to have_attributes(
          start_date: (depend_task_template2.end_date + 1.days),
          end_date: (depend_task_template2.end_date + 1.days) + depend_task_template3.days.to_i.send('days')
        )
      end

    end


  end


  context ".call with file_changes and bulk_update" do
    subject {
      strain = Common::Strain.create(name: 'Zkittles', strain_type: 'indica')
      params ={
        batch_source: 'seeds',
        strain_id: strain.id,
        start_date: Date.new(2018, 1, 1)
      }
      result = Cultivation::SaveBatch.call(params).result #create batch
      result.tasks.sample(1).first
    }

    it "should save children task after call bulk_update" do 
      task = subject
      task.update(start_date: Date.today, end_date: Date.today + task.days.to_i.send('days'))
      temp_tasks = []
      Cultivation::UpdateTask.new.find_changes(task, temp_tasks) 
      Cultivation::UpdateTask.new.bulk_update(temp_tasks) 

      children = task.children.first # first children
      if children.present?
        expect(children).to have_attributes(
          start_date: task.start_date,
          end_date: task.start_date + children.days.to_i.send('days')
        )
      end

      # finding the first children's children if there is 
      if children and children.children.count != 0
        children = children.children.first
        expect(children).to have_attributes(
          start_date: task.start_date,
          end_date: task.start_date + children.days.to_i.send('days')
        )
      end

    end

    it "should save depend task after call bulk_update" do 

      task = subject
      task.update(start_date: Date.today, end_date: Date.today + task.days.to_i.send('days'))
      temp_tasks = []
      Cultivation::UpdateTask.new.find_changes(task, temp_tasks) 
      Cultivation::UpdateTask.new.bulk_update(temp_tasks) 

      #1st level depend task
      depend_task = task.tasks_depend.first
      unless depend_task.nil?
        expect(depend_task).to have_attributes(
          start_date: (task.end_date + 1.days),
          end_date: (task.end_date + 1.days) + depend_task.days.to_i.send('days')
        )  
      end    

      #2nd level depend task
      depend_task = depend_task.tasks_depend.first if depend_task
      unless depend_task.nil?        
        expect(depend_task).to have_attributes(
          start_date: (depend_task.end_date + 1.days),
          end_date: (depend_task.end_date + 1.days) + depend_task.days.to_i.send('days')
        )
      end
      
      #3rd level depend task
      depend_task = depend_task.tasks_depend.first if depend_task
      unless depend_task.nil?
        expect(depend_task).to have_attributes(
          start_date: (depend_task.end_date + 1.days),
          end_date: (depend_task.end_date + 1.days) + depend_task.days.to_i.send('days')
        )
      end

    end


    # it "should update all task child start_date after updating task start_date" do
    #   task = subject.tasks.first
    #   task.start_date = Date.today
    #   result = Cultivation::UpdateTask.call(task.attributes).result
    #   result.children.each do |child_task|
    #     expect(child_task).to have_attributes(
    #       start_date: Date.today
    #     )
    #   end

    #   # puts result.children.first.inspect
    # end

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
