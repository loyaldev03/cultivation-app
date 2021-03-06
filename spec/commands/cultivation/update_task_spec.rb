require 'rails_helper'

RSpec.describe Cultivation::UpdateTask, type: :command do
  let!(:facility) { create(:facility, :is_complete) }
  let!(:facility_strain) { create(:facility_strain, facility: facility) }
  let(:current_user) { create(:user, facilities: [facility.id]) }
  let(:start_date) { Time.zone.parse("01/01/2019") }
  let(:batch) do
    create(:batch,
           facility_id: facility.id,
           facility_strain: facility_strain,
           start_date: start_date)
  end
  let!(:tasks) do
    # wbs: 1
    t1 = create(:task,
                batch: batch,
                duration: 30,
                start_date: batch.start_date,
                end_date: batch.start_date + 30.days,
                name: "Task 1",
                indent: 0)
    # wbs: 1.1
    t1_1 = create(:task,
                  batch: t1.batch,
                  name: "Task 1.1",
                  duration: 10,
                  start_date: t1.start_date,
                  end_date: t1.start_date + 10.days,
                  indent: 1)
    # wbs: 1.2
    t1_2 = create(:task,
                  batch: t1.batch,
                  name: "Task 1.2",
                  duration: 20,
                  start_date: t1.start_date + 10.days,
                  end_date: t1.start_date + 30.days,
                  indent: 1)
    # wbs: 1.3
    t1_3 = create(:task,
                  batch: t1.batch,
                  name: "Task 1.3",
                  duration: 15,
                  start_date: t1.start_date + 5.days,
                  end_date: t1.start_date + 20.days,
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
                  indent: 1)
    # wbs: 2.2
    t2_2 = create(:task,
                  batch: t2.batch,
                  name: "Task 2.2",
                  duration: 2,
                  start_date: t2.start_date + 1.days,
                  end_date: t2.start_date + 3.days,
                  indent: 1)
    # wbs: 2.3
    t2_3 = create(:task,
                  batch: t2.batch,
                  name: "Task 2.3",
                  duration: 10,
                  start_date: t2_1.end_date,
                  end_date: t2_1.end_date + 10.days,
                  indent: 1)
    # wbs: 2.3.1
    t2_3_1 = create(:task,
                    batch: t2.batch,
                    name: "Task 2.3.1",
                    duration: 3,
                    start_date: t2_3.start_date,
                    end_date: t2_3.start_date + 3.days,
                    indent: 2)
    # wbs: 2.3.2
    t2_3_2 = create(:task,
                    batch: t2.batch,
                    name: "Task 2.3.2",
                    duration: 7,
                    start_date: t2_3_1.end_date,
                    end_date: t2_3_1.end_date + 7.days,
                    indent: 2)

    # wbs: 2.3.2.1
    t2_3_2_1 = create(:task,
                     batch: t2.batch,
                     name: "Task 2.3.2.1",
                     duration: 7,
                     start_date: t2_3_2.start_date,
                     end_date: t2_3_2.start_date + 7.days,
                     indent: 3)
    # wbs: 3
    t3 = create(:task,
                batch: t2.batch,
                name: "Task 3",
                duration: 10,
                start_date: t2.end_date,
                end_date: t2.end_date + 10.days,
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

  context ".call - update activate batch" do
    it "activate batch" do
      batch_start_date = t1.start_date + Faker::Number.number(3).to_i.days
      args_start_date = batch_start_date.to_s
      args = {
        batch_id: batch.id,
        start_date: args_start_date,
      }
      expect(batch.status).to eq Constants::BATCH_STATUS_DRAFT

      cmd = Cultivation::UpdateBatchScheduled.call(current_user, args)
      saved_batch = Cultivation::Batch.find(batch.id)
      saved_t1, saved_t11, saved_t12 = Cultivation::Task.in(id: [t1.id,
                                                                 t1_1.id,
                                                                 t1_2.id]).to_a
      expect(cmd.errors).to eq({})
      expect(cmd.success?).to be true
      expect(saved_batch.status).to eq Constants::BATCH_STATUS_SCHEDULED
      expect(saved_batch.start_date).to eq batch_start_date.beginning_of_day
      expect(saved_t1.start_date).to eq batch_start_date
      expect(saved_t11.start_date).to eq batch_start_date
      expect(saved_t12.start_date).to eq batch_start_date + 10.days
    end
  end

  context ".call - update task name" do
    it "update task name" do
      args = {
        id: t1.id.to_s,
        name: Faker::Lorem.sentence,
      }

      cmd = Cultivation::UpdateTask.call(current_user, args)

      expect(cmd.errors.empty?).to be true
      expect(cmd.result.name).not_to eq t1.name
    end
  end

  context ".call - update task location" do
    it "update task location" do
      room = facility.rooms.first
      args = {
        id: t2_3_2_1.id.to_s,
        location_id: room.id.to_s,
        location_type: "Room",
      }

      cmd = Cultivation::UpdateTask.call(current_user, args)

      expect(cmd.errors.empty?).to be true
      expect(cmd.result.location_id.to_s).to eq room.id.to_s
      expect(cmd.result.location_type).to eq "Room"
    end
  end

  context ".call - update assignees" do
    let(:worker10) { create(:user, facilities: [facility.id], hourly_rate: 10) }
    let(:worker8) { create(:user, facilities: [facility.id], hourly_rate: 8) }
    let(:worker_invalid) { create(:user, hourly_rate: 10) }

    it "update assigned users should only save unique" do
      target = t2_3_2_1
      args = {id: target.id,
              name: Faker::Name.name,
              user_ids: [
                worker10.id,
                worker10.id,
                worker8.id,
                worker_invalid.id,
              ]}

      cmd = Cultivation::UpdateTask.call(current_user, args)

      expect(cmd.success?).to be true
      expect(cmd.result.user_ids.length).to eq 2
      expect(cmd.result.user_ids[0]).to eq worker10.id
      expect(cmd.result.user_ids[1]).to eq worker8.id
    end

    it "assigned user should received notification" do
      target = t2_3_2_1
      args = {
        id: target.id,
        name: Faker::Name.name,
        estimated_hours: 10,
        action: "edit_assignees",
        user_ids: [worker10.id.to_s],
      }

      Sidekiq::Testing.inline! do
        cmd = Cultivation::UpdateTask.call(current_user, args)
        notice = Notification.where(action: 'task_assigned',
                                    recipient_id: worker10.id).first
        expect(notice).not_to be nil
        expect(notice).to have_attributes(
          recipient_id: worker10.id,
          recipient_name: worker10.display_name,
          actor_id: current_user.id,
          actor_name: current_user.display_name,
          action: 'task_assigned',
          notifiable_id: target.id,
          notifiable_type: Constants::NOTIFY_TYPE_TASK,
          notifiable_name: args[:name],
        )
      end
    end

    it "unassigned user should received notification" do
      target = t2_3_2_1
      assign_args = {
        id: target.id,
        name: target.name,
        estimated_hours: 10,
        action: "edit_assignees",
        user_ids: [worker10.id.to_s],
      }
      unassign_args = {
        id: target.id,
        name: target.name,
        estimated_hours: 10,
        action: "edit_assignees",
        user_ids: [worker8.id.to_s],
      }

      Sidekiq::Testing.inline! do
        # First assign the task
        cmd = Cultivation::UpdateTask.call(current_user, assign_args)
        assign_notice = Notification.where(action: 'task_assigned',
                                           recipient_id: worker10.id).first

        expect(assign_notice).not_to be nil
        expect(assign_notice).to have_attributes(
          recipient_id: worker10.id,
          recipient_name: worker10.display_name,
          actor_id: current_user.id,
          actor_name: current_user.display_name,
          action: 'task_assigned',
          notifiable_id: target.id,
          notifiable_type: Constants::NOTIFY_TYPE_TASK,
        )

        # Then, unassign the task
        cmd = Cultivation::UpdateTask.call(current_user, unassign_args)
        notice1 = Notification.where(action: 'task_unassigned',
                                    recipient_id: worker10.id).first
        notice2 = Notification.where(action: 'task_assigned',
                                    recipient_id: worker8.id).first

        expect(notice1).not_to be nil
        expect(notice1).to have_attributes(
          recipient_id: worker10.id,
          recipient_name: worker10.display_name,
          actor_id: current_user.id,
          actor_name: current_user.display_name,
          action: 'task_unassigned',
          notifiable_id: target.id,
          notifiable_type: Constants::NOTIFY_TYPE_TASK,
        )

        expect(notice2).not_to be nil
        expect(notice2).to have_attributes(
          recipient_id: worker8.id,
          recipient_name: worker8.display_name,
          actor_id: current_user.id,
          actor_name: current_user.display_name,
          action: 'task_assigned',
          notifiable_id: target.id,
          notifiable_type: Constants::NOTIFY_TYPE_TASK,
        )
      end
    end
  end

  context ".call - updating estimated hours / cost" do
    let(:worker10) { create(:user, facilities: [facility.id], hourly_rate: 10) }
    let(:worker8) { create(:user, facilities: [facility.id], hourly_rate: 8) }
    let(:worker_invalid) { create(:user, hourly_rate: 10) }

    it "update estimated hours of parent task have no changes" do
      args = {
        id: t1.id.to_s,
        estimated_hours: Faker::Number.number(2),
      }

      cmd = Cultivation::UpdateTask.call(current_user, args)

      expect(cmd.errors.empty?).to be true
      expect(cmd.result.estimated_hours).to eq t1.estimated_hours
    end

    it "update subtask estimated hours should rollup to parent" do
      target = t2_3_2_1
      args = {
        id: target.id.to_s,
        estimated_hours: Faker::Number.number(2).to_f,
      }

      cmd = Cultivation::UpdateTask.call(current_user, args)

      parent = Cultivation::Task.find(t2_3_2.id)
      expect(cmd.errors.empty?).to be true
      expect(cmd.result.estimated_hours).to eq args[:estimated_hours]
      expect(parent.estimated_hours).to eq args[:estimated_hours]
    end

    it "update parent task estimated hours hours should not have effect" do
      target1 = t2_3_2_1
      target2 = t2_3_1
      args1 = {id: target1.id, estimated_hours: Faker::Number.number(2).to_f}
      args2 = {id: target2.id, estimated_hours: Faker::Number.number(2).to_f}

      Cultivation::UpdateTask.call(current_user, args1)
      Cultivation::UpdateTask.call(current_user, args2)

      parent = Cultivation::Task.find(t2_3.id)
      expected = args1[:estimated_hours] + args2[:estimated_hours]
      expect(parent.estimated_hours).to eq expected
    end

    it "update estimated hours & assigned user should update estimated_cost" do
      target = t2_3_2_1
      args = {
        id: target.id,
        estimated_hours: 10,
        user_ids: [worker10.id, worker8.id],
      }

      cmd = Cultivation::UpdateTask.call(current_user, args)

      expected = (5 * worker10.hourly_rate) + (5 * worker8.hourly_rate)
      expect(cmd.success?).to be true
      expect(cmd.result.user_ids.length).to eq 2
      expect(cmd.result.estimated_hours).to eq 10
      expect(cmd.result.estimated_cost).to eq expected
    end

    it "update estimated hours should update parent task" do
      target = t2_3_2_1
      args = {
        id: target.id,
        estimated_hours: 10,
        user_ids: [worker10.id, worker8.id],
      }

      cmd = Cultivation::UpdateTask.call(current_user, args)

      grand_parent, parent = Cultivation::Task.in(id: [t2_3_2.id, t2_3.id])

      total_cost = (5 * worker10.hourly_rate) + (5 * worker8.hourly_rate)
      expect(cmd.success?).to be true
      expect(parent.estimated_cost).to eq total_cost
      expect(grand_parent.estimated_cost).to eq total_cost
    end
  end

  context ".call - update predecessors / depend_on" do
    it "update depend_on should persist depend_on field" do
      args = {
        id: t3.id.to_s,
        depend_on: t1.id.to_s,
      }

      cmd = Cultivation::UpdateTask.call(current_user, args)

      expect(cmd.success?).to be true
      expect(cmd.result.depend_on).to eq t1.id
    end

    it "update depend_on on child node have no effect" do
      args = {
        id: t2_3_2_1.id.to_s,
        depend_on: t2.id.to_s,
      }

      cmd = Cultivation::UpdateTask.call(current_user, args)

      expect(cmd.success?).to be false
      expect(cmd.result.depend_on).to eq nil
      expect(cmd.errors[:depend_on][0]).to eq "Cannot set parent node as predecessor"
    end

    it "update depend_on should update start_date" do
      args = {
        id: t3.id.to_s,
        depend_on: t1.id.to_s,
      }

      cmd = Cultivation::UpdateTask.call(current_user, args)

      expect(cmd.success?).to be true
      expect(cmd.result.start_date).to eq t1.end_date
    end

    it "remove predecessor should set depend_on to nil" do
      args = {
        id: t3.id.to_s,
        depend_on: nil,
      }

      cmd = Cultivation::UpdateTask.call(current_user, args)

      expect(cmd.success?).to be true
      expect(cmd.result.depend_on).to be nil
    end

    it "first_child should cascade changes to parent" do
      args = {
        id: t2_3_2_1.id.to_s,
        depend_on: t2_2.id.to_s,
      }
      expect(t2_3_2_1.start_date).not_to eq t2_2.end_date
      expect(t2_3_2.duration).to eq t2_3_2_1.duration

      cmd = Cultivation::UpdateTask.call(current_user, args)

      expect(cmd.success?).to be true

      tasks = Cultivation::QueryTasks.call(cmd.result.batch).result
      target = tasks.detect { |t| t.id == t2_3_2_1.id }
      parent = tasks.detect { |t| t.id == t2_3_2.id }
      expect(target.start_date).to eq t2_2.end_date
      expect(parent.start_date).to eq target.start_date
      expect(parent.end_date).to eq target.end_date
      expect(parent.duration).to eq target.duration
    end
  end

  context ".call - updating dates" do
    it "update start_date forward" do
      args = {
        id: t2.id.to_s,
        start_date: Time.parse("02/02/2019"),
      }

      cmd = Cultivation::UpdateTask.call(current_user, args)

      expect(cmd.errors.empty?).to be true
      expect(cmd.result.start_date).not_to eq t2.start_date
    end

    it "update start_date backward" do
      args = {
        id: t2.id.to_s,
        start_date: Time.parse("22/12/2018"),
      }

      cmd = Cultivation::UpdateTask.call(current_user, args)

      expect(cmd.errors.empty?).to be true
      expect(cmd.result.start_date).not_to eq t2.start_date
    end

    it "update duration of parent should remain same" do
      args = {
        id: t2.id.to_s,
        duration: Faker::Number.number(1),
      }

      cmd = Cultivation::UpdateTask.call(current_user, args)

      expect(cmd.errors.empty?).to be true
      expect(cmd.result.duration).to eq t2.duration
    end

    it "update indelible task" do
      args = {
        id: t4.id.to_s,
        name: Faker::Lorem.sentence,
      }

      cmd = Cultivation::UpdateTask.call(current_user, args)

      expect(cmd.errors.empty?).to be true
      expect(cmd.result.name).to eq t4.name
    end

    it "cascade start_date forward changes to sub-tasks" do
      args = {
        id: t1.id.to_s,
        start_date: Time.parse("03/03/2019"),
      }

      cmd = Cultivation::UpdateTask.call(current_user, args)

      res11 = Cultivation::Task.find_by(id: t1_1.id)
      expect(cmd.success?).to be true
      expect(res11.start_date).not_to eq t1.start_date
      expect(res11.start_date).to eq cmd.result.start_date
    end

    it "cascade start_date backward changes to subtasks" do
      args = {
        id: t2.id.to_s,
        start_date: Time.parse("22/12/2018"),
      }

      cmd = Cultivation::UpdateTask.call(current_user, args)

      result = Cultivation::Task.find(t2_3_1.id)
      day_diff = (args[:start_date] - t2.start_date) / 1.day
      expected = (t2_3_1.start_date + day_diff.days)
      expect(cmd.success?).to be true
      expect(result.start_date.to_date).to eq expected.to_date
    end

    it "cascade start_date changes to next node" do
      random_number = Faker::Number.number(2).to_i.days
      new_start_date = t1.start_date + random_number
      new_t2_start = t2.start_date + random_number
      new_t3_start = t3.start_date + random_number
      args = {
        id: t1.id,
        start_date: new_start_date,
      }

      cmd = Cultivation::UpdateTask.call(current_user, args)
      saved_t2 = Cultivation::Task.find(t2.id)
      saved_t3 = Cultivation::Task.find(t3.id)

      expect(cmd.success?).to be true
      expect(cmd.result.start_date).to eq new_start_date
      expect(saved_t2.start_date).to eq new_t2_start
      expect(saved_t3.start_date).to eq new_t3_start
    end

    it "cannot update first subtask start_date (follow parent)" do
      new_start_date = t2.start_date + Faker::Number.number(1).to_i.days
      args = {
        id: t2_1.id.to_s,
        start_date: new_start_date,
      }

      cmd = Cultivation::UpdateTask.call(current_user, args)

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

      cmd = Cultivation::UpdateTask.call(current_user, args)

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

      cmd = Cultivation::UpdateTask.call(current_user, args)

      result231 = Cultivation::Task.find(t2_3_1.id)
      expect(cmd.success?).to be true
      expect(cmd.result.start_date.to_date).to eq t2.start_date.to_date
      expect(result231.start_date.to_date).to eq cmd.result.start_date.to_date
    end

    it "subtask end later than parent task should extend parent" do
      target = t2_3_2_1
      new_end_date = target.end_date + Faker::Number.number(2).to_i.days
      new_duration = (new_end_date - target.start_date) / 1.day

      args = {
        id: target.id.to_s,
        duration: new_duration,
      }

      cmd = Cultivation::UpdateTask.call(current_user, args)

      parent = Cultivation::Task.find(t2_3_2.id)
      grand_parent = Cultivation::Task.find(t2_3.id)
      expect(cmd.success?).to be true
      expect(cmd.result.duration).to eq new_duration
      expect(cmd.result.end_date.to_date).to eq new_end_date.to_date
      expect(parent.end_date.to_date).to eq new_end_date.to_date
      expect(grand_parent.end_date.to_date).to eq new_end_date.to_date
    end

    it "subtask end ealier than parent task should contract parent 1" do
      target = t2_3_2_1
      new_end_date = target.end_date - 2.days
      new_duration = (new_end_date - target.start_date) / 1.day

      args = {
        id: target.id.to_s,
        duration: new_duration,
      }

      cmd = Cultivation::UpdateTask.call(current_user, args)

      parent = Cultivation::Task.find(t2_3_2.id)
      grand_parent = Cultivation::Task.find(t2_3.id)
      expect(cmd.success?).to be true
      expect(cmd.result.duration).to be 5 # originally this is 7
      expect(cmd.result.end_date.to_date).to eq new_end_date.to_date
      expect(parent.end_date.to_date).to eq new_end_date.to_date
      expect(grand_parent.end_date.to_date).to eq new_end_date.to_date
    end

    it "subtask end ealier than parent task should contract parent 2" do
      target = t1_2
      args = {
        id: target.id.to_s,
        duration: 3,
      }

      cmd = Cultivation::UpdateTask.call(current_user, args)

      parent = Cultivation::Task.find(t1.id)
      expect(cmd.success?).to be true
      expect(cmd.result.end_date.to_i).to eq (target.start_date + 3.days).to_i
      expect(parent.duration).to eq 20
      expect(parent.end_date.to_datetime).to eq t1_3.end_date.to_datetime
    end

    it "update parent task end_date would have no effect" do
      args = {
        id: t1.id.to_s,
        duration: 3,
      }

      cmd = Cultivation::UpdateTask.call(current_user, args)

      expect(cmd.success?).to be true
      expect(cmd.result.end_date.to_datetime).to eq t1.end_date.to_datetime
      expect(cmd.result.duration).to eq t1.duration
    end

    it "depend_on end_date changes should cascade to dependents" do
      args = {
        id: t2_3_2_1.id.to_s,
        depend_on: t2_2.id.to_s,
      }
      expect(t2_3_2_1.start_date).not_to eq t2_2.end_date

      # First set the depend_on to take end date from depend_on
      cmd1 = Cultivation::UpdateTask.call(current_user, args)
      expect(cmd1.result.start_date).to eq t2_2.end_date

      # Then, change the depend_on end_date
      cmd2 = Cultivation::UpdateTask.call(
        current_user,
        id: t2_2.id.to_s,
        duration: Faker::Number.number(1),
      )

      # depend_on end_date should cascade to dependents
      tasks = Cultivation::QueryTasks.call(cmd2.result.batch).result
      target = tasks.detect { |t| t.id == t2_3_2_1.id }
      depend_on = tasks.detect { |t| t.id == t2_2.id }
      expect(target.start_date).to eq depend_on.end_date
    end
  end
end
