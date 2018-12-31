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
    tasks_wbs = WbsTree.generate(tasks)
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

  it "Cond A - Drop task 1.1 on 1.3" do
    task_to_move = tasks[1] # 1.1
    drop_at_task = tasks[3] # 1.3

    cmd = Cultivation::UpdateTaskPosition.call(task_to_move.id,
                                               drop_at_task.id,
                                               current_user)

    updated_tasks = Cultivation::QueryTasks.call(task_to_move.batch).result
    task_moved = updated_tasks.detect { |t| t.id == task_to_move.id }
    position_task = updated_tasks.detect { |t| t.id == drop_at_task.id }

    expect(cmd.success?).to eq true
    expect(task_moved.wbs).to eq "1.3"
    expect(position_task.wbs).to eq "1.2"
  end

  it "Cond B - Drop task 1.3 on 1.1 to reorder" do
    t1_1 = tasks[1] # 1.1
    t1_2 = tasks[2] # 1.2
    t1_3 = tasks[3] # 1.3

    cmd = Cultivation::UpdateTaskPosition.call(t1_3.id, t1_1.id, current_user)

    # Verify position has been moved
    updated_tasks = Cultivation::QueryTasks.call(t1_3.batch).result
    t_moved = updated_tasks.detect { |t| t.id == t1_3.id }
    t_droped = updated_tasks.detect { |t| t.id == t1_1.id }
    t_follow = updated_tasks.detect { |t| t.id == t1_2.id }

    expect(cmd.success?).to eq true
    expect(t_moved.wbs).to eq "1.2"
    expect(t_droped.wbs).to eq "1.1"
    expect(t_follow.wbs).to eq "1.3"
    expect(cmd.result.indent).to eq 1
    expect(cmd.result.parent_id).to eq tasks[0].id
  end

  it "Cond C - Drop task 2.3.2 on 2.3" do
    task_to_move = tasks[9]
    drop_at_task = tasks[7]

    cmd = Cultivation::UpdateTaskPosition.call(task_to_move.id.to_s,
                                         drop_at_task.id.to_s,
                                         current_user)

    updated_tasks = Cultivation::QueryTasks.call(task_to_move.batch).result
    t_moved = updated_tasks.detect { |t| t.id == task_to_move.id }
    t_droped = updated_tasks.detect { |t| t.id == drop_at_task.id }
    t_follow = updated_tasks.detect { |t| t.id == tasks[8].id }

    expect(t_moved.wbs).to eq "2.3.1"
    expect(t_follow.wbs).to eq "2.3.2"
    expect(t_droped.wbs).to eq "2.3"
    expect(cmd.result.indent).to eq 2
    expect(cmd.result.parent_id).to eq t_droped.id
  end

  it "Cond D - Drop task 2.3.2 on 1", focus: true do
    task_to_move = tasks[9] # 2.3.2
    drop_at_task = tasks[0] # 1

    cmd = Cultivation::UpdateTaskPosition.call(task_to_move.id.to_s,
                                         drop_at_task.id.to_s,
                                         current_user)

    updated_tasks = Cultivation::QueryTasks.call(task_to_move.batch).result
    t_moved = updated_tasks.detect { |t| t.id == task_to_move.id }
    t_child = updated_tasks.detect { |t| t.id == tasks[10].id }
    t_droped = updated_tasks.detect { |t| t.id == drop_at_task.id }
    t_follow = updated_tasks.detect { |t| t.id == tasks[1].id }

    expect(t_moved.wbs).to eq "1.1"
    expect(t_follow.wbs).to eq "1.2"
    expect(t_droped.wbs).to eq "1"
    expect(t_child.wbs).to eq "1.1.1"
    expect(t_child.indent).to eq 2
    expect(cmd.result.indent).to eq 1
    expect(cmd.result.parent_id).to eq t_droped.id
  end

  it "Cond E - Drop task 2.3.2.1 on 3" do
    task_to_move = tasks[10] # 2.3.2.1
    drop_at_task = tasks[11] # 3

    cmd = Cultivation::UpdateTaskPosition.call(task_to_move.id.to_s,
                                         drop_at_task.id.to_s,
                                         current_user)

    updated_tasks = Cultivation::Task.
      where(batch_id: task_to_move.batch_id).
      order_by(position: :asc)
    task_wbs = WbsTree.generate(updated_tasks)
    moved_task = task_wbs.detect { |t| t[:id] == task_to_move.id.to_s }
    position_task = task_wbs.detect { |t| t[:id] == drop_at_task.id.to_s }

    expect(moved_task[:wbs]).to eq "3.1"
    expect(position_task[:wbs]).to eq "3"
    expect(cmd.result.indent).to eq 1
    expect(cmd.result.parent_id).to eq position_task[:id].to_bson_id
  end

  it "Cond F - Drop task 2.3.2 to 2.3.1" do
    task_to_move = tasks[9] # 2.3.2
    drop_at_task = tasks[8] # 2.3.1

    cmd = Cultivation::UpdateTaskPosition.call(task_to_move.id.to_s,
                                         drop_at_task.id,
                                         current_user)
    updated_tasks = Cultivation::Task.
      where(batch_id: task_to_move.batch_id).
      order_by(position: :asc)
    task_wbs = WbsTree.generate(updated_tasks)
    moved_task = task_wbs.detect { |t| t[:id] == task_to_move.id.to_s }

    expect(moved_task[:wbs]).to eq "2.3.2"
    expect(cmd.result.indent).to eq 2
  end

  it "Cond G - Drop task 2.3.1 to 2.3.2" do
    task_to_move = tasks[8] # 2.3.1
    drop_at_task = tasks[9] # 2.3.2

    cmd = Cultivation::UpdateTaskPosition.call(task_to_move.id.to_s,
                                         drop_at_task.id,
                                         current_user)
    updated_tasks = Cultivation::Task.
      where(batch_id: task_to_move.batch_id).
      order_by(position: :asc)
    task_wbs = WbsTree.generate(updated_tasks)
    moved_task = task_wbs.detect { |t| t[:id] == task_to_move.id.to_s }

    expect(moved_task[:wbs]).to eq "2.3.1.1"
    expect(cmd.result.indent).to eq 3
  end

  it "Cond H - Drop task 2.3.2 on 2.2" do
    task_to_move = tasks[9] # 2.3.2
    drop_at_task = tasks[6] # 2.2

    cmd = Cultivation::UpdateTaskPosition.call(task_to_move.id.to_s,
                                         drop_at_task.id,
                                         current_user)

    updated_tasks = Cultivation::Task.
      where(batch_id: task_to_move.batch_id).
      order_by(position: :asc)
    task_wbs = WbsTree.generate(updated_tasks)
    moved_task = task_wbs.detect { |t| t[:id] == task_to_move.id.to_s }
    position_task = task_wbs.detect { |t| t[:id] == drop_at_task.id.to_s }

    expect(moved_task[:wbs]).to eq "2.2.1"
    expect(position_task[:wbs]).to eq "2.2"
    expect(cmd.result.indent).to eq 2
    expect(cmd.result.parent_id).to eq position_task[:id].to_bson_id
  end

  it "Cond I - Drop task 3 on 2.3.2.1" do
    task_to_move = tasks[11] # 3
    drop_at_task = tasks[10] # 2.3.2.1

    cmd = Cultivation::UpdateTaskPosition.call(task_to_move.id.to_s,
                                         drop_at_task.id.to_s,
                                         current_user)

    updated_tasks = Cultivation::Task.
      where(batch_id: task_to_move.batch_id).
      order_by(position: :asc)
    task_wbs = WbsTree.generate(updated_tasks)
    moved_task = task_wbs.detect { |t| t[:id] == task_to_move.id.to_s }
    position_task = task_wbs.detect { |t| t[:id] == drop_at_task.id.to_s }

    expect(moved_task[:wbs]).to eq "2.3.2.2"
    expect(position_task[:wbs]).to eq "2.3.2.1"
    expect(cmd.result.indent).to eq 3
    expect(cmd.result.parent_id).to eq tasks[9].id
  end

  it "Cond J - Drop task 3 on 1" do
    task_to_move = tasks[11]
    drop_at_task = tasks[0]

    cmd = Cultivation::UpdateTaskPosition.call(task_to_move.id.to_s,
                                         drop_at_task.id,
                                         current_user)

    updated_tasks = Cultivation::Task.
      where(batch_id: task_to_move.batch_id).
      order_by(position: :asc)
    task_wbs = WbsTree.generate(updated_tasks)
    moved_task = task_wbs.detect { |t| t[:id] == task_to_move.id.to_s }

    expect(moved_task[:wbs]).to eq "2"
    expect(cmd.result.parent_id).to eq drop_at_task.id
  end

  it "Cond K - cannot move indelible task" do
    task_to_move = tasks[12]
    drop_at_task = tasks[10]

    cmd = Cultivation::UpdateTaskPosition.call(task_to_move.id,
                                               drop_at_task.id,
                                               current_user)

    expect(cmd.success?).to eq false
    expect(cmd.errors[:error][0]).not_to be nil
  end
end
