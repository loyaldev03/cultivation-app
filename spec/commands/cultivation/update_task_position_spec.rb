require 'rails_helper'

RSpec.describe Cultivation::UpdateTaskPosition, type: :command do
  subject(:current_user) { create(:user) }
  subject!(:tasks) do
    # wbs: 1
    t1 = create(:task, indent: 0)
    # wbs: 1.1
    t1_1 = create(:task,
                  batch: t1.batch,
                  duration: 1,
                  start_date: t1.start_date,
                  end_date: t1.start_date + 1.days,
                  parent_id: t1.id,
                  indent: 1)
    # wbs: 1.2
    t1_2 = create(:task,
                  batch: t1.batch,
                  duration: 2,
                  start_date: t1.start_date,
                  end_date: t1.start_date + 2.days,
                  parent_id: t1.id,
                  indent: 1)
    # wbs: 1.3
    t1_3 = create(:task,
                  batch: t1.batch,
                  duration: 1,
                  start_date: t1_2.start_date,
                  end_date: t1_2.start_date + 1.days,
                  parent_id: t1.id,
                  indent: 1)
    # wbs: 2
    t2 = create(:task,
                batch: t1.batch,
                duration: 5,
                start_date: t1.end_date,
                end_date: t1.end_date + 5.days,
                indent: 0)
    # wbs: 2.1
    t2_1 = create(:task,
                  batch: t2.batch,
                  duration: 2,
                  start_date: t2.start_date,
                  end_date: t2.start_date + 2.days,
                  parent_id: t2.id,
                  indent: 1)
    # wbs: 2.2
    t2_2 = create(:task,
                  batch: t2.batch,
                  duration: 2,
                  start_date: t2.start_date + 1.days,
                  end_date: t2.start_date + 3.days,
                  parent_id: t2.id,
                  indent: 1)
    # wbs: 2.3
    t2_3 = create(:task,
                  batch: t2.batch,
                  duration: 2,
                  start_date: t2_1.end_date,
                  end_date: t2_1.end_date + 2.days,
                  parent_id: t2.id,
                  indent: 1)
    # wbs: 2.3.1
    t2_3_1 = create(:task,
                    batch: t2.batch,
                    duration: 1,
                    start_date: t2_3.start_date,
                    end_date: t2_3.start_date + 1.days,
                    parent_id: t2_3.id,
                    indent: 2)
    # wbs: 2.3.2
    t2_3_2 = create(:task,
                    batch: t2.batch,
                    duration: 1,
                    start_date: t2_3_1.start_date,
                    end_date: t2_3_1.start_date + 1.days,
                    parent_id: t2_3.id,
                    indent: 2)

    # wbs: 2.3.2.1
    t2_3_2_1 = create(:task,
                     batch: t2.batch,
                     duration: 1,
                     start_date: t2_3_2.start_date,
                     end_date: t2_3_2.start_date + 1.days,
                     parent_id: t2_3_2.id,
                     indent: 3)
    # wbs: 3
    t3 = create(:task,
                batch: t2.batch,
                duration: 10,
                start_date: t2.end_date,
                end_date: t2.end_date + 10.days,
                indent: 0)
    # wbs: 4
    t4 = create(:task,
                batch: t3.batch,
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

  it "should generate correct wbs" do
    tasks_wbs = GenerateWbs.generate(tasks)
    expect(tasks_wbs[0][:wbs]).to eq "1"
    expect(tasks_wbs[1][:wbs]).to eq "1.1"
    expect(tasks_wbs[2][:wbs]).to eq "1.2"
    expect(tasks_wbs[3][:wbs]).to eq "1.3"
    expect(tasks_wbs[4][:wbs]).to eq "2"
    expect(tasks_wbs[5][:wbs]).to eq "2.1"
    expect(tasks_wbs[6][:wbs]).to eq "2.2"
    expect(tasks_wbs[7][:wbs]).to eq "2.3"
    expect(tasks_wbs[8][:wbs]).to eq "2.3.1"
    expect(tasks_wbs[9][:wbs]).to eq "2.3.2"
    expect(tasks_wbs[10][:wbs]).to eq "2.3.2.1"
    expect(tasks_wbs[11][:wbs]).to eq "3"
    expect(tasks_wbs[12][:wbs]).to eq "4"
  end

  it "drop task 1.1 on 1.3 should change position to 1.3" do
    task_to_move = tasks[1] # 1.1
    drop_at_task = tasks[3] # 1.3

    cmd = Cultivation::UpdateTaskPosition.call(task_to_move.id,
                                               drop_at_task.id,
                                               current_user)

    # Verify position has been moved
    updated_tasks = Cultivation::Task.
      where(batch_id: task_to_move.batch_id).
      order_by(position: :asc)

    task_wbs = GenerateWbs.generate(updated_tasks)
    task_moved = task_wbs.detect { |t| t[:id] == task_to_move.id.to_s }
    position_task = task_wbs.detect { |t| t[:id] == drop_at_task.id.to_s }

    expect(cmd.success?).to eq true
    expect(task_moved[:wbs]).to eq "1.3"
    expect(position_task[:wbs]).to eq "1.2"
  end

  it "drop task 1.3 on 1.1 should change position to 1.2" do
    task_to_move = tasks[3] # 1.3
    drop_at_task = tasks[1] # 1.1

    cmd = Cultivation::UpdateTaskPosition.call(task_to_move.id,
                                               drop_at_task.id,
                                               current_user)

    # Verify position has been moved
    updated_tasks = Cultivation::Task.
      where(batch_id: task_to_move.batch_id).
      order_by(position: :asc)
    task_wbs = GenerateWbs.generate(updated_tasks)
    task_moved = task_wbs.detect { |t| t[:id] == task_to_move.id.to_s }
    position_task = task_wbs.detect { |t| t[:id] == drop_at_task.id.to_s }

    expect(cmd.success?).to eq true
    expect(task_moved[:wbs]).to eq "1.2"
    expect(position_task[:wbs]).to eq "1.1"
    expect(cmd.result.indent).to eq 1
    expect(cmd.result.parent_id).to eq tasks[0].id
  end

  it "move task 2.3.2 to below 2.3 (and become 2.3.1)" do
    task_to_move = tasks[9]
    drop_at_task = tasks[7]

    cmd = Cultivation::UpdateTaskPosition.call(task_to_move.id.to_s,
                                         drop_at_task.id.to_s,
                                         current_user)

    updated_tasks = Cultivation::Task.
      where(batch_id: task_to_move.batch_id).
      order_by(position: :asc)
    task_wbs = GenerateWbs.generate(updated_tasks)
    moved_task = task_wbs.detect { |t| t[:id] == task_to_move.id.to_s }
    position_task = task_wbs.detect { |t| t[:id] == drop_at_task.id.to_s }

    expect(moved_task[:wbs]).to eq "2.3.1"
    expect(position_task[:wbs]).to eq "2.3"
    expect(cmd.result.indent).to eq 2
    expect(cmd.result.parent_id).to eq position_task[:id].to_bson_id
  end

  it "drop task 2.3.2 on 1 should change position to 1.1" do
    task_to_move = tasks[9] # 2.3.2
    drop_at_task = tasks[0] # 1

    cmd = Cultivation::UpdateTaskPosition.call(task_to_move.id.to_s,
                                         drop_at_task.id.to_s,
                                         current_user)

    updated_tasks = Cultivation::Task.
      where(batch_id: task_to_move.batch_id).
      order_by(position: :asc)
    task_wbs = GenerateWbs.generate(updated_tasks)
    moved_task = task_wbs.detect { |t| t[:id] == task_to_move.id.to_s }
    position_task = task_wbs.detect { |t| t[:id] == drop_at_task.id.to_s }

    expect(moved_task[:wbs]).to eq "1.1"
    expect(position_task[:wbs]).to eq "1"
    expect(cmd.result.indent).to eq 1
    expect(cmd.result.parent_id).to eq position_task[:id].to_bson_id
  end

  it "drop task 2.3.2.1 on 3 should change position to 3.1" do
    task_to_move = tasks[10] # 2.3.2.1
    drop_at_task = tasks[11] # 3

    cmd = Cultivation::UpdateTaskPosition.call(task_to_move.id.to_s,
                                         drop_at_task.id.to_s,
                                         current_user)

    updated_tasks = Cultivation::Task.
      where(batch_id: task_to_move.batch_id).
      order_by(position: :asc)
    task_wbs = GenerateWbs.generate(updated_tasks)
    moved_task = task_wbs.detect { |t| t[:id] == task_to_move.id.to_s }
    position_task = task_wbs.detect { |t| t[:id] == drop_at_task.id.to_s }

    expect(moved_task[:wbs]).to eq "3.1"
    expect(position_task[:wbs]).to eq "3"
    expect(cmd.result.indent).to eq 1
    expect(cmd.result.parent_id).to eq position_task[:id].to_bson_id
  end

  it "drop task 2.3.2 to 2.3.1 should change wbs to 2.3.2" do
    task_to_move = tasks[9] # 2.3.2
    drop_at_task = tasks[8] # 2.3.1

    cmd = Cultivation::UpdateTaskPosition.call(task_to_move.id.to_s,
                                         drop_at_task.id,
                                         current_user)
    updated_tasks = Cultivation::Task.
      where(batch_id: task_to_move.batch_id).
      order_by(position: :asc)
    task_wbs = GenerateWbs.generate(updated_tasks)
    moved_task = task_wbs.detect { |t| t[:id] == task_to_move.id.to_s }

    expect(moved_task[:wbs]).to eq "2.3.2"
  end

  it "drop task 2.3.1 to 2.3.2 should change wbs to 2.3.1.1" do
    task_to_move = tasks[8] # 2.3.1
    drop_at_task = tasks[9] # 2.3.2

    cmd = Cultivation::UpdateTaskPosition.call(task_to_move.id.to_s,
                                         drop_at_task.id,
                                         current_user)
    updated_tasks = Cultivation::Task.
      where(batch_id: task_to_move.batch_id).
      order_by(position: :asc)
    task_wbs = GenerateWbs.generate(updated_tasks)
    moved_task = task_wbs.detect { |t| t[:id] == task_to_move.id.to_s }

    expect(moved_task[:wbs]).to eq "2.3.1.1"
  end

  it "drop task 2.3.2 on 2.2 should change wbs to 2.2.1" do
    task_to_move = tasks[9] # 2.3.2
    drop_at_task = tasks[6] # 2.2

    cmd = Cultivation::UpdateTaskPosition.call(task_to_move.id.to_s,
                                         drop_at_task.id,
                                         current_user)

    updated_tasks = Cultivation::Task.
      where(batch_id: task_to_move.batch_id).
      order_by(position: :asc)
    task_wbs = GenerateWbs.generate(updated_tasks)
    moved_task = task_wbs.detect { |t| t[:id] == task_to_move.id.to_s }
    position_task = task_wbs.detect { |t| t[:id] == drop_at_task.id.to_s }

    expect(moved_task[:wbs]).to eq "2.2.1"
    expect(position_task[:wbs]).to eq "2.2"
    expect(cmd.result.indent).to eq 2
    expect(cmd.result.parent_id).to eq position_task[:id].to_bson_id
  end

  it "drop task 3 on 2.3.2.1 should change position to 2.3.2.2" do
    task_to_move = tasks[11] # 3
    drop_at_task = tasks[10] # 2.3.2.1

    cmd = Cultivation::UpdateTaskPosition.call(task_to_move.id.to_s,
                                         drop_at_task.id.to_s,
                                         current_user)

    updated_tasks = Cultivation::Task.
      where(batch_id: task_to_move.batch_id).
      order_by(position: :asc)
    task_wbs = GenerateWbs.generate(updated_tasks)
    moved_task = task_wbs.detect { |t| t[:id] == task_to_move.id.to_s }
    position_task = task_wbs.detect { |t| t[:id] == drop_at_task.id.to_s }

    expect(moved_task[:wbs]).to eq "2.3.2.2"
    expect(position_task[:wbs]).to eq "2.3.2.1"
    expect(cmd.result.indent).to eq 3
    expect(cmd.result.parent_id).to eq tasks[9].id
  end

  it "drop task 3 on 1 should change position to 1.1" do
    task_to_move = tasks[11]
    drop_at_task = tasks[0]

    cmd = Cultivation::UpdateTaskPosition.call(task_to_move.id.to_s,
                                         drop_at_task.id,
                                         current_user)

    updated_tasks = Cultivation::Task.
      where(batch_id: task_to_move.batch_id).
      order_by(position: :asc)
    task_wbs = GenerateWbs.generate(updated_tasks)
    moved_task = task_wbs.detect { |t| t[:id] == task_to_move.id.to_s }

    expect(moved_task[:wbs]).to eq "1.1"
    expect(cmd.result.parent_id).to eq drop_at_task.id
  end

  it "cannot move indelible task" do
    task_to_move = tasks[12]
    drop_at_task = tasks[10]

    cmd = Cultivation::UpdateTaskPosition.call(task_to_move.id,
                                               drop_at_task.id,
                                               current_user)

    expect(cmd.success?).to eq false
    expect(cmd.errors[:error][0]).not_to be nil
  end
end
