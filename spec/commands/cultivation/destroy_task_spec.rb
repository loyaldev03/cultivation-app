require 'rails_helper'

RSpec.describe Cultivation::DestroyTask, type: :command do
  let(:facility) { create(:facility, :is_complete) }
  let(:current_user) { create(:user, facilities: [facility.id]) }
  let(:start_date) { Time.zone.parse("01/01/2019") }
  let(:batch) { create(:batch, facility_id: facility.id, start_date: start_date) }
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
                estimated_hours: 40,
                start_date: t1.end_date,
                end_date: t1.end_date + 5.days,
                indent: 0)
    # wbs: 2.1
    t2_1 = create(:task,
                  batch: t2.batch,
                  name: "Task 2.1",
                  duration: 2,
                  estimated_hours: 5,
                  start_date: t2.start_date,
                  end_date: t2.start_date + 2.days,
                  indent: 1)
    # wbs: 2.2
    t2_2 = create(:task,
                  batch: t2.batch,
                  name: "Task 2.2",
                  duration: 2,
                  estimated_hours: 5,
                  start_date: t2.start_date + 1.days,
                  end_date: t2.start_date + 3.days,
                  indent: 1)
    # wbs: 2.3
    t2_3 = create(:task,
                  batch: t2.batch,
                  name: "Task 2.3",
                  duration: 10,
                  estimated_hours: 30,
                  start_date: t2_1.end_date,
                  end_date: t2_1.end_date + 10.days,
                  indent: 1)
    # wbs: 2.3.1
    t2_3_1 = create(:task,
                    batch: t2.batch,
                    name: "Task 2.3.1",
                    duration: 3,
                    estimated_hours: 10,
                    start_date: t2_3.start_date,
                    end_date: t2_3.start_date + 3.days,
                    indent: 2)
    # wbs: 2.3.2
    t2_3_2 = create(:task,
                    batch: t2.batch,
                    name: "Task 2.3.2",
                    duration: 7,
                    estimated_hours: 20,
                    start_date: t2_3_1.end_date,
                    end_date: t2_3_1.end_date + 7.days,
                    depend_on: t2_3_1.id,
                    indent: 2)

    # wbs: 2.3.2.1
    t2_3_2_1 = create(:task,
                     batch: t2.batch,
                     name: "Task 2.3.2.1",
                     duration: 7,
                     estimated_hours: 10,
                     start_date: t2_3_2.start_date,
                     end_date: t2_3_2.start_date + 7.days,
                     indent: 3)
    # wbs: 2.3.2.2
    t2_3_2_2 = create(:task,
                     batch: t2.batch,
                     name: "Task 2.3.2.2",
                     duration: 3,
                     estimated_hours: 10,
                     start_date: t2_3_2.start_date,
                     end_date: t2_3_2.start_date + 3.days,
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
     t2_3_2_2,
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
  let(:t2_3_2_2) { tasks[11] }
  let(:t3) { tasks[12] }
  let(:t4) { tasks[13] }

  context ".call - updating estimated hours / cost" do
    it "deleting child task should update parent estimate" do
      target = t2_3_2_2
      args = { id: target.id }

      cmd = Cultivation::DestroyTask.call(current_user, args)

      expect(cmd.errors).to eq({})
      expect(cmd.success?).to be true

      # Deleted task should not longer exists in the database.
      expect(Cultivation::Task.where(id: target.id)).not_to exist
      parent = Cultivation::Task.find(t2_3_2.id)
      expect(parent.estimated_hours).to eq (t2_3_2.estimated_hours - target.estimated_hours)
    end
  end
end
