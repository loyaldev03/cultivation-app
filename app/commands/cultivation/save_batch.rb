module Cultivation
  class SaveBatch
    prepend SimpleCommand

    attr_reader :args

    def initialize(args)
      @args = args
    end

    def call
      save_record(@args)
    end

    private

    def task_templates
      [
        {:phase=>"Clone", :task_category=>"", :name=>"", :days=>17, :days_from_start_date=>0, :expected_hours_taken=>nil, :no_of_employees=>nil, :materials=>nil, :isPhase=>"true"},
        {:phase=>"Clone", :task_category=>"Prepare", :name=>"Prepare Sample", :days=>1, :days_from_start_date=>0, :expected_hours_taken=>nil, :no_of_employees=>nil, :materials=>nil, :isPhase=>"false"},
        {:phase=>"Clone", :task_category=>"Prepare", :name=>"Fill Cloner w/ Water", :days=>1, :days_from_start_date=>0, :expected_hours_taken=>0.25, :no_of_employees=>1, :materials=>"Water, Gloves", :isPhase=>"false"},
        {:phase=>"Clone", :task_category=>"Prepare", :name=>"Mix Nutrients", :days=>1, :days_from_start_date=>0, :expected_hours_taken=>0.25, :no_of_employees=>1, :materials=>"Nutrients, MicroNutrients, Gloves", :isPhase=>"false"}, 
        {:phase=>"Clone", :task_category=>"Prepare", :name=>"Place Collars", :days=>1, :days_from_start_date=>0, :expected_hours_taken=>0.25, :no_of_employees=>1, :materials=>"Collars, ", :isPhase=>"false"},
        {:phase=>"Clone", :task_category=>"Clone", :name=>"Clone", :days=>1, :days_from_start_date=>2, :expected_hours_taken=>nil, :no_of_employees=>nil, :materials=>nil, :isPhase=>"false"},
        {:phase=>"Clone", :task_category=>"Clone", :name=>"Get Mother Plant", :days=>1, :days_from_start_date=>2, :expected_hours_taken=>0.1, :no_of_employees=>1, :materials=>nil, :isPhase=>"false"},
        {:phase=>"Clone", :task_category=>"Clone", :name=>"Cut, Dip & Place", :days=>1, :days_from_start_date=>2, :expected_hours_taken=>6.8, :no_of_employees=>3, :materials=>"Clone Gel, Razors, Exacto Knife, Bags", :isPhase=>"false"},
        {:phase=>"Clone", :task_category=>"Clean", :name=>"Clean", :days=>1, :days_from_start_date=>4, :expected_hours_taken=>nil, :no_of_employees=>nil, :materials=>nil, :isPhase=>"false"},
        {:phase=>"Clone", :task_category=>"Clean", :name=>"Return Mother Plant", :days=>1, :days_from_start_date=>4, :expected_hours_taken=>0.1, :no_of_employees=>1, :materials=>nil, :isPhase=>"false"},
        {:phase=>"Clone", :task_category=>"Clean", :name=>"Clean and Return Supplies", :days=>1, :days_from_start_date=>4, :expected_hours_taken=>0.25, :no_of_employees=>1, :materials=>"Gloves, Paper Towels, Cleaner, Broom", :isPhase=>"false"},
        {:phase=>"Clone", :task_category=>"Waiting", :name=>"Waiting", :days=>11, :days_from_start_date=>6, :expected_hours_taken=>nil, :no_of_employees=>nil, :materials=>nil, :isPhase=>"false"},
        {:phase=>"VEG1", :task_category=>"", :name=>"", :days=>14, :days_from_start_date=>18, :expected_hours_taken=>nil, :no_of_employees=>nil, :materials=>nil, :isPhase=>"true"},
        {:phase=>"VEG1", :task_category=>"Plant", :name=>"Plant Clone and Loose into Rockwool", :days=>1, :days_from_start_date=>18, :expected_hours_taken=>nil, :no_of_employees=>nil, :materials=>nil, :isPhase=>"false"},
        {:phase=>"VEG1", :task_category=>"Plant", :name=>"Unpack Rockwool Boxes", :days=>1, :days_from_start_date=>18, :expected_hours_taken=>0.1, :no_of_employees=>2, :materials=>"Rockwool, Cutters, Gloves", :isPhase=>"false"},
        {:phase=>"VEG1", :task_category=>"Plant", :name=>"Mix “Loose” Rockwool and Water", :days=>1, :days_from_start_date=>18, :expected_hours_taken=>0.5, :no_of_employees=>2, :materials=>"Rockwool, Cutters, Water, Nutrients, Micronutrients", :isPhase=>"false"},
        {:phase=>"VEG1", :task_category=>"Plant", :name=>"Get EZ Cloner", :days=>1, :days_from_start_date=>18, :expected_hours_taken=>0.1, :no_of_employees=>1, :materials=>nil, :isPhase=>"false"},
        {:phase=>"VEG1", :task_category=>"Plant", :name=>"Plant Clone and Loose into Rockwool", :days=>1, :days_from_start_date=>18, :expected_hours_taken=>6, :no_of_employees=>3, :materials=>"Gloves", :isPhase=>"false"},
        {:phase=>"VEG1", :task_category=>"Plant", :name=>"Place Drip Square and Connect Hose ", :days=>1, :days_from_start_date=>18, :expected_hours_taken=>1, :no_of_employees=>2, :materials=>"Drip Squares, Hosing, Cutters", :isPhase=>"false"},
        {:phase=>"VEG1", :task_category=>"Clean", :name=>"Clean", :days=>1, :days_from_start_date=>18, :expected_hours_taken=>nil, :no_of_employees=>nil, :materials=>nil, :isPhase=>"false"},
        {:phase=>"VEG1", :task_category=>"Clean", :name=>"Return EZ Cloner", :days=>1, :days_from_start_date=>18, :expected_hours_taken=>0.1, :no_of_employees=>1, :materials=>nil, :isPhase=>"false"},
        {:phase=>"VEG1", :task_category=>"Clean", :name=>"Clean EZ Cloner", :days=>1, :days_from_start_date=>18, :expected_hours_taken=>1, :no_of_employees=>nil, :materials=>"Paper Towels, Water, Hydrogen Peroxide, Gloves ", :isPhase=>"false"},
        {:phase=>"VEG1", :task_category=>"Clean", :name=>"Clean Floors", :days=>1, :days_from_start_date=>18, :expected_hours_taken=>0.15, :no_of_employees=>1, :materials=>"Broom, Gloves, Bags", :isPhase=>"false"},
        {:phase=>"VEG1", :task_category=>"Clean", :name=>"Wipe Tables", :days=>1, :days_from_start_date=>18, :expected_hours_taken=>0.2, :no_of_employees=>1, :materials=>"Paper Towels, Gloves", :isPhase=>"false"},
        {:phase=>"VEG1", :task_category=>"Clean", :name=>"Clean ", :days=>1, :days_from_start_date=>18, :expected_hours_taken=>0.25, :no_of_employees=>1, :materials=>nil, :isPhase=>"false"},
        {:phase=>"VEG1", :task_category=>"Clean", :name=>"Return Supplies", :days=>1, :days_from_start_date=>18, :expected_hours_taken=>0.1, :no_of_employees=>1, :materials=>nil, :isPhase=>"false"},
        {:phase=>"VEG1", :task_category=>"Waiting", :name=>"Waiting", :days=>12, :days_from_start_date=>20, :expected_hours_taken=>nil, :no_of_employees=>nil, :materials=>nil, :isPhase=>"false"},
        {:phase=>"VEG2", :task_category=>"", :name=>"", :days=>14, :days_from_start_date=>19, :expected_hours_taken=>nil, :no_of_employees=>nil, :materials=>nil, :isPhase=>"true"},
        {:phase=>"VEG2", :task_category=>"Transfer", :name=>"Transfer from Left to Right side of room", :days=>1, :days_from_start_date=>19, :expected_hours_taken=>nil, :no_of_employees=>nil, :materials=>nil, :isPhase=>"false"},
        {:phase=>"VEG2", :task_category=>"Transfer", :name=>"Unpack Rockwool Boxes", :days=>1, :days_from_start_date=>32, :expected_hours_taken=>0.25, :no_of_employees=>2, :materials=>"Rockwool, Gloves, Cutter", :isPhase=>"false"},
        {:phase=>"VEG2", :task_category=>"Transfer", :name=>"Place Rockwool in Trays", :days=>1, :days_from_start_date=>32, :expected_hours_taken=>0.25, :no_of_employees=>2, :materials=>nil, :isPhase=>"false"},
        {:phase=>"VEG2", :task_category=>"Transfer", :name=>"Select Strongest Plants", :days=>1, :days_from_start_date=>32, :expected_hours_taken=>0.1, :no_of_employees=>2, :materials=>"Gloves", :isPhase=>"false"},
        {:phase=>"VEG2", :task_category=>"Transfer", :name=>"Transfer from Left to Right side of room", :days=>1, :days_from_start_date=>32, :expected_hours_taken=>6, :no_of_employees=>2, :materials=>"Gloves", :isPhase=>"false"},
        {:phase=>"VEG2", :task_category=>"Transfer", :name=>"Connect Drip Hosing", :days=>1, :days_from_start_date=>32, :expected_hours_taken=>2, :no_of_employees=>2, :materials=>"Gloves, Hosing, Cutters", :isPhase=>"false"},
        {:phase=>"VEG2", :task_category=>"Clean", :name=>"Clean", :days=>1, :days_from_start_date=>32, :expected_hours_taken=>nil, :no_of_employees=>nil, :materials=>nil, :isPhase=>"false"},
        {:phase=>"VEG2", :task_category=>"Clean", :name=>"Discard dead or dying plants", :days=>1, :days_from_start_date=>32, :expected_hours_taken=>0.5, :no_of_employees=>1, :materials=>"Gloves, Bags", :isPhase=>"false"},
        {:phase=>"VEG2", :task_category=>"Clean", :name=>"Wipe Trays", :days=>1, :days_from_start_date=>32, :expected_hours_taken=>0.5, :no_of_employees=>1, :materials=>"Gloves, Paper Towels, ", :isPhase=>"false"},
        {:phase=>"VEG2", :task_category=>"Clean", :name=>"Clean Inserts", :days=>1, :days_from_start_date=>32, :expected_hours_taken=>0.5, :no_of_employees=>1, :materials=>"Gloves, Water, Paper Towels, Trash Can", :isPhase=>"false"},
        {:phase=>"VEG2", :task_category=>"Clean", :name=>"Sweep Floors", :days=>1, :days_from_start_date=>32, :expected_hours_taken=>0.1, :no_of_employees=>1, :materials=>"Gloves, Broom", :isPhase=>"false"},
        {:phase=>"VEG2", :task_category=>"Waiting", :name=>"waiting", :days=>14, :days_from_start_date=>33, :expected_hours_taken=>nil, :no_of_employees=>nil, :materials=>nil, :isPhase=>"false"},
        {:phase=>"FLOWER", :task_category=>"", :name=>"", :days=>56, :days_from_start_date=>33, :expected_hours_taken=>nil, :no_of_employees=>nil, :materials=>nil, :isPhase=>"true"},
        {:phase=>"FLOWER", :task_category=>"Transfer", :name=>"Transfer from Left to Right side of room", :days=>1, :days_from_start_date=>33, :expected_hours_taken=>nil, :no_of_employees=>nil, :materials=>nil, :isPhase=>"false"},
        {:phase=>"FLOWER", :task_category=>"Transfer", :name=>"Lollipop Plants", :days=>1, :days_from_start_date=>48, :expected_hours_taken=>2, :no_of_employees=>3, :materials=>"Gloves, Cutters, Bags", :isPhase=>"false"},
        {:phase=>"FLOWER", :task_category=>"Transfer", :name=>"Take To Flower Room", :days=>1, :days_from_start_date=>48, :expected_hours_taken=>6, :no_of_employees=>3, :materials=>"Gloves", :isPhase=>"false"},
        {:phase=>"FLOWER", :task_category=>"Transfer", :name=>"Connect Hosing", :days=>1, :days_from_start_date=>48, :expected_hours_taken=>2, :no_of_employees=>3, :materials=>"Gloves, Hosing, Cutters", :isPhase=>"false"},
        {:phase=>"FLOWER", :task_category=>"Clean", :name=>"Clean", :days=>1, :days_from_start_date=>48, :expected_hours_taken=>nil, :no_of_employees=>nil, :materials=>nil, :isPhase=>"false"},
        {:phase=>"FLOWER", :task_category=>"Clean", :name=>"Wipe Down Trays", :days=>1, :days_from_start_date=>48, :expected_hours_taken=>0.5, :no_of_employees=>1, :materials=>"Gloves, Paper Towels", :isPhase=>"false"},
        {:phase=>"FLOWER", :task_category=>"Clean", :name=>"Clean Inserts", :days=>1, :days_from_start_date=>48, :expected_hours_taken=>0.5, :no_of_employees=>1, :materials=>"Gloves, Water, Paper Towels, Trash Can", :isPhase=>"false"},
        {:phase=>"FLOWER", :task_category=>"Clean", :name=>"Sweep Floors", :days=>1, :days_from_start_date=>48, :expected_hours_taken=>0.1, :no_of_employees=>1, :materials=>"Gloves, Broom", :isPhase=>"false"},
        {:phase=>"FLOWER", :task_category=>"Waiting", :name=>"Waiting", :days=>56, :days_from_start_date=>48, :expected_hours_taken=>nil, :no_of_employees=>nil, :materials=>nil, :isPhase=>"false"},
        {:phase=>"HARVEST", :task_category=>"", :name=>"", :days=>7, :days_from_start_date=>105, :expected_hours_taken=>nil, :no_of_employees=>nil, :materials=>nil, :isPhase=>"true"},
        {:phase=>"HARVEST", :task_category=>"Cut Down", :name=>"Cut down", :days=>1, :days_from_start_date=>105, :expected_hours_taken=>nil, :no_of_employees=>nil, :materials=>nil, :isPhase=>"false"},
        {:phase=>"HARVEST", :task_category=>"Cut Down", :name=>"Remove All Leaves", :days=>1, :days_from_start_date=>105, :expected_hours_taken=>3, :no_of_employees=>3, :materials=>"Gloves, Bag", :isPhase=>"false"},
        {:phase=>"HARVEST", :task_category=>"Cut Down", :name=>"Cut Limbs", :days=>1, :days_from_start_date=>105, :expected_hours_taken=>3, :no_of_employees=>3, :materials=>"Gloves, Cutters, Bags", :isPhase=>"false"},
        {:phase=>"HARVEST", :task_category=>"Hang", :name=>"Hang", :days=>1, :days_from_start_date=>105, :expected_hours_taken=>nil, :no_of_employees=>nil, :materials=>nil, :isPhase=>"false"},
        {:phase=>"HARVEST", :task_category=>"Hang", :name=>"Place Limbs on lines in Dry Room", :days=>1, :days_from_start_date=>105, :expected_hours_taken=>4, :no_of_employees=>3, :materials=>"Gloves", :isPhase=>"false"},
        {:phase=>"HARVEST", :task_category=>"Clean", :name=>"Clean", :days=>1, :days_from_start_date=>105, :expected_hours_taken=>nil, :no_of_employees=>nil, :materials=>nil, :isPhase=>"false"},
        {:phase=>"HARVEST", :task_category=>"Clean", :name=>"Discard Used Rockwool and Hosing", :days=>1, :days_from_start_date=>105, :expected_hours_taken=>2, :no_of_employees=>3, :materials=>"Gloves, Cutters, Bags", :isPhase=>"false"},
        {:phase=>"HARVEST", :task_category=>"Clean", :name=>"Clean Drip Squares", :days=>1, :days_from_start_date=>105, :expected_hours_taken=>2, :no_of_employees=>3, :materials=>"Gloves, Water, Hydrogen Peroxide", :isPhase=>"false"},
        {:phase=>"HARVEST", :task_category=>"Clean", :name=>"Clean Benches", :days=>1, :days_from_start_date=>105, :expected_hours_taken=>2, :no_of_employees=>3, :materials=>"Gloves, Paper Towels", :isPhase=>"false"},
        {:phase=>"HARVEST", :task_category=>"Clean", :name=>"Clean Walls", :days=>1, :days_from_start_date=>105, :expected_hours_taken=>1, :no_of_employees=>3, :materials=>"Gloves, Paper Towels", :isPhase=>"false"},
        {:phase=>"HARVEST", :task_category=>"Clean", :name=>"Clean Floors", :days=>1, :days_from_start_date=>105, :expected_hours_taken=>1, :no_of_employees=>3, :materials=>"Gloves, Paper Towels", :isPhase=>"false"},
        {:phase=>"HARVEST", :task_category=>"Clean", :name=>"Sweep Floors", :days=>1, :days_from_start_date=>105, :expected_hours_taken=>0.5, :no_of_employees=>3, :materials=>"Gloves, Broom", :isPhase=>"false"},
        {:phase=>"HARVEST", :task_category=>"Waiting", :name=>"Waiting", :days=>7, :days_from_start_date=>105, :expected_hours_taken=>nil, :no_of_employees=>nil, :materials=>nil, :isPhase=>"false"},
        {:phase=>"TRIM / PACKAGE", :task_category=>"", :name=>"", :days=>5, :days_from_start_date=>105, :expected_hours_taken=>nil, :no_of_employees=>nil, :materials=>nil, :isPhase=>"true"},
        {:phase=>"TRIM / PACKAGE", :task_category=>"Trim", :name=>"Trim", :days=>2, :days_from_start_date=>105, :expected_hours_taken=>nil, :no_of_employees=>nil, :materials=>nil, :isPhase=>"false"},
        {:phase=>"TRIM / PACKAGE", :task_category=>"Trim", :name=>"Trim Limbs", :days=>2, :days_from_start_date=>105, :expected_hours_taken=>8, :no_of_employees=>5, :materials=>"Cutters, Trays, Gloves, Bins, ", :isPhase=>"false"},
        {:phase=>"TRIM / PACKAGE", :task_category=>"Trim", :name=>"Save Trim", :days=>2, :days_from_start_date=>105, :expected_hours_taken=>0.1, :no_of_employees=>5, :materials=>"Bins", :isPhase=>"false"},
        {:phase=>"TRIM / PACKAGE", :task_category=>"Trim", :name=>"Discard Stems", :days=>2, :days_from_start_date=>105, :expected_hours_taken=>0.1, :no_of_employees=>5, :materials=>"Bags", :isPhase=>"false"},
        {:phase=>"TRIM / PACKAGE", :task_category=>"Package", :name=>"Package", :days=>2, :days_from_start_date=>107, :expected_hours_taken=>nil, :no_of_employees=>nil, :materials=>nil, :isPhase=>"false"},
        {:phase=>"TRIM / PACKAGE", :task_category=>"Package", :name=>"Weigh and Bag", :days=>2, :days_from_start_date=>115, :expected_hours_taken=>4, :no_of_employees=>1, :materials=>"Bags, Gloves", :isPhase=>"false"},
        {:phase=>"TRIM / PACKAGE", :task_category=>"Package", :name=>"Box Bags", :days=>2, :days_from_start_date=>115, :expected_hours_taken=>4, :no_of_employees=>1, :materials=>"Boxes, Gloves", :isPhase=>"false"},
        {:phase=>"TRIM / PACKAGE", :task_category=>"Package", :name=>"Prepare Sample", :days=>2, :days_from_start_date=>115, :expected_hours_taken=>0.1, :no_of_employees=>1, :materials=>"Bags, Gloves", :isPhase=>"false"},
        {:phase=>"TRIM / PACKAGE", :task_category=>"Package", :name=>"Enter Into Database", :days=>2, :days_from_start_date=>115, :expected_hours_taken=>2, :no_of_employees=>1, :materials=>nil, :isPhase=>"false"},
        {:phase=>"TRIM / PACKAGE", :task_category=>"Clean ", :name=>"Clean", :days=>1, :days_from_start_date=>117, :expected_hours_taken=>nil, :no_of_employees=>nil, :materials=>nil, :isPhase=>"false"},
        {:phase=>"TRIM / PACKAGE", :task_category=>"Clean ", :name=>"Clean Workstations", :days=>1, :days_from_start_date=>117, :expected_hours_taken=>0.25, :no_of_employees=>5, :materials=>"Gloves, Paper Towels, Cleaner", :isPhase=>"false"},
        {:phase=>"TRIM / PACKAGE", :task_category=>"Clean ", :name=>"Clean and Put Away Supplies", :days=>1, :days_from_start_date=>117, :expected_hours_taken=>0.1, :no_of_employees=>5, :materials=>nil, :isPhase=>"false"}, 
        {:phase=>"TRIM / PACKAGE", :task_category=>"Clean ", :name=>"Vacuum Floors", :days=>1, :days_from_start_date=>117, :expected_hours_taken=>0.1, :no_of_employees=>5, :materials=>nil, :isPhase=>"false"}
      ]
    end

    def save_record(args)
      batch = Cultivation::Batch.create(args)
      parent_id = nil
      task_templates.each do |task|
        a = build_task(batch, task, parent_id)
        parent_id = a['id'] if task[:isPhase] == "true"
      end
      batch
    end

    def build_task(batch, task, parent_id)
      start_date = batch.start_date
      params = {
        phase: task[:phase],
        task_category: task[:task_category],
        name: task[:name],
        days: task[:days],
        start_date: (start_date + task[:days_from_start_date]),
        end_date: (start_date + task[:days_from_start_date]) + task[:days].to_i.send('days'),
        days_from_start_date: task[:days_from_start_date],
        expected_hours_taken: task[:expected_hours_taken],
        no_of_employees: task[:no_of_employees],
        materials: task[:materials],
        isPhase: task[:isPhase],
        parent_id: task[:isPhase] == "true" ? nil : parent_id,  #give parent_id to non phase
        depend_on: task[:isPhase] == "true" ? parent_id : nil
      }
      batch.tasks.create(params)
    end

  end
end

# phase(parent) is depending on other phase(parent)
# if start_date of parent change, child will change
# parallel task only depend on parent



