require 'rails_helper'

RSpec.describe "WbsTree", type: :lib do
  context "given list of tasks" do
    let(:tasks) do
      tasks = []
      tasks << Cultivation::Task.new(name: 'Clone Phase', indent: 0) # 0
      tasks << Cultivation::Task.new(name: 'Preparation', indent: 1) # 1
      tasks << Cultivation::Task.new(name: 'Prepare trays and cups', indent: 2) # 2
      tasks << Cultivation::Task.new(name: 'Grow Period', indent: 1) # 3
      tasks << Cultivation::Task.new(name: 'Daily monitoring', indent: 2) # 4
      tasks << Cultivation::Task.new(name: 'Veg 1', indent: 0) # 5
      tasks << Cultivation::Task.new(name: 'Grow Period', indent: 1) # 6
      tasks << Cultivation::Task.new(name: 'Check on water system', indent: 2) # 7
      tasks << Cultivation::Task.new(name: 'Add Nutrient', indent: 2) # 8
      tasks << Cultivation::Task.new(name: 'Week 1', indent: 3) # 9
      tasks << Cultivation::Task.new(name: 'Week 2', indent: 3) # 10
      tasks << Cultivation::Task.new(name: 'Something', indent: 1) # 11
      tasks << Cultivation::Task.new(name: 'Something sub 1', indent: 2) # 12
      tasks << Cultivation::Task.new(name: 'Something sub 2', indent: 2) # 13
      tasks << Cultivation::Task.new(name: 'Sub Week 1', indent: 3) # 14
      tasks << Cultivation::Task.new(name: 'Sub Week 2', indent: 3) # 15
    end

    describe ".generate" do
      it "should return same number of tasks" do
        result = WbsTree.generate(tasks)

        expect(result.length).to eq tasks.length
      end

      it "should return root level wbs" do
        result = WbsTree.generate(tasks)

        expect(result[0][:wbs]).to eq "1"
        expect(result[5][:wbs]).to eq "2"
      end

      it "should return 2nd level wbs" do
        result = WbsTree.generate(tasks)

        expect(result[1][:wbs]).to eq "1.1"
        expect(result[6][:wbs]).to eq "2.1"
      end

      it "should return 3rd level wbs" do
        result = WbsTree.generate(tasks)

        expect(result[2][:wbs]).to eq "1.1.1"
        expect(result[4][:wbs]).to eq "1.2.1"
        expect(result[12][:wbs]).to eq "2.2.1"
        expect(result[13][:wbs]).to eq "2.2.2"
      end

      it "should return 4th level wbs" do
        result = WbsTree.generate(tasks)

        expect(result[9][:wbs]).to eq "2.1.2.1"
        expect(result[10][:wbs]).to eq "2.1.2.2"
        expect(result[14][:wbs]).to eq "2.2.2.1"
        expect(result[15][:wbs]).to eq "2.2.2.2"
      end
    end
  end

  context "given list of tasks with wbs" do
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

    it ".children should return all child nodes" do
      saved_tasks = Cultivation::QueryTasks.call(tasks[0].batch).result

      children = WbsTree.children(saved_tasks, "1")
      children2 = WbsTree.children(saved_tasks, "2.3.2.1")

      expect(children.length).to eq 3
      expect(children2.length).to eq 0
    end

    it ".parent should return parent" do
      saved_tasks = Cultivation::QueryTasks.call(tasks[0].batch).result

      parent1 = WbsTree.parent(saved_tasks, "2.3.2.1")
      parent2 = WbsTree.parent(saved_tasks, "2.3.2")
      parent3 = WbsTree.parent(saved_tasks, "2.3")
      parent4 = WbsTree.parent(saved_tasks, "2")
      parent5 = WbsTree.parent(saved_tasks, nil)
      parent6 = WbsTree.parent([], nil)

      expect(parent1.wbs).to eq "2.3.2"
      expect(parent2.wbs).to eq "2.3"
      expect(parent3.wbs).to eq "2"
      expect(parent4&.wbs).to be nil
      expect(parent5&.wbs).to be nil
      expect(parent6&.wbs).to be nil
    end

    it ".have_children should return boolean" do
      saved_tasks = Cultivation::QueryTasks.call(tasks[0].batch).result

      res1 = WbsTree.have_children?(saved_tasks[0].wbs, saved_tasks)
      res2 = WbsTree.have_children?(saved_tasks[1].wbs, saved_tasks)

      expect(res1).to be true
      expect(res2).to be false
    end

    it ".child_of? should return true" do
      saved_tasks = Cultivation::QueryTasks.call(tasks[0].batch).result
      t1 = saved_tasks[0] # 1
      target = saved_tasks[2] # 1.2

      result = WbsTree.child_of?(target.wbs, t1.wbs, saved_tasks)
      expect(result).to be true
    end

    it ".child_of? should return true (deeply nested)" do
      saved_tasks = Cultivation::QueryTasks.call(tasks[0].batch).result
      grand_parent = saved_tasks[4] # 2
      target = saved_tasks[10] # 2.3.2.1

      result = WbsTree.child_of?(target.wbs, grand_parent.wbs, saved_tasks)
      expect(result).to be true
    end

    it ".child_of? should return false" do
      saved_tasks = Cultivation::QueryTasks.call(tasks[0].batch).result
      t1 = saved_tasks[0] # 1
      target = saved_tasks[5] # 2.2

      result = WbsTree.child_of?(target.wbs, t1.wbs, saved_tasks)
      expect(result).to be false
    end
  end
end
