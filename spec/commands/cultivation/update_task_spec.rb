require 'rails_helper'

RSpec.describe Cultivation::UpdateTask, type: :command do
  let(:current_user) { create(:user) }
  let(:facility) { create(:facility, :is_complete) }
  let(:start_date) { Time.parse("01/01/2019") }
  let(:batch) { create(:batch, facility_id: facility.id, start_date: start_date) }
  let!(:tasks) do
    # wbs: 1
    t1 = create(:task,
                batch: batch,
                start_date: batch.start_date,
                name: "Task 1",
                indent: 0)
    # wbs: 1.1
    t1_1 = create(:task,
                  batch: t1.batch,
                  name: "Task 1.1",
                  duration: 1,
                  start_date: t1.start_date,
                  end_date: t1.start_date + 1.days,
                  parent_id: t1.id,
                  indent: 1)
    # wbs: 1.2
    t1_2 = create(:task,
                  batch: t1.batch,
                  name: "Task 1.2",
                  duration: 2,
                  start_date: t1.start_date,
                  end_date: t1.start_date + 2.days,
                  parent_id: t1.id,
                  indent: 1)
    # wbs: 1.3
    t1_3 = create(:task,
                  batch: t1.batch,
                  name: "Task 1.3",
                  duration: 1,
                  start_date: t1_2.start_date,
                  end_date: t1_2.start_date + 1.days,
                  parent_id: t1.id,
                  indent: 1)
    # wbs: 2
    t2 = create(:task,
                batch: t1.batch,
                name: "Task 2",
                duration: 15,
                start_date: t1.end_date,
                end_date: t1.end_date + 5.days,
                indent: 0)
    # wbs: 2.1
    t2_1 = create(:task,
                  batch: t2.batch,
                  name: "Task 2.1",
                  duration: 2,
                  start_date: t2.start_date,
                  end_date: t2.start_date + 2.days,
                  parent_id: t2.id,
                  indent: 1)
    # wbs: 2.2
    t2_2 = create(:task,
                  batch: t2.batch,
                  name: "Task 2.2",
                  duration: 2,
                  start_date: t2.start_date + 1.days,
                  end_date: t2.start_date + 3.days,
                  parent_id: t2.id,
                  indent: 1)
    # wbs: 2.3
    t2_3 = create(:task,
                  batch: t2.batch,
                  name: "Task 2.3",
                  duration: 2,
                  start_date: t2_1.end_date,
                  end_date: t2_1.end_date + 2.days,
                  parent_id: t2.id,
                  indent: 1)
    # wbs: 2.3.1
    t2_3_1 = create(:task,
                    batch: t2.batch,
                    name: "Task 2.3.1",
                    duration: 1,
                    start_date: t2_3.start_date,
                    end_date: t2_3.start_date + 1.days,
                    parent_id: t2_3.id,
                    indent: 2)
    # wbs: 2.3.2
    t2_3_2 = create(:task,
                    batch: t2.batch,
                    name: "Task 2.3.2",
                    duration: 1,
                    start_date: t2_3_1.end_date,
                    end_date: t2_3_1.end_date + 2.days,
                    depend_on: t2_3_1.id,
                    parent_id: t2_3.id,
                    indent: 2)

    # wbs: 2.3.2.1
    t2_3_2_1 = create(:task,
                     batch: t2.batch,
                     name: "Task 2.3.2.1",
                     duration: 1,
                     start_date: t2_3_2.start_date,
                     end_date: t2_3_2.start_date + 1.days,
                     parent_id: t2_3_2.id,
                     indent: 3)
    # wbs: 3
    t3 = create(:task,
                batch: t2.batch,
                name: "Task 3",
                duration: 10,
                start_date: t2.end_date,
                end_date: t2.end_date + 10.days,
                depend_on: t2_3_2_1.id,
                indent: 0)
    # wbs: 4
    t4 = create(:task,
                batch: t3.batch,
                name: "Task 4",
                duration: 10,
                start_date: t3.end_date,
                end_date: t3.end_date + 10.days,
                indelible: true,
                indent: 0)

    [t1,
     t1_1,
     t1_2,
     t1_3,
     t2,
     t2_1,
     t2_2,
     t2_3,
     t2_3_1,
     t2_3_2,
     t2_3_2_1,
     t3,
     t4]
  end

  context ".call" do
    let(:t1) { tasks[0] }
    let(:t1_1) { tasks[1] }
    let(:t1_2) { tasks[2] }
    let(:t1_3) { tasks[3] }
    let(:t2) { tasks[4] }
    let(:t2_1) { tasks[5] }
    let(:t2_2) { tasks[6] }
    let(:t2_3) { tasks[7] }
    let(:t2_3_1) { tasks[8] }
    let(:t2_3_2) { tasks[9] }
    let(:t2_3_2_1) { tasks[10] }
    let(:t3) { tasks[11] }
    let(:t4) { tasks[12] }

    it "update task name" do
      args = {
        id: t1.id.to_s,
        name: Faker::Lorem.sentence,
      }

      cmd = Cultivation::UpdateTask.call(args, current_user)

      expect(cmd.errors.empty?).to be true
      expect(cmd.result.name).not_to eq t1.name
    end

    it "update start_date forward" do
      args = {
        id: t2.id.to_s,
        start_date: Time.parse("02/02/2019"),
      }

      cmd = Cultivation::UpdateTask.call(args, current_user)

      expect(cmd.errors.empty?).to be true
      expect(cmd.result.start_date).not_to eq t2.start_date
    end

    it "update start_date backward" do
      args = {
        id: t2.id.to_s,
        start_date: Time.parse("22/12/2018"),
      }

      cmd = Cultivation::UpdateTask.call(args, current_user)

      expect(cmd.errors.empty?).to be true
      expect(cmd.result.start_date).not_to eq t2.start_date
    end

    it "update duration" do
      args = {
        id: t2.id.to_s,
        duration: Faker::Number.number(1),
      }

      cmd = Cultivation::UpdateTask.call(args, current_user)

      expect(cmd.errors.empty?).to be true
      expect(cmd.result.duration).not_to eq t2.duration
    end

    it "update indelible task" do
      args = {
        id: t4.id.to_s,
        name: Faker::Lorem.sentence,
      }

      cmd = Cultivation::UpdateTask.call(args, current_user)

      expect(cmd.errors.empty?).to be true
      expect(cmd.result.name).to eq t4.name
    end

    it "update estimated hours" do
      args = {
        id: t1.id.to_s,
        estimated_hours: Faker::Number.number(2),
      }

      cmd = Cultivation::UpdateTask.call(args, current_user)

      expect(cmd.errors.empty?).to be true
      expect(cmd.result.estimated_hours.to_f).to eq args[:estimated_hours].to_f
    end

    it "update depend_on" do
      args = {
        id: t3.id.to_s,
        depend_on: t1.id.to_s,
      }

      cmd = Cultivation::UpdateTask.call(args, current_user)

      expect(cmd.success?).to be true
      expect(cmd.result.depend_on).to eq t1.id
    end

    it "remove depend_on" do
      args = {
        id: t3.id.to_s,
        depend_on: nil,
      }

      cmd = Cultivation::UpdateTask.call(args, current_user)

      expect(cmd.success?).to be true
      expect(cmd.result.depend_on).to be nil
    end

    it "cascade start_date forward changes to sub-tasks" do
      args = {
        id: t1.id.to_s,
        start_date: Time.parse("03/02/2019"),
      }

      cmd = Cultivation::UpdateTask.call(args, current_user)

      saved11 = Cultivation::Task.find(t1_1.id)
      saved12 = Cultivation::Task.find(t1_2.id)
      expect(cmd.success?).to be true
      expect(saved11.start_date).to eq cmd.result.start_date
      expect(saved12.start_date).to eq cmd.result.start_date
    end

    it "cascade start_date backward changes to subtasks" do
      args = {
        id: t2.id.to_s,
        start_date: Time.parse("22/12/2018"),
      }

      cmd = Cultivation::UpdateTask.call(args, current_user)

      result = Cultivation::Task.find(t2_3_1.id)
      day_diff = (args[:start_date] - t2.start_date) / 1.day
      expected = (t2_3_1.start_date + day_diff.days)
      expect(cmd.success?).to be true
      expect(result.start_date.to_date).to eq expected.to_date
    end

    it "cannot update first subtask start_date (follow parent)" do
      new_start_date = t2.start_date + Faker::Number.number(1).to_i.days
      args = {
        id: t2_1.id.to_s,
        start_date: new_start_date,
      }

      cmd = Cultivation::UpdateTask.call(args, current_user)

      result = Cultivation::Task.find(t2_1.id)
      expect(cmd.success?).to be true
      expect(result.start_date.to_i).to eq t2.start_date.to_i
    end

    it "can update second subtask start_date" do
      new_start_date = t2.start_date + Faker::Number.number(1).to_i.days
      args = {
        id: t2_2.id.to_s,
        start_date: new_start_date,
      }

      cmd = Cultivation::UpdateTask.call(args, current_user)

      result = Cultivation::Task.find(t2_2.id)
      expect(cmd.success?).to be true
      expect(result.start_date.to_i).to eq new_start_date.to_i
    end

    it "subtask start_date cannot be updated to ealier than parent" do
      new_start_date = t2.start_date - Faker::Number.number(1).to_i.days
      args = {
        id: t2_3.id.to_s,
        start_date: new_start_date,
      }
      # pp "t2.start_date: #{t2.start_date}"
      # pp "t2_3.start_date: #{t2_3.start_date}"
      # pp "t2_3_1.start_date: #{t2_3_1.start_date}"
      # pp "new_start_date: #{new_start_date}"

      cmd = Cultivation::UpdateTask.call(args, current_user)

      result = Cultivation::Task.find(t2_3.id)
      result231 = Cultivation::Task.find(t2_3_1.id)
      expect(cmd.success?).to be true
      expect(result.start_date.to_date).to eq t2.start_date.to_date
      expect(result231.start_date.to_date).to eq result.start_date.to_date
      # pp "result.start_date: #{result.start_date}"
      # pp "result231.start_date: #{result231.start_date}"
    end

    it "subtask end later than parent task should extend parent", focus: true do
      target = t2_3_2_1
      parent = t2_3_2
      new_end_date = target.end_date + Faker::Number.number(2).to_i.days
      new_duration = (new_end_date - target.start_date) / 1.day

      pp "target parent end_date #{parent.end_date}"
      pp "target ori end_date: #{target.end_date}"
      pp "target new end_date: #{new_end_date}"
      pp "target start_date: #{target.start_date}"
      pp "target ori duration: #{target.duration}"
      pp "target new_duration: #{new_duration}"

      args = {
        id: target.id.to_s,
        duration: new_duration,
      }

      cmd = Cultivation::UpdateTask.call(args, current_user)
      parent = Cultivation::Task.find(parent.id)

      expect(cmd.success?).to be true
      expect(cmd.result.duration).to eq new_duration
      expect(cmd.result.end_date.to_date).to eq new_end_date.to_date
      expect(parent.end_date.to_date).to eq new_end_date.to_date
      # expect(target.end_date).to eq new_end_date
      # expect(parent_saved.end_date).to eq target.end_date
    end
  end
end
    # [t1,
    #  t1_1,
    #  t1_2,
    #  t1_3,
    #  t2,
    #  t2_1,
    #  t2_2,
    #  t2_3,
    #  t2_3_1,
    #  t2_3_2,
    #  t2_3_2_1,
    #  t3,
    #  t4]
