require 'rails_helper'

RSpec.describe "GenerateWbs", type: :lib do
  context "given list of tasks" do
    let(:tasks) {
      tasks = []
      tasks << Cultivation::Task.new(name: 'Clone Phase', indent: 0)            # 0
      tasks << Cultivation::Task.new(name: 'Preparation', indent: 1)            # 1
      tasks << Cultivation::Task.new(name: 'Prepare trays and cups', indent: 2) # 2
      tasks << Cultivation::Task.new(name: 'Grow Period', indent: 1)            # 3
      tasks << Cultivation::Task.new(name: 'Daily monitoring', indent: 2)       # 4
      tasks << Cultivation::Task.new(name: 'Veg 1', indent: 0)                  # 5
      tasks << Cultivation::Task.new(name: 'Grow Period', indent: 1)            # 6
      tasks << Cultivation::Task.new(name: 'Check on water system', indent: 2)  # 7
      tasks << Cultivation::Task.new(name: 'Add Nutrient', indent: 2)           # 8
      tasks << Cultivation::Task.new(name: 'Week 1', indent: 3)                 # 9
      tasks << Cultivation::Task.new(name: 'Week 2', indent: 3)                 # 10
      tasks << Cultivation::Task.new(name: 'Something', indent: 1)              # 11
      tasks << Cultivation::Task.new(name: 'Something sub 1', indent: 2)        # 12
      tasks << Cultivation::Task.new(name: 'Something sub 2', indent: 2)        # 13
      tasks << Cultivation::Task.new(name: 'Sub Week 1', indent: 3)             # 14
      tasks << Cultivation::Task.new(name: 'Sub Week 2', indent: 3)             # 15
    }

    describe ".generate" do
      it "should return same number of tasks" do
        result = GenerateWbs.generate(tasks)

        expect(result.length).to eq tasks.length
      end

      it "should return root level wbs" do
        result = GenerateWbs.generate(tasks)

        expect(result[0][:wbs]).to eq "1"
        expect(result[5][:wbs]).to eq "2"
      end

      it "should return 2nd level wbs" do
        result = GenerateWbs.generate(tasks)

        expect(result[1][:wbs]).to eq "1.1"
        expect(result[6][:wbs]).to eq "2.1"
      end

      it "should return 3rd level wbs" do
        result = GenerateWbs.generate(tasks)

        expect(result[2][:wbs]).to eq "1.1.1"
        expect(result[4][:wbs]).to eq "1.2.1"
        expect(result[12][:wbs]).to eq "2.2.1"
        expect(result[13][:wbs]).to eq "2.2.2"
      end

      it "should return 4th level wbs" do
        result = GenerateWbs.generate(tasks)

        expect(result[9][:wbs]).to eq "2.1.2.1"
        expect(result[10][:wbs]).to eq "2.1.2.2"
        expect(result[14][:wbs]).to eq "2.2.2.1"
        expect(result[15][:wbs]).to eq "2.2.2.2"
      end
    end
  end
end
