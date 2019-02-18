require 'rails_helper'

RSpec.describe Cultivation::UpdateTaskPosition, type: :command do
  subject(:current_user) { create(:user) }
  subject!(:tasks) do
    # wbs: 1
    t1 = create(:task,
                name: "Task 1",
                indent: 0)
    # wbs: 1.1
    t1_1 = create(:task,
                  batch: t1.batch,
                  name: "Task 1.1",
                  duration: 5,
                  start_date: t1.start_date,
                  end_date: t1.start_date + 5.days,
                  indent: 1)
    # wbs: 1.2
    t1_2 = create(:task,
                  batch: t1.batch,
                  name: "Task 1.2",
                  duration: 2,
                  start_date: t1.start_date + 1.days,
                  end_date: t1.start_date + 3.days,
                  indent: 1)
    # wbs: 1.3
    t1_3 = create(:task,
                  batch: t1.batch,
                  name: "Task 1.3",
                  duration: 1,
                  start_date: t1.start_date + 2.days,
                  end_date: t1.start_date + 3.days,
                  indent: 1)
    # wbs: 2
    t2 = create(:task,
                batch: t1.batch,
                name: "Task 2",
                duration: 5,
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
                  duration: 2,
                  start_date: t2_1.end_date,
                  end_date: t2_1.end_date + 2.days,
                  indent: 1)
    # wbs: 2.3.1
    t2_3_1 = create(:task,
                    batch: t2.batch,
                    name: "Task 2.3.1",
                    duration: 1,
                    start_date: t2_3.start_date,
                    end_date: t2_3.start_date + 1.days,
                    indent: 2)
    # wbs: 2.3.2
    t2_3_2 = create(:task,
                    batch: t2.batch,
                    name: "Task 2.3.2",
                    duration: 1,
                    start_date: t2_3_1.start_date,
                    end_date: t2_3_1.start_date + 1.days,
                    indent: 2)

    # wbs: 2.3.2.1
    t2_3_2_1 = create(:task,
                     batch: t2.batch,
                     name: "Task 2.3.2.1",
                     duration: 1,
                     start_date: t2_3_2.start_date,
                     end_date: t2_3_2.start_date + 1.days,
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
    t_moved = updated_tasks.detect { |t| t.id == task_to_move.id }
    t_dropped = updated_tasks.detect { |t| t.id == drop_at_task.id }
    t_follow = updated_tasks.detect { |t| t.id == tasks[2].id }

    expect(cmd.success?).to eq true
    expect(t_moved.wbs).to eq "1.3"
    expect(t_moved.position).to eq 3
    expect(t_follow.wbs).to eq "1.1"
    expect(t_dropped.wbs).to eq "1.2"
  end

  it "Cond B - Drop task 1.3 on 1.1 to reorder" do
    t1_1 = tasks[1] # 1.1
    t1_2 = tasks[2] # 1.2
    t1_3 = tasks[3] # 1.3

    cmd = Cultivation::UpdateTaskPosition.call(t1_3.id, t1_1.id, current_user)

    # Verify position has been moved
    updated_tasks = Cultivation::QueryTasks.call(t1_3.batch).result
    t_moved = updated_tasks.detect { |t| t.id == t1_3.id }
    t_dropped = updated_tasks.detect { |t| t.id == t1_1.id }
    t_follow = updated_tasks.detect { |t| t.id == t1_2.id }

    expect(cmd.success?).to eq true
    expect(t_moved.wbs).to eq "1.2"
    expect(t_moved.position).to eq 2
    expect(t_follow.wbs).to eq "1.3"
    expect(t_follow.position).to eq 3
    expect(t_dropped.wbs).to eq "1.1"
    expect(cmd.result.indent).to eq 1
  end

  it "Cond C - Drop task 2.3.2 on 2.3" do
    task_to_move = tasks[9]
    drop_at_task = tasks[7]

    cmd = Cultivation::UpdateTaskPosition.call(task_to_move.id.to_s,
                                         drop_at_task.id.to_s,
                                         current_user)

    updated_tasks = Cultivation::QueryTasks.call(task_to_move.batch).result
    t_moved = updated_tasks.detect { |t| t.id == task_to_move.id }
    t_dropped = updated_tasks.detect { |t| t.id == drop_at_task.id }
    t_follow = updated_tasks.detect { |t| t.id == tasks[8].id }

    expect(t_moved.wbs).to eq "2.3.1"
    expect(t_follow.wbs).to eq "2.3.2"
    expect(t_dropped.wbs).to eq "2.3"
    expect(cmd.result.indent).to eq 2
  end

  it "Cond D - Drop task 2.3.2 on 1" do
    task_to_move = tasks[9] # 2.3.2
    drop_at_task = tasks[0] # 1

    cmd = Cultivation::UpdateTaskPosition.call(task_to_move.id.to_s,
                                         drop_at_task.id.to_s,
                                         current_user)

    updated_tasks = Cultivation::QueryTasks.call(task_to_move.batch).result
    t_moved = updated_tasks.detect { |t| t.id == task_to_move.id }
    t_child = updated_tasks.detect { |t| t.id == tasks[10].id }
    t_dropped = updated_tasks.detect { |t| t.id == drop_at_task.id }
    t_follow = updated_tasks.detect { |t| t.id == tasks[1].id }

    expect(t_moved.wbs).to eq "1.1"
    expect(t_follow.wbs).to eq "1.2"
    expect(t_dropped.wbs).to eq "1"
    expect(t_child.wbs).to eq "1.1.1"
    expect(t_child.indent).to eq 2
    expect(cmd.result.indent).to eq 1
  end

  it "Cond E - Drop task 2.3.2.1 on 3" do
    task_to_move = tasks[10] # 2.3.2.1
    drop_at_task = tasks[11] # 3

    Cultivation::UpdateTaskPosition.call(task_to_move.id.to_s,
                                         drop_at_task.id.to_s,
                                         current_user)

    updated_tasks = Cultivation::QueryTasks.call(task_to_move.batch).result
    t_moved = updated_tasks.detect { |t| t.id == task_to_move.id }
    t_dropped = updated_tasks.detect { |t| t.id == drop_at_task.id }
    t_follow = updated_tasks.detect { |t| t.id == tasks[12].id }

    expect(t_moved.wbs).to eq "3.1"
    expect(t_moved.indent).to eq 1
    expect(t_dropped.wbs).to eq "3"
    expect(t_follow.wbs).to eq "4"
  end

  it "Cond F - Drop task 2.3.2 to 2.3.1" do
    task_to_move = tasks[9] # 2.3.2
    drop_at_task = tasks[8] # 2.3.1

    Cultivation::UpdateTaskPosition.call(task_to_move.id.to_s,
                                         drop_at_task.id,
                                         current_user)

    updated_tasks = Cultivation::QueryTasks.call(task_to_move.batch).result
    t_moved = updated_tasks.detect { |t| t.id == task_to_move.id }
    t_dropped = updated_tasks.detect { |t| t.id == drop_at_task.id }

    expect(t_moved.wbs).to eq "2.3.2"
    expect(t_moved.indent).to eq 2
    expect(t_dropped.wbs).to eq "2.3.1"
    expect(t_dropped.indent).to eq 2
  end

  it "Cond G - Drop task 2.3.1 to 2.3.2" do
    task_to_move = tasks[8] # 2.3.1
    drop_at_task = tasks[9] # 2.3.2

    Cultivation::UpdateTaskPosition.call(task_to_move.id.to_s,
                                         drop_at_task.id,
                                         current_user)

    updated_tasks = Cultivation::QueryTasks.call(task_to_move.batch).result
    t_moved = updated_tasks.detect { |t| t.id == task_to_move.id }
    t_dropped = updated_tasks.detect { |t| t.id == drop_at_task.id }
    t_follow = updated_tasks.detect { |t| t.id == tasks[10].id }

    expect(t_moved.wbs).to eq "2.3.2"
    expect(t_moved.indent).to eq 2
    expect(t_moved.position).to eq 10
    expect(t_dropped.wbs).to eq "2.3.1"
    expect(t_follow.wbs).to eq "2.3.1.1"
    expect(t_follow.position).to eq 9
  end

  it "Cond H - Drop task 2.3.2 on 2.2" do
    task_to_move = tasks[9] # 2.3.2
    drop_at_task = tasks[6] # 2.2

    cmd = Cultivation::UpdateTaskPosition.call(task_to_move.id.to_s,
                                         drop_at_task.id,
                                         current_user)

    updated_tasks = Cultivation::QueryTasks.call(task_to_move.batch).result
    t_moved = updated_tasks.detect { |t| t.id == task_to_move.id }
    t_dropped = updated_tasks.detect { |t| t.id == drop_at_task.id }
    t_follow = updated_tasks.detect { |t| t.id == tasks[10].id }

    expect(t_moved.wbs).to eq "2.2.1"
    expect(t_moved.position).to eq 7
    expect(t_dropped.wbs).to eq "2.2"
    expect(t_follow.wbs).to eq "2.2.1.1"
    expect(t_follow.position).to eq 8
    expect(cmd.result.indent).to eq 2
  end

  it "Cond I - Drop task 3 on 2.3.2.1" do
    task_to_move = tasks[11] # 3
    drop_at_task = tasks[10] # 2.3.2.1

    cmd = Cultivation::UpdateTaskPosition.call(task_to_move.id.to_s,
                                         drop_at_task.id.to_s,
                                         current_user)

    updated_tasks = Cultivation::QueryTasks.call(task_to_move.batch).result
    t_moved = updated_tasks.detect { |t| t.id == task_to_move.id }
    t_dropped = updated_tasks.detect { |t| t.id == drop_at_task.id }

    expect(t_moved.wbs).to eq "3"
    expect(t_dropped.wbs).to eq "2.3.2.1"
    expect(cmd.result.indent).to eq 0
  end

  it "Cond J - Drop task 3 on 1" do
    task_to_move = tasks[11]
    drop_at_task = tasks[0]

    Cultivation::UpdateTaskPosition.call(task_to_move.id.to_s,
                                         drop_at_task.id,
                                         current_user)

    updated_tasks = Cultivation::QueryTasks.call(task_to_move.batch).result
    t_moved = updated_tasks.detect { |t| t.id == task_to_move.id }
    t_follow = updated_tasks.detect { |t| t.id == tasks[4].id }

    expect(t_moved.wbs).to eq "2"
    expect(t_moved.position).to eq 4
    expect(t_follow.wbs).to eq "3"
    expect(t_follow.position).to eq 5
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

  it "Cond L - Drop 2.3 on 3" do
    task_to_move = tasks[7]  # 2.3
    drop_at_task = tasks[11] # 3

    Cultivation::UpdateTaskPosition.call(task_to_move.id.to_s,
                                         drop_at_task.id,
                                         current_user)

    updated_tasks = Cultivation::QueryTasks.call(task_to_move.batch).result
    t_moved = updated_tasks.detect { |t| t.id == task_to_move.id }
    t_dropped = updated_tasks.detect { |t| t.id == drop_at_task.id }
    t_follow = updated_tasks.detect { |t| t.id == tasks[10].id }

    expect(t_moved.wbs).to eq "3.1"
    expect(t_moved.position).to eq 8
    expect(t_dropped.wbs).to eq "3"
    expect(t_dropped.position).to eq 7
    expect(t_follow.wbs).to eq "3.1.2.1"
  end

  it "Cond M - Drop 2 on 3" do
    task_to_move = tasks[4]  # 2
    drop_at_task = tasks[11] # 3

    Cultivation::UpdateTaskPosition.call(task_to_move.id.to_s,
                                         drop_at_task.id,
                                         current_user)

    updated_tasks = Cultivation::QueryTasks.call(task_to_move.batch).result
    t_moved = updated_tasks.detect { |t| t.id == task_to_move.id }
    t_dropped = updated_tasks.detect { |t| t.id == drop_at_task.id }
    t_follow = updated_tasks.detect { |t| t.id == tasks[7].id }

    expect(t_moved.wbs).to eq "3"
    expect(t_moved.position).to eq 5
    expect(t_dropped.wbs).to eq "2"
    expect(t_dropped.position).to eq 4
    expect(t_follow.wbs).to eq "3.3"
    expect(t_follow.position).to eq 8
  end

  it "Cond N - Drop 2.3 on 1" do
    task_to_move = tasks[7]  # 2.3
    drop_at_task = tasks[0]  # 1

    Cultivation::UpdateTaskPosition.call(task_to_move.id.to_s,
                                         drop_at_task.id,
                                         current_user)

    updated_tasks = Cultivation::QueryTasks.call(task_to_move.batch).result
    t_moved = updated_tasks.detect { |t| t.id == task_to_move.id }
    t_follow = updated_tasks.detect { |t| t.id == tasks[1].id }

    expect(t_moved.wbs).to eq "1.1"
    expect(t_moved.position).to eq 1
    expect(t_follow.wbs).to eq "1.2"
    expect(t_follow.position).to eq 5
  end

  it "Cond O - Drop 2.1 on 2.3.2" do
    task_to_move = tasks[5]
    drop_at_task = tasks[9]

    cmd = Cultivation::UpdateTaskPosition.call(task_to_move.id.to_s,
                                               drop_at_task.id,
                                               current_user)

    updated_tasks = Cultivation::QueryTasks.call(task_to_move.batch).result
    t_moved = updated_tasks.detect { |t| t.id == task_to_move.id }
    t_dropped = updated_tasks.detect { |t| t.id == drop_at_task.id }
    t_follow = updated_tasks.detect { |t| t.id == tasks[6].id }

    expect(cmd.success?).to be true
    expect(t_moved.wbs).to eq "2.3"
    expect(t_moved.position).to eq 10
    expect(t_follow.wbs).to eq "2.1"
    expect(t_follow.position).to eq 5
    expect(t_dropped.wbs).to eq "2.2.2"
    expect(t_dropped.position).to eq 8
  end
end
