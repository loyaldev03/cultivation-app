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
        {:phase => 'Clone', :task_category => '', :name => '', :days => 17, :days_from_start_date => 0, :estimated_hours => nil, :no_of_employees => nil, :materials => nil, :is_phase => 'true', :is_category => 'false'},
        {:phase => 'Clone', :task_category => 'Prepare', :name => '', :days => 1, :days_from_start_date => 0, :estimated_hours => nil, :no_of_employees => nil, :materials => nil, :is_phase => 'false', :is_category => 'true'},
        {:phase => 'Clone', :task_category => 'Prepare', :name => 'Prepare Sample', :days => 1, :days_from_start_date => 0, :estimated_hours => nil, :no_of_employees => nil, :materials => nil, :is_phase => 'false', :is_category => 'false'},
        {:phase => 'Clone', :task_category => 'Prepare', :name => 'Fill Cloner w/ Water', :days => 1, :days_from_start_date => 0, :estimated_hours => 0.25, :no_of_employees => 1, :materials => 'Water, Gloves', :is_phase => 'false', :is_category => 'false'},
        {:phase => 'Clone', :task_category => 'Prepare', :name => 'Mix Nutrients', :days => 1, :days_from_start_date => 0, :estimated_hours => 0.25, :no_of_employees => 1, :materials => 'Nutrients, MicroNutrients, Gloves', :is_phase => 'false', :is_category => 'false'},
        {:phase => 'Clone', :task_category => 'Prepare', :name => 'Place Collars', :days => 1, :days_from_start_date => 0, :estimated_hours => 0.25, :no_of_employees => 1, :materials => 'Collars, ', :is_phase => 'false', :is_category => 'false'},
        {:phase => 'Clone', :task_category => 'Clone', :name => '', :days => 1, :days_from_start_date => 2, :estimated_hours => nil, :no_of_employees => nil, :materials => nil, :is_phase => 'false', :is_category => 'true'},
        {:phase => 'Clone', :task_category => 'Clone', :name => 'Clone', :days => 1, :days_from_start_date => 2, :estimated_hours => nil, :no_of_employees => nil, :materials => nil, :is_phase => 'false', :is_category => 'false'},
        {:phase => 'Clone', :task_category => 'Clone', :name => 'Get Mother Plant', :days => 1, :days_from_start_date => 2, :estimated_hours => 0.1, :no_of_employees => 1, :materials => nil, :is_phase => 'false', :is_category => 'false'},
        {:phase => 'Clone', :task_category => 'Clone', :name => 'Cut, Dip & Place', :days => 1, :days_from_start_date => 2, :estimated_hours => 6.8, :no_of_employees => 3, :materials => 'Clone Gel, Razors, Exacto Knife, Bags', :is_phase => 'false', :is_category => 'false'},
        {:phase => 'Clone', :task_category => 'Clean', :name => '', :days => 1, :days_from_start_date => 4, :estimated_hours => nil, :no_of_employees => nil, :materials => nil, :is_phase => 'false', :is_category => 'true'},
        {:phase => 'Clone', :task_category => 'Clean', :name => 'Clean', :days => 1, :days_from_start_date => 4, :estimated_hours => nil, :no_of_employees => nil, :materials => nil, :is_phase => 'false', :is_category => 'false'},
        {:phase => 'Clone', :task_category => 'Clean', :name => 'Return Mother Plant', :days => 1, :days_from_start_date => 4, :estimated_hours => 0.1, :no_of_employees => 1, :materials => nil, :is_phase => 'false', :is_category => 'false'},
        {:phase => 'Clone', :task_category => 'Clean', :name => 'Clean and Return Supplies', :days => 1, :days_from_start_date => 4, :estimated_hours => 0.25, :no_of_employees => 1, :materials => 'Gloves, Paper Towels, Cleaner, Broom', :is_phase => 'false', :is_category => 'false'},
        {:phase => 'Clone', :task_category => 'Waiting', :name => 'Waiting', :days => 11, :days_from_start_date => 6, :estimated_hours => nil, :no_of_employees => nil, :materials => nil, :is_phase => 'false', :is_category => 'false'},
        {:phase => 'VEG1', :task_category => '', :name => '', :days => 14, :days_from_start_date => 18, :estimated_hours => nil, :no_of_employees => nil, :materials => nil, :is_phase => 'true', :is_category => 'false'},
        {:phase => 'VEG1', :task_category => 'Plant', :name => '', :days => 1, :days_from_start_date => 18, :estimated_hours => nil, :no_of_employees => nil, :materials => nil, :is_phase => 'false', :is_category => 'true'},
        {:phase => 'VEG1', :task_category => 'Plant', :name => 'Plant Clone and Loose into Rockwool', :days => 1, :days_from_start_date => 18, :estimated_hours => nil, :no_of_employees => nil, :materials => nil, :is_phase => 'false', :is_category => 'false'},
        {:phase => 'VEG1', :task_category => 'Plant', :name => 'Unpack Rockwool Boxes', :days => 1, :days_from_start_date => 18, :estimated_hours => 0.1, :no_of_employees => 2, :materials => 'Rockwool, Cutters, Gloves', :is_phase => 'false', :is_category => 'false'},
        {:phase => 'VEG1', :task_category => 'Plant', :name => 'Mix “Loose” Rockwool and Water', :days => 1, :days_from_start_date => 18, :estimated_hours => 0.5, :no_of_employees => 2, :materials => 'Rockwool, Cutters, Water, Nutrients, Micronutrients', :is_phase => 'false', :is_category => 'false'},
        {:phase => 'VEG1', :task_category => 'Plant', :name => 'Get EZ Cloner', :days => 1, :days_from_start_date => 18, :estimated_hours => 0.1, :no_of_employees => 1, :materials => nil, :is_phase => 'false', :is_category => 'false'},
        {:phase => 'VEG1', :task_category => 'Plant', :name => 'Plant Clone and Loose into Rockwool', :days => 1, :days_from_start_date => 18, :estimated_hours => 6, :no_of_employees => 3, :materials => 'Gloves', :is_phase => 'false', :is_category => 'false'},
        {:phase => 'VEG1', :task_category => 'Plant', :name => 'Place Drip Square and Connect Hose ', :days => 1, :days_from_start_date => 18, :estimated_hours => 1, :no_of_employees => 2, :materials => 'Drip Squares, Hosing, Cutters', :is_phase => 'false', :is_category => 'false'},
        {:phase => 'VEG1', :task_category => 'Clean', :name => '', :days => 1, :days_from_start_date => 18, :estimated_hours => nil, :no_of_employees => nil, :materials => nil, :is_phase => 'false', :is_category => 'true'},
        {:phase => 'VEG1', :task_category => 'Clean', :name => 'Clean', :days => 1, :days_from_start_date => 18, :estimated_hours => nil, :no_of_employees => nil, :materials => nil, :is_phase => 'false', :is_category => 'false'},
        {:phase => 'VEG1', :task_category => 'Clean', :name => 'Return EZ Cloner', :days => 1, :days_from_start_date => 18, :estimated_hours => 0.1, :no_of_employees => 1, :materials => nil, :is_phase => 'false', :is_category => 'false'},
        {:phase => 'VEG1', :task_category => 'Clean', :name => 'Clean EZ Cloner', :days => 1, :days_from_start_date => 18, :estimated_hours => 1, :no_of_employees => nil, :materials => 'Paper Towels, Water, Hydrogen Peroxide, Gloves ', :is_phase => 'false', :is_category => 'false'},
        {:phase => 'VEG1', :task_category => 'Clean', :name => 'Clean Floors', :days => 1, :days_from_start_date => 18, :estimated_hours => 0.15, :no_of_employees => 1, :materials => 'Broom, Gloves, Bags', :is_phase => 'false', :is_category => 'false'},
        {:phase => 'VEG1', :task_category => 'Clean', :name => 'Wipe Tables', :days => 1, :days_from_start_date => 18, :estimated_hours => 0.2, :no_of_employees => 1, :materials => 'Paper Towels, Gloves', :is_phase => 'false', :is_category => 'false'},
        {:phase => 'VEG1', :task_category => 'Clean', :name => 'Clean ', :days => 1, :days_from_start_date => 18, :estimated_hours => 0.25, :no_of_employees => 1, :materials => nil, :is_phase => 'false', :is_category => 'false'},
        {:phase => 'VEG1', :task_category => 'Clean', :name => 'Return Supplies', :days => 1, :days_from_start_date => 18, :estimated_hours => 0.1, :no_of_employees => 1, :materials => nil, :is_phase => 'false', :is_category => 'false'},
        {:phase => 'VEG1', :task_category => 'Waiting', :name => '', :days => 12, :days_from_start_date => 20, :estimated_hours => nil, :no_of_employees => nil, :materials => nil, :is_phase => 'false', :is_category => 'true'},
        {:phase => 'VEG1', :task_category => 'Waiting', :name => 'Waiting', :days => 12, :days_from_start_date => 20, :estimated_hours => nil, :no_of_employees => nil, :materials => nil, :is_phase => 'false', :is_category => 'false'},
        {:phase => 'VEG2', :task_category => '', :name => '', :days => 1, :days_from_start_date => 19, :estimated_hours => nil, :no_of_employees => nil, :materials => nil, :is_phase => 'true', :is_category => 'false'},
        {:phase => 'VEG2', :task_category => 'Transfer', :name => '', :days => 1, :days_from_start_date => 19, :estimated_hours => nil, :no_of_employees => nil, :materials => nil, :is_phase => 'false', :is_category => 'true'},
        {:phase => 'VEG2', :task_category => 'Transfer', :name => 'Transfer from Left to Right side of room', :days => 1, :days_from_start_date => 19, :estimated_hours => nil, :no_of_employees => nil, :materials => nil, :is_phase => 'false', :is_category => 'false'},
        {:phase => 'VEG2', :task_category => 'Transfer', :name => 'Unpack Rockwool Boxes', :days => 1, :days_from_start_date => 32, :estimated_hours => 0.25, :no_of_employees => 2, :materials => 'Rockwool, Gloves, Cutter', :is_phase => 'false', :is_category => 'false'},
        {:phase => 'VEG2', :task_category => 'Transfer', :name => 'Place Rockwool in Trays', :days => 1, :days_from_start_date => 32, :estimated_hours => 0.25, :no_of_employees => 2, :materials => nil, :is_phase => 'false', :is_category => 'false'},
        {:phase => 'VEG2', :task_category => 'Transfer', :name => 'Select Strongest Plants', :days => 1, :days_from_start_date => 32, :estimated_hours => 0.1, :no_of_employees => 2, :materials => 'Gloves', :is_phase => 'false', :is_category => 'false'},
        {:phase => 'VEG2', :task_category => 'Transfer', :name => 'Transfer from Left to Right side of room', :days => 1, :days_from_start_date => 32, :estimated_hours => 6, :no_of_employees => 2, :materials => 'Gloves', :is_phase => 'false', :is_category => 'false'},
        {:phase => 'VEG2', :task_category => 'Transfer', :name => 'Connect Drip Hosing', :days => 1, :days_from_start_date => 32, :estimated_hours => 2, :no_of_employees => 2, :materials => 'Gloves, Hosing, Cutters', :is_phase => 'false', :is_category => 'false'},
        {:phase => 'VEG2', :task_category => 'Clean', :name => '', :days => 1, :days_from_start_date => 32, :estimated_hours => nil, :no_of_employees => nil, :materials => nil, :is_phase => 'false', :is_category => 'true'},
        {:phase => 'VEG2', :task_category => 'Clean', :name => 'Clean', :days => 1, :days_from_start_date => 32, :estimated_hours => nil, :no_of_employees => nil, :materials => nil, :is_phase => 'false', :is_category => 'false'},
        {:phase => 'VEG2', :task_category => 'Clean', :name => 'Discard dead or dying plants', :days => 1, :days_from_start_date => 32, :estimated_hours => 0.5, :no_of_employees => 1, :materials => 'Gloves, Bags', :is_phase => 'false', :is_category => 'false'},
        {:phase => 'VEG2', :task_category => 'Clean', :name => 'Wipe Trays', :days => 1, :days_from_start_date => 32, :estimated_hours => 0.5, :no_of_employees => 1, :materials => 'Gloves, Paper Towels, ', :is_phase => 'false', :is_category => 'false'},
        {:phase => 'VEG2', :task_category => 'Clean', :name => 'Clean Inserts', :days => 1, :days_from_start_date => 32, :estimated_hours => 0.5, :no_of_employees => 1, :materials => 'Gloves, Water, Paper Towels, Trash Can', :is_phase => 'false', :is_category => 'false'},
        {:phase => 'VEG2', :task_category => 'Clean', :name => 'Sweep Floors', :days => 1, :days_from_start_date => 32, :estimated_hours => 0.1, :no_of_employees => 1, :materials => 'Gloves, Broom', :is_phase => 'false', :is_category => 'false'},
        {:phase => 'VEG2', :task_category => 'Waiting', :name => '', :days => 14, :days_from_start_date => 33, :estimated_hours => nil, :no_of_employees => nil, :materials => nil, :is_phase => 'false', :is_category => 'true'},
        {:phase => 'VEG2', :task_category => 'Waiting', :name => 'waiting', :days => 14, :days_from_start_date => 33, :estimated_hours => nil, :no_of_employees => nil, :materials => nil, :is_phase => 'false', :is_category => 'false'},
        {:phase => 'FLOWER', :task_category => '', :name => '', :days => 56, :days_from_start_date => 33, :estimated_hours => nil, :no_of_employees => nil, :materials => nil, :is_phase => 'true', :is_category => 'false'},
        {:phase => 'FLOWER', :task_category => 'Transfer', :name => '', :days => 1, :days_from_start_date => 33, :estimated_hours => nil, :no_of_employees => nil, :materials => nil, :is_phase => 'false', :is_category => 'true'},
        {:phase => 'FLOWER', :task_category => 'Transfer', :name => 'Transfer from Left to Right side of room', :days => 1, :days_from_start_date => 33, :estimated_hours => nil, :no_of_employees => nil, :materials => nil, :is_phase => 'false', :is_category => 'false'},
        {:phase => 'FLOWER', :task_category => 'Transfer', :name => 'Lollipop Plants', :days => 1, :days_from_start_date => 48, :estimated_hours => 2, :no_of_employees => 3, :materials => 'Gloves, Cutters, Bags', :is_phase => 'false', :is_category => 'false'},
        {:phase => 'FLOWER', :task_category => 'Transfer', :name => 'Take To Flower Room', :days => 1, :days_from_start_date => 48, :estimated_hours => 6, :no_of_employees => 3, :materials => 'Gloves', :is_phase => 'false', :is_category => 'false'},
        {:phase => 'FLOWER', :task_category => 'Transfer', :name => 'Connect Hosing', :days => 1, :days_from_start_date => 48, :estimated_hours => 2, :no_of_employees => 3, :materials => 'Gloves, Hosing, Cutters', :is_phase => 'false', :is_category => 'false'},
        {:phase => 'FLOWER', :task_category => 'Clean', :name => '', :days => 1, :days_from_start_date => 48, :estimated_hours => nil, :no_of_employees => nil, :materials => nil, :is_phase => 'false', :is_category => 'true'},
        {:phase => 'FLOWER', :task_category => 'Clean', :name => 'Clean', :days => 1, :days_from_start_date => 48, :estimated_hours => nil, :no_of_employees => nil, :materials => nil, :is_phase => 'false', :is_category => 'false'},
        {:phase => 'FLOWER', :task_category => 'Clean', :name => 'Wipe Down Trays', :days => 1, :days_from_start_date => 48, :estimated_hours => 0.5, :no_of_employees => 1, :materials => 'Gloves, Paper Towels', :is_phase => 'false', :is_category => 'false'},
        {:phase => 'FLOWER', :task_category => 'Clean', :name => 'Clean Inserts', :days => 1, :days_from_start_date => 48, :estimated_hours => 0.5, :no_of_employees => 1, :materials => 'Gloves, Water, Paper Towels, Trash Can', :is_phase => 'false', :is_category => 'false'},
        {:phase => 'FLOWER', :task_category => 'Clean', :name => 'Sweep Floors', :days => 1, :days_from_start_date => 48, :estimated_hours => 0.1, :no_of_employees => 1, :materials => 'Gloves, Broom', :is_phase => 'false', :is_category => 'false'},
        {:phase => 'FLOWER', :task_category => 'Waiting', :name => '', :days => 56, :days_from_start_date => 48, :estimated_hours => nil, :no_of_employees => nil, :materials => nil, :is_phase => 'false', :is_category => 'true'},
        {:phase => 'FLOWER', :task_category => 'Waiting', :name => 'Waiting', :days => 56, :days_from_start_date => 48, :estimated_hours => nil, :no_of_employees => nil, :materials => nil, :is_phase => 'false', :is_category => 'false'},
        {:phase => 'HARVEST', :task_category => '', :name => '', :days => 7, :days_from_start_date => 105, :estimated_hours => nil, :no_of_employees => nil, :materials => nil, :is_phase => 'true', :is_category => 'false'},
        {:phase => 'HARVEST', :task_category => 'Cut Down', :name => '', :days => 1, :days_from_start_date => 105, :estimated_hours => nil, :no_of_employees => nil, :materials => nil, :is_phase => 'false', :is_category => 'true'},
        {:phase => 'HARVEST', :task_category => 'Cut Down', :name => 'Cut down', :days => 1, :days_from_start_date => 105, :estimated_hours => nil, :no_of_employees => nil, :materials => nil, :is_phase => 'false', :is_category => 'false'},
        {:phase => 'HARVEST', :task_category => 'Cut Down', :name => 'Remove All Leaves', :days => 1, :days_from_start_date => 105, :estimated_hours => 3, :no_of_employees => 3, :materials => 'Gloves, Bag', :is_phase => 'false', :is_category => 'false'},
        {:phase => 'HARVEST', :task_category => 'Cut Down', :name => 'Cut Limbs', :days => 1, :days_from_start_date => 105, :estimated_hours => 3, :no_of_employees => 3, :materials => 'Gloves, Cutters, Bags', :is_phase => 'false', :is_category => 'false'},
        {:phase => 'HARVEST', :task_category => 'Hang', :name => '', :days => 1, :days_from_start_date => 105, :estimated_hours => nil, :no_of_employees => nil, :materials => nil, :is_phase => 'false', :is_category => 'true'},
        {:phase => 'HARVEST', :task_category => 'Hang', :name => 'Hang', :days => 1, :days_from_start_date => 105, :estimated_hours => nil, :no_of_employees => nil, :materials => nil, :is_phase => 'false', :is_category => 'false'},
        {:phase => 'HARVEST', :task_category => 'Hang', :name => 'Place Limbs on lines in Dry Room', :days => 1, :days_from_start_date => 105, :estimated_hours => 4, :no_of_employees => 3, :materials => 'Gloves', :is_phase => 'false', :is_category => 'false'},
        {:phase => 'HARVEST', :task_category => 'Clean', :name => '', :days => 1, :days_from_start_date => 105, :estimated_hours => nil, :no_of_employees => nil, :materials => nil, :is_phase => 'false', :is_category => 'true'},
        {:phase => 'HARVEST', :task_category => 'Clean', :name => 'Clean', :days => 1, :days_from_start_date => 105, :estimated_hours => nil, :no_of_employees => nil, :materials => nil, :is_phase => 'false', :is_category => 'false'},
        {:phase => 'HARVEST', :task_category => 'Clean', :name => 'Discard Used Rockwool and Hosing', :days => 1, :days_from_start_date => 105, :estimated_hours => 2, :no_of_employees => 3, :materials => 'Gloves, Cutters, Bags', :is_phase => 'false', :is_category => 'false'},
        {:phase => 'HARVEST', :task_category => 'Clean', :name => 'Clean Drip Squares', :days => 1, :days_from_start_date => 105, :estimated_hours => 2, :no_of_employees => 3, :materials => 'Gloves, Water, Hydrogen Peroxide', :is_phase => 'false', :is_category => 'false'},
        {:phase => 'HARVEST', :task_category => 'Clean', :name => 'Clean Benches', :days => 1, :days_from_start_date => 105, :estimated_hours => 2, :no_of_employees => 3, :materials => 'Gloves, Paper Towels', :is_phase => 'false', :is_category => 'false'},
        {:phase => 'HARVEST', :task_category => 'Clean', :name => 'Clean Walls', :days => 1, :days_from_start_date => 105, :estimated_hours => 1, :no_of_employees => 3, :materials => 'Gloves, Paper Towels', :is_phase => 'false', :is_category => 'false'},
        {:phase => 'HARVEST', :task_category => 'Clean', :name => 'Clean Floors', :days => 1, :days_from_start_date => 105, :estimated_hours => 1, :no_of_employees => 3, :materials => 'Gloves, Paper Towels', :is_phase => 'false', :is_category => 'false'},
        {:phase => 'HARVEST', :task_category => 'Clean', :name => 'Sweep Floors', :days => 1, :days_from_start_date => 105, :estimated_hours => 0.5, :no_of_employees => 3, :materials => 'Gloves, Broom', :is_phase => 'false', :is_category => 'false'},
        {:phase => 'HARVEST', :task_category => 'Waiting', :name => '', :days => 7, :days_from_start_date => 105, :estimated_hours => nil, :no_of_employees => nil, :materials => nil, :is_phase => 'false', :is_category => 'true'},
        {:phase => 'HARVEST', :task_category => 'Waiting', :name => 'Waiting', :days => 7, :days_from_start_date => 105, :estimated_hours => nil, :no_of_employees => nil, :materials => nil, :is_phase => 'false', :is_category => 'false'},
        {:phase => 'TRIM / PACKAGE', :task_category => '', :name => '', :days => 5, :days_from_start_date => 105, :estimated_hours => nil, :no_of_employees => nil, :materials => nil, :is_phase => 'true', :is_category => 'false'},
        {:phase => 'TRIM / PACKAGE', :task_category => 'Trim', :name => '', :days => 2, :days_from_start_date => 105, :estimated_hours => nil, :no_of_employees => nil, :materials => nil, :is_phase => 'false', :is_category => 'true'},
        {:phase => 'TRIM / PACKAGE', :task_category => 'Trim', :name => 'Trim', :days => 2, :days_from_start_date => 105, :estimated_hours => nil, :no_of_employees => nil, :materials => nil, :is_phase => 'false', :is_category => 'false'},
        {:phase => 'TRIM / PACKAGE', :task_category => 'Trim', :name => 'Trim Limbs', :days => 2, :days_from_start_date => 105, :estimated_hours => 8, :no_of_employees => 5, :materials => 'Cutters, Trays, Gloves, Bins, ', :is_phase => 'false', :is_category => 'false'},
        {:phase => 'TRIM / PACKAGE', :task_category => 'Trim', :name => 'Save Trim', :days => 2, :days_from_start_date => 105, :estimated_hours => 0.1, :no_of_employees => 5, :materials => 'Bins', :is_phase => 'false', :is_category => 'false'},
        {:phase => 'TRIM / PACKAGE', :task_category => 'Trim', :name => 'Discard Stems', :days => 2, :days_from_start_date => 105, :estimated_hours => 0.1, :no_of_employees => 5, :materials => 'Bags', :is_phase => 'false', :is_category => 'false'},
        {:phase => 'TRIM / PACKAGE', :task_category => 'Package', :name => '', :days => 2, :days_from_start_date => 107, :estimated_hours => nil, :no_of_employees => nil, :materials => nil, :is_phase => 'false', :is_category => 'true'},
        {:phase => 'TRIM / PACKAGE', :task_category => 'Package', :name => 'Package', :days => 2, :days_from_start_date => 107, :estimated_hours => nil, :no_of_employees => nil, :materials => nil, :is_phase => 'false', :is_category => 'false'},
        {:phase => 'TRIM / PACKAGE', :task_category => 'Package', :name => 'Weigh and Bag', :days => 2, :days_from_start_date => 115, :estimated_hours => 4, :no_of_employees => 1, :materials => 'Bags, Gloves', :is_phase => 'false', :is_category => 'false'},
        {:phase => 'TRIM / PACKAGE', :task_category => 'Package', :name => 'Box Bags', :days => 2, :days_from_start_date => 115, :estimated_hours => 4, :no_of_employees => 1, :materials => 'Boxes, Gloves', :is_phase => 'false', :is_category => 'false'},
        {:phase => 'TRIM / PACKAGE', :task_category => 'Package', :name => 'Prepare Sample', :days => 2, :days_from_start_date => 115, :estimated_hours => 0.1, :no_of_employees => 1, :materials => 'Bags, Gloves', :is_phase => 'false', :is_category => 'false'},
        {:phase => 'TRIM / PACKAGE', :task_category => 'Package', :name => 'Enter Into Database', :days => 2, :days_from_start_date => 115, :estimated_hours => 2, :no_of_employees => 1, :materials => nil, :is_phase => 'false', :is_category => 'false'},
        {:phase => 'TRIM / PACKAGE', :task_category => 'Clean ', :name => '', :days => 1, :days_from_start_date => 117, :estimated_hours => nil, :no_of_employees => nil, :materials => nil, :is_phase => 'false', :is_category => 'true'},
        {:phase => 'TRIM / PACKAGE', :task_category => 'Clean ', :name => 'Clean', :days => 1, :days_from_start_date => 117, :estimated_hours => nil, :no_of_employees => nil, :materials => nil, :is_phase => 'false', :is_category => 'false'},
        {:phase => 'TRIM / PACKAGE', :task_category => 'Clean ', :name => 'Clean Workstations', :days => 1, :days_from_start_date => 117, :estimated_hours => 0.25, :no_of_employees => 5, :materials => 'Gloves, Paper Towels, Cleaner', :is_phase => 'false', :is_category => 'false'},
        {:phase => 'TRIM / PACKAGE', :task_category => 'Clean ', :name => 'Clean and Put Away Supplies', :days => 1, :days_from_start_date => 117, :estimated_hours => 0.1, :no_of_employees => 5, :materials => nil, :is_phase => 'false', :is_category => 'false'},
        {:phase => 'TRIM / PACKAGE', :task_category => 'Clean ', :name => 'Vacuum Floors', :days => 1, :days_from_start_date => 117, :estimated_hours => 0.1, :no_of_employees => 5, :materials => nil, :is_phase => 'false', :is_category => 'false'},
      ]
    end

    def save_record(args)
      batch = Cultivation::Batch.create(args)
      phase_id = nil
      category_id = nil
      task_templates.each do |task|
        a = build_task(batch, task, phase_id, category_id)
        if task[:is_phase] == 'true'
          phase_id = a['id']
          category_id = nil
        end
        category_id = a['id'] if task[:is_category] == 'true'
      end
      #update estimated finish
      update_harvest_date(batch)
      batch
    end

    def build_task(batch, task, phase_id, category_id)
      start_date = batch.start_date
      parent_id = get_parent_id(task, phase_id, category_id)
      depend_on = get_depend_on(task, phase_id, category_id)

      params = {
        phase: task[:phase],
        task_category: task[:task_category],
        name: task[:name],
        days: task[:days],
        start_date: (start_date + task[:days_from_start_date]),
        end_date: (start_date + task[:days_from_start_date]) + task[:days].to_i.send('days'),
        days_from_start_date: task[:days_from_start_date],
        estimated_hours: task[:estimated_hours],
        no_of_employees: task[:no_of_employees],
        materials: task[:materials],
        is_phase: to_boolean(task[:is_phase]),
        is_category: to_boolean(task[:is_category]),
        parent_id: parent_id,
        depend_on: depend_on,
      }
      batch.tasks.create(params)
    end

    def get_parent_id(task, phase_id, category_id)
      if task[:is_category] == 'false' and task[:is_phase] == 'false' #normal task
        parent_id = category_id
      elsif task[:is_category] == 'true' and task[:is_phase] == 'false' #category task
        parent_id = category_id.nil? ? phase_id : nil
      elsif task[:is_category] == 'false' and task[:is_phase] == 'true' #phase task
        parent_id = nil
      end
      return parent_id
    end

    def get_depend_on(task, phase_id, category_id)
      if task[:is_category] == 'false' and task[:is_phase] == 'false' #normal task
        depend_on = nil
      elsif task[:is_category] == 'true' and task[:is_phase] == 'false' #category task
        depend_on = category_id
      elsif task[:is_category] == 'false' and task[:is_phase] == 'true' #phase task
        depend_on = phase_id
      end
      return depend_on
    end

    def to_boolean(obj)
      if obj == 'true'
        true
      else
        false
      end
    end

    def update_harvest_date(batch)
      ##should be harvest phase end_date
      batch.update(estimated_harvest_date: batch.tasks.last.end_date)
    end
  end
end

# phase(parent) is depending on other phase(parent)
# if start_date of parent change, child will change
# parallel task only depend on parent

#Phase has many category
#Category has many children task
#Some task depend on other task
#If some children task extend or reduce duration, it will affect category date, will affect other date too
