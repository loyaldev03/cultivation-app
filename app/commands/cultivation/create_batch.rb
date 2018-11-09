module Cultivation
  class CreateBatch
    prepend SimpleCommand

    attr_reader :user, :args

    def initialize(user, args)
      @user = user
      @args = args
    end

    def call
      if valid_permission? && valid_data?
        save_record(args)
      else
        args
      end
    end

    private

    def task_templates
      # [fathi] - temporary change for demo

      # [
      #   {:phase => Constants::CONST_CLONE, :task_category => '', :name => 'Clone', :duration => 17, :days_from_start_date => 0, :estimated_hours => nil, :is_phase => 'true', :is_category => 'false'},
      #   {:phase => Constants::CONST_CLONE, :task_category => 'Prepare', :name => 'Prepare', :duration => 1, :days_from_start_date => 0, :estimated_hours => nil, :is_phase => 'false', :is_category => 'true'},
      #   {:phase => Constants::CONST_CLONE, :task_category => 'Prepare', :name => 'Prepare Sample', :duration => 1, :days_from_start_date => 0, :estimated_hours => nil, :is_phase => 'false', :is_category => 'false'},
      #   {:phase => Constants::CONST_CLONE, :task_category => 'Prepare', :name => 'Fill Cloner w/ Water', :duration => 1, :days_from_start_date => 0, :estimated_hours => 0.25, :is_phase => 'false', :is_category => 'false'},
      #   {:phase => Constants::CONST_CLONE, :task_category => 'Prepare', :name => 'Mix Nutrients', :duration => 1, :days_from_start_date => 0, :estimated_hours => 0.25, :is_phase => 'false', :is_category => 'false'},
      #   {:phase => Constants::CONST_CLONE, :task_category => 'Prepare', :name => 'Place Collars', :duration => 1, :days_from_start_date => 0, :estimated_hours => 0.25, :is_phase => 'false', :is_category => 'false'},
      #   {:phase => Constants::CONST_CLONE, :task_category => 'Clone', :name => 'Clone', :duration => 1, :days_from_start_date => 2, :estimated_hours => nil, :is_phase => 'false', :is_category => 'true'},
      #   {:phase => Constants::CONST_CLONE, :task_category => 'Clone', :name => 'Clone', :duration => 1, :days_from_start_date => 2, :estimated_hours => nil, :is_phase => 'false', :is_category => 'false'},
      #   {:phase => Constants::CONST_CLONE, :task_category => 'Clone', :name => 'Get Mother Plant', :duration => 1, :days_from_start_date => 2, :estimated_hours => 0.1, :is_phase => 'false', :is_category => 'false'},
      #   {:phase => Constants::CONST_CLONE, :task_category => 'Clone', :name => 'Cut, Dip & Place', :duration => 1, :days_from_start_date => 2, :estimated_hours => 6.8, :is_phase => 'false', :is_category => 'false'},
      #   {:phase => Constants::CONST_CLONE, :task_category => 'Clean', :name => 'Clean', :duration => 1, :days_from_start_date => 4, :estimated_hours => nil, :is_phase => 'false', :is_category => 'true'},
      #   {:phase => Constants::CONST_CLONE, :task_category => 'Clean', :name => 'Clean', :duration => 1, :days_from_start_date => 4, :estimated_hours => nil, :is_phase => 'false', :is_category => 'false'},
      #   {:phase => Constants::CONST_CLONE, :task_category => 'Clean', :name => 'Return Mother Plant', :duration => 1, :days_from_start_date => 4, :estimated_hours => 0.1, :is_phase => 'false', :is_category => 'false'},
      #   {:phase => Constants::CONST_CLONE, :task_category => 'Clean', :name => 'Clean and Return Supplies', :duration => 1, :days_from_start_date => 4, :estimated_hours => 0.25, :is_phase => 'false', :is_category => 'false'},
      #   {:phase => Constants::CONST_CLONE, :task_category => 'Waiting', :name => 'Waiting', :duration => 11, :days_from_start_date => 6, :estimated_hours => nil, :is_phase => 'false', :is_category => 'false'},
      #   {:phase => Constants::CONST_VEG1, :task_category => '', :name => 'VEG1', :duration => 14, :days_from_start_date => 18, :estimated_hours => nil, :is_phase => 'true', :is_category => 'false'},
      #   {:phase => Constants::CONST_VEG1, :task_category => 'Plant', :name => 'Plant', :duration => 1, :days_from_start_date => 18, :estimated_hours => nil, :is_phase => 'false', :is_category => 'true'},
      #   {:phase => Constants::CONST_VEG1, :task_category => 'Plant', :name => 'Plant Clone and Loose into Rockwool', :duration => 1, :days_from_start_date => 18, :estimated_hours => nil, :is_phase => 'false', :is_category => 'false'},
      #   {:phase => Constants::CONST_VEG1, :task_category => 'Plant', :name => 'Unpack Rockwool Boxes', :duration => 1, :days_from_start_date => 18, :estimated_hours => 0.1, :is_phase => 'false', :is_category => 'false'},
      #   {:phase => Constants::CONST_VEG1, :task_category => 'Plant', :name => 'Mix “Loose” Rockwool and Water', :duration => 1, :days_from_start_date => 18, :estimated_hours => 0.5, :is_phase => 'false', :is_category => 'false'},
      #   {:phase => Constants::CONST_VEG1, :task_category => 'Plant', :name => 'Get EZ Cloner', :duration => 1, :days_from_start_date => 18, :estimated_hours => 0.1, :is_phase => 'false', :is_category => 'false'},
      #   {:phase => Constants::CONST_VEG1, :task_category => 'Plant', :name => 'Plant Clone and Loose into Rockwool', :duration => 1, :days_from_start_date => 18, :estimated_hours => 6, :is_phase => 'false', :is_category => 'false'},
      #   {:phase => Constants::CONST_VEG1, :task_category => 'Plant', :name => 'Place Drip Square and Connect Hose ', :duration => 1, :days_from_start_date => 18, :estimated_hours => 1, :is_phase => 'false', :is_category => 'false'},
      #   {:phase => Constants::CONST_VEG1, :task_category => 'Clean', :name => 'Clean', :duration => 1, :days_from_start_date => 18, :estimated_hours => nil, :is_phase => 'false', :is_category => 'true'},
      #   {:phase => Constants::CONST_VEG1, :task_category => 'Clean', :name => 'Clean', :duration => 1, :days_from_start_date => 18, :estimated_hours => nil, :is_phase => 'false', :is_category => 'false'},
      #   {:phase => Constants::CONST_VEG1, :task_category => 'Clean', :name => 'Return EZ Cloner', :duration => 1, :days_from_start_date => 18, :estimated_hours => 0.1, :is_phase => 'false', :is_category => 'false'},
      #   {:phase => Constants::CONST_VEG1, :task_category => 'Clean', :name => 'Clean EZ Cloner', :duration => 1, :days_from_start_date => 18, :estimated_hours => 1, :is_phase => 'false', :is_category => 'false'},
      #   {:phase => Constants::CONST_VEG1, :task_category => 'Clean', :name => 'Clean Floors', :duration => 1, :days_from_start_date => 18, :estimated_hours => 0.15, :is_phase => 'false', :is_category => 'false'},
      #   {:phase => Constants::CONST_VEG1, :task_category => 'Clean', :name => 'Wipe Tables', :duration => 1, :days_from_start_date => 18, :estimated_hours => 0.2, :is_phase => 'false', :is_category => 'false'},
      #   {:phase => Constants::CONST_VEG1, :task_category => 'Clean', :name => 'Clean ', :duration => 1, :days_from_start_date => 18, :estimated_hours => 0.25, :is_phase => 'false', :is_category => 'false'},
      #   {:phase => Constants::CONST_VEG1, :task_category => 'Clean', :name => 'Return Supplies', :duration => 1, :days_from_start_date => 18, :estimated_hours => 0.1, :is_phase => 'false', :is_category => 'false'},
      #   {:phase => Constants::CONST_VEG1, :task_category => 'Waiting', :name => 'Waiting', :duration => 12, :days_from_start_date => 20, :estimated_hours => nil, :is_phase => 'false', :is_category => 'true'},
      #   {:phase => Constants::CONST_VEG1, :task_category => 'Waiting', :name => 'Waiting', :duration => 12, :days_from_start_date => 20, :estimated_hours => nil, :is_phase => 'false', :is_category => 'false'},
      #   {:phase => Constants::CONST_VEG2, :task_category => '', :name => 'VEG2', :duration => 1, :days_from_start_date => 19, :estimated_hours => nil, :is_phase => 'true', :is_category => 'false'},
      #   {:phase => Constants::CONST_VEG2, :task_category => 'Transfer', :name => 'Transfer', :duration => 1, :days_from_start_date => 19, :estimated_hours => nil, :is_phase => 'false', :is_category => 'true'},
      #   {:phase => Constants::CONST_VEG2, :task_category => 'Transfer', :name => 'Transfer from Left to Right side of room', :duration => 1, :days_from_start_date => 19, :estimated_hours => nil, :is_phase => 'false', :is_category => 'false'},
      #   {:phase => Constants::CONST_VEG2, :task_category => 'Transfer', :name => 'Unpack Rockwool Boxes', :duration => 1, :days_from_start_date => 32, :estimated_hours => 0.25, :is_phase => 'false', :is_category => 'false'},
      #   {:phase => Constants::CONST_VEG2, :task_category => 'Transfer', :name => 'Place Rockwool in Trays', :duration => 1, :days_from_start_date => 32, :estimated_hours => 0.25, :is_phase => 'false', :is_category => 'false'},
      #   {:phase => Constants::CONST_VEG2, :task_category => 'Transfer', :name => 'Select Strongest Plants', :duration => 1, :days_from_start_date => 32, :estimated_hours => 0.1, :is_phase => 'false', :is_category => 'false'},
      #   {:phase => Constants::CONST_VEG2, :task_category => 'Transfer', :name => 'Transfer from Left to Right side of room', :duration => 1, :days_from_start_date => 32, :estimated_hours => 6, :is_phase => 'false', :is_category => 'false'},
      #   {:phase => Constants::CONST_VEG2, :task_category => 'Transfer', :name => 'Connect Drip Hosing', :duration => 1, :days_from_start_date => 32, :estimated_hours => 2, :is_phase => 'false', :is_category => 'false'},
      #   {:phase => Constants::CONST_VEG2, :task_category => 'Clean', :name => 'Clean', :duration => 1, :days_from_start_date => 32, :estimated_hours => nil, :is_phase => 'false', :is_category => 'true'},
      #   {:phase => Constants::CONST_VEG2, :task_category => 'Clean', :name => 'Clean', :duration => 1, :days_from_start_date => 32, :estimated_hours => nil, :is_phase => 'false', :is_category => 'false'},
      #   {:phase => Constants::CONST_VEG2, :task_category => 'Clean', :name => 'Discard dead or dying plants', :duration => 1, :days_from_start_date => 32, :estimated_hours => 0.5, :is_phase => 'false', :is_category => 'false'},
      #   {:phase => Constants::CONST_VEG2, :task_category => 'Clean', :name => 'Wipe Trays', :duration => 1, :days_from_start_date => 32, :estimated_hours => 0.5, :is_phase => 'false', :is_category => 'false'},
      #   {:phase => Constants::CONST_VEG2, :task_category => 'Clean', :name => 'Clean Inserts', :duration => 1, :days_from_start_date => 32, :estimated_hours => 0.5, :is_phase => 'false', :is_category => 'false'},
      #   {:phase => Constants::CONST_VEG2, :task_category => 'Clean', :name => 'Sweep Floors', :duration => 1, :days_from_start_date => 32, :estimated_hours => 0.1, :is_phase => 'false', :is_category => 'false'},
      #   {:phase => Constants::CONST_VEG2, :task_category => 'Waiting', :name => 'Waiting', :duration => 14, :days_from_start_date => 33, :estimated_hours => nil, :is_phase => 'false', :is_category => 'true'},
      #   {:phase => Constants::CONST_VEG2, :task_category => 'Waiting', :name => 'waiting', :duration => 14, :days_from_start_date => 33, :estimated_hours => nil, :is_phase => 'false', :is_category => 'false'},
      #   {:phase => Constants::CONST_FLOWER, :task_category => '', :name => 'FLOWER', :duration => 56, :days_from_start_date => 33, :estimated_hours => nil, :is_phase => 'true', :is_category => 'false'},
      #   {:phase => Constants::CONST_FLOWER, :task_category => 'Transfer', :name => 'Transfer', :duration => 1, :days_from_start_date => 33, :estimated_hours => nil, :is_phase => 'false', :is_category => 'true'},
      #   {:phase => Constants::CONST_FLOWER, :task_category => 'Transfer', :name => 'Transfer from Left to Right side of room', :duration => 1, :days_from_start_date => 33, :estimated_hours => nil, :is_phase => 'false', :is_category => 'false'},
      #   {:phase => Constants::CONST_FLOWER, :task_category => 'Transfer', :name => 'Lollipop Plants', :duration => 1, :days_from_start_date => 48, :estimated_hours => 2, :is_phase => 'false', :is_category => 'false'},
      #   {:phase => Constants::CONST_FLOWER, :task_category => 'Transfer', :name => 'Take To Flower Room', :duration => 1, :days_from_start_date => 48, :estimated_hours => 6, :is_phase => 'false', :is_category => 'false'},
      #   {:phase => Constants::CONST_FLOWER, :task_category => 'Transfer', :name => 'Connect Hosing', :duration => 1, :days_from_start_date => 48, :estimated_hours => 2, :is_phase => 'false', :is_category => 'false'},
      #   {:phase => Constants::CONST_FLOWER, :task_category => 'Clean', :name => 'Clean', :duration => 1, :days_from_start_date => 48, :estimated_hours => nil, :is_phase => 'false', :is_category => 'true'},
      #   {:phase => Constants::CONST_FLOWER, :task_category => 'Clean', :name => 'Clean', :duration => 1, :days_from_start_date => 48, :estimated_hours => nil, :is_phase => 'false', :is_category => 'false'},
      #   {:phase => Constants::CONST_FLOWER, :task_category => 'Clean', :name => 'Wipe Down Trays', :duration => 1, :days_from_start_date => 48, :estimated_hours => 0.5, :is_phase => 'false', :is_category => 'false'},
      #   {:phase => Constants::CONST_FLOWER, :task_category => 'Clean', :name => 'Clean Inserts', :duration => 1, :days_from_start_date => 48, :estimated_hours => 0.5, :is_phase => 'false', :is_category => 'false'},
      #   {:phase => Constants::CONST_FLOWER, :task_category => 'Clean', :name => 'Sweep Floors', :duration => 1, :days_from_start_date => 48, :estimated_hours => 0.1, :is_phase => 'false', :is_category => 'false'},
      #   {:phase => Constants::CONST_FLOWER, :task_category => 'Waiting', :name => 'Waiting', :duration => 56, :days_from_start_date => 48, :estimated_hours => nil, :is_phase => 'false', :is_category => 'true'},
      #   {:phase => Constants::CONST_FLOWER, :task_category => 'Waiting', :name => 'Waiting', :duration => 56, :days_from_start_date => 48, :estimated_hours => nil, :is_phase => 'false', :is_category => 'false'},
      #   {:phase => Constants::CONST_DRY, :task_category => '', :name => 'HARVEST', :duration => 7, :days_from_start_date => 105, :estimated_hours => nil, :is_phase => 'true', :is_category => 'false'},
      #   {:phase => Constants::CONST_DRY, :task_category => 'Cut Down', :name => 'Cut Down', :duration => 1, :days_from_start_date => 105, :estimated_hours => nil, :is_phase => 'false', :is_category => 'true'},
      #   {:phase => Constants::CONST_DRY, :task_category => 'Cut Down', :name => 'Cut down', :duration => 1, :days_from_start_date => 105, :estimated_hours => nil, :is_phase => 'false', :is_category => 'false'},
      #   {:phase => Constants::CONST_DRY, :task_category => 'Cut Down', :name => 'Remove All Leaves', :duration => 1, :days_from_start_date => 105, :estimated_hours => 3, :is_phase => 'false', :is_category => 'false'},
      #   {:phase => Constants::CONST_DRY, :task_category => 'Cut Down', :name => 'Cut Limbs', :duration => 1, :days_from_start_date => 105, :estimated_hours => 3, :is_phase => 'false', :is_category => 'false'},
      #   {:phase => Constants::CONST_DRY, :task_category => 'Hang', :name => 'Hang', :duration => 1, :days_from_start_date => 105, :estimated_hours => nil, :is_phase => 'false', :is_category => 'true'},
      #   {:phase => Constants::CONST_DRY, :task_category => 'Hang', :name => 'Hang', :duration => 1, :days_from_start_date => 105, :estimated_hours => nil, :is_phase => 'false', :is_category => 'false'},
      #   {:phase => Constants::CONST_DRY, :task_category => 'Hang', :name => 'Place Limbs on lines in Dry Room', :duration => 1, :days_from_start_date => 105, :estimated_hours => 4, :is_phase => 'false', :is_category => 'false'},
      #   {:phase => Constants::CONST_DRY, :task_category => 'Clean', :name => 'Clean', :duration => 1, :days_from_start_date => 105, :estimated_hours => nil, :is_phase => 'false', :is_category => 'true'},
      #   {:phase => Constants::CONST_DRY, :task_category => 'Clean', :name => 'Clean', :duration => 1, :days_from_start_date => 105, :estimated_hours => nil, :is_phase => 'false', :is_category => 'false'},
      #   {:phase => Constants::CONST_DRY, :task_category => 'Clean', :name => 'Discard Used Rockwool and Hosing', :duration => 1, :days_from_start_date => 105, :estimated_hours => 2, :is_phase => 'false', :is_category => 'false'},
      #   {:phase => Constants::CONST_DRY, :task_category => 'Clean', :name => 'Clean Drip Squares', :duration => 1, :days_from_start_date => 105, :estimated_hours => 2, :is_phase => 'false', :is_category => 'false'},
      #   {:phase => Constants::CONST_DRY, :task_category => 'Clean', :name => 'Clean Benches', :duration => 1, :days_from_start_date => 105, :estimated_hours => 2, :is_phase => 'false', :is_category => 'false'},
      #   {:phase => Constants::CONST_DRY, :task_category => 'Clean', :name => 'Clean Walls', :duration => 1, :days_from_start_date => 105, :estimated_hours => 1, :is_phase => 'false', :is_category => 'false'},
      #   {:phase => Constants::CONST_DRY, :task_category => 'Clean', :name => 'Clean Floors', :duration => 1, :days_from_start_date => 105, :estimated_hours => 1, :is_phase => 'false', :is_category => 'false'},
      #   {:phase => Constants::CONST_DRY, :task_category => 'Clean', :name => 'Sweep Floors', :duration => 1, :days_from_start_date => 105, :estimated_hours => 0.5, :is_phase => 'false', :is_category => 'false'},
      #   {:phase => Constants::CONST_DRY, :task_category => 'Waiting', :name => 'Waiting', :duration => 7, :days_from_start_date => 105, :estimated_hours => nil, :is_phase => 'false', :is_category => 'true'},
      #   {:phase => Constants::CONST_DRY, :task_category => 'Waiting', :name => 'Waiting', :duration => 7, :days_from_start_date => 105, :estimated_hours => nil, :is_phase => 'false', :is_category => 'false'},

      #   {:phase => Constants::CONST_CURE, :task_category => '', :name => 'CURING', :duration => 7, :days_from_start_date => 105, :estimated_hours => nil, :is_phase => 'true', :is_category => 'false'},
      #   {:phase => Constants::CONST_CURE, :task_category => 'Waiting', :name => 'Waiting', :duration => 7, :days_from_start_date => 105, :estimated_hours => nil, :is_phase => 'false', :is_category => 'true'},
      #   {:phase => Constants::CONST_CURE, :task_category => 'Waiting', :name => 'Waiting', :duration => 7, :days_from_start_date => 105, :estimated_hours => nil, :is_phase => 'false', :is_category => 'false'},

      #   # TODO: The following does not match cultivation phases
      #   {:phase => Constants::CONST_TRIM, :task_category => '', :name => 'TRIM / PACKAGE', :duration => 5, :days_from_start_date => 105, :estimated_hours => nil, :is_phase => 'true', :is_category => 'false'},
      #   {:phase => Constants::CONST_TRIM, :task_category => 'Trim', :name => 'Trim', :duration => 2, :days_from_start_date => 105, :estimated_hours => nil, :is_phase => 'false', :is_category => 'true'},
      #   {:phase => Constants::CONST_TRIM, :task_category => 'Trim', :name => 'Trim', :duration => 2, :days_from_start_date => 105, :estimated_hours => nil, :is_phase => 'false', :is_category => 'false'},
      #   {:phase => Constants::CONST_TRIM, :task_category => 'Trim', :name => 'Trim Limbs', :duration => 2, :days_from_start_date => 105, :estimated_hours => 8, :is_phase => 'false', :is_category => 'false'},
      #   {:phase => Constants::CONST_TRIM, :task_category => 'Trim', :name => 'Save Trim', :duration => 2, :days_from_start_date => 105, :estimated_hours => 0.1, :is_phase => 'false', :is_category => 'false'},
      #   {:phase => Constants::CONST_TRIM, :task_category => 'Trim', :name => 'Discard Stems', :duration => 2, :days_from_start_date => 105, :estimated_hours => 0.1, :is_phase => 'false', :is_category => 'false'},
      #   {:phase => Constants::CONST_TRIM, :task_category => 'Package', :name => 'Package', :duration => 2, :days_from_start_date => 107, :estimated_hours => nil, :is_phase => 'false', :is_category => 'true'},
      #   {:phase => Constants::CONST_TRIM, :task_category => 'Package', :name => 'Package', :duration => 2, :days_from_start_date => 107, :estimated_hours => nil, :is_phase => 'false', :is_category => 'false'},
      #   {:phase => Constants::CONST_TRIM, :task_category => 'Package', :name => 'Weigh and Bag', :duration => 2, :days_from_start_date => 115, :estimated_hours => 4, :is_phase => 'false', :is_category => 'false'},
      #   {:phase => Constants::CONST_TRIM, :task_category => 'Package', :name => 'Box Bags', :duration => 2, :days_from_start_date => 115, :estimated_hours => 4, :is_phase => 'false', :is_category => 'false'},
      #   {:phase => Constants::CONST_TRIM, :task_category => 'Package', :name => 'Prepare Sample', :duration => 2, :days_from_start_date => 115, :estimated_hours => 0.1, :is_phase => 'false', :is_category => 'false'},
      #   {:phase => Constants::CONST_TRIM, :task_category => 'Package', :name => 'Enter Into Database', :duration => 2, :days_from_start_date => 115, :estimated_hours => 2, :is_phase => 'false', :is_category => 'false'},
      #   {:phase => Constants::CONST_TRIM, :task_category => 'Clean ', :name => 'Clean', :duration => 1, :days_from_start_date => 117, :estimated_hours => nil, :is_phase => 'false', :is_category => 'true'},
      #   {:phase => Constants::CONST_TRIM, :task_category => 'Clean ', :name => 'Clean', :duration => 1, :days_from_start_date => 117, :estimated_hours => nil, :is_phase => 'false', :is_category => 'false'},
      #   {:phase => Constants::CONST_TRIM, :task_category => 'Clean ', :name => 'Clean Workstations', :duration => 1, :days_from_start_date => 117, :estimated_hours => 0.25, :is_phase => 'false', :is_category => 'false'},
      #   {:phase => Constants::CONST_TRIM, :task_category => 'Clean ', :name => 'Clean and Put Away Supplies', :duration => 1, :days_from_start_date => 117, :estimated_hours => 0.1, :is_phase => 'false', :is_category => 'false'},
      #   {:phase => Constants::CONST_TRIM, :task_category => 'Clean ', :name => 'Vacuum Floors', :duration => 1, :days_from_start_date => 117, :estimated_hours => 0.1, :is_phase => 'false', :is_category => 'false'},
      # ]

      [
        {:phase => 'clone', :task_category => '', :name => 'Clone', :duration => 8, :days_from_start_date => 0, :estimated_hours => nil, :is_phase => 'true', :is_category => 'false'},

        {:phase => 'clone', :task_category => '', :name => 'Prepare trays and cups', :duration => 1, :days_from_start_date => 0, :estimated_hours => nil, :is_phase => 'false', :is_category => 'false'},
        {:phase => 'clone', :task_category => '', :name => 'Prepare mother plants', :duration => 1, :days_from_start_date => 0, :estimated_hours => nil, :is_phase => 'false', :is_category => 'false'},
        {:phase => 'clone', :task_category => '', :name => 'Clip', :duration => 1, :days_from_start_date => 0, :estimated_hours => nil, :is_phase => 'false', :is_category => 'false'},
        {:phase => 'clone', :task_category => '', :name => 'Add nutrients', :duration => 1, :days_from_start_date => 0, :estimated_hours => nil, :is_phase => 'false', :is_category => 'false'},
        {:phase => 'clone', :task_category => '', :name => 'Clean', :duration => 1, :days_from_start_date => 0, :estimated_hours => nil, :is_phase => 'false', :is_category => 'false'},
        {:phase => 'clone', :task_category => '', :name => 'Tag cups', :duration => 1, :days_from_start_date => 0, :estimated_hours => nil, :is_phase => 'false', :is_category => 'false'},
        {:phase => 'clone', :task_category => '', :name => 'Place in clone room', :duration => 1, :days_from_start_date => 0, :estimated_hours => nil, :is_phase => 'false', :is_category => 'false'},
        {:phase => 'clone', :task_category => '', :name => 'Waiting period', :duration => 7, :days_from_start_date => 0, :estimated_hours => nil, :is_phase => 'false', :is_category => 'false'},

        {:phase => 'veg1', :task_category => '', :name => 'Veg 1', :duration => 14, :days_from_start_date => 0, :estimated_hours => nil, :is_phase => 'true', :is_category => 'false'},

        {:phase => 'veg1', :task_category => '', :name => 'Check Veg room for set up', :duration => 1, :days_from_start_date => 0, :estimated_hours => nil, :is_phase => 'false', :is_category => 'false'},
        {:phase => 'veg1', :task_category => '', :name => 'Prepare pots', :duration => 1, :days_from_start_date => 0, :estimated_hours => nil, :is_phase => 'false', :is_category => 'false'},
        {:phase => 'veg1', :task_category => '', :name => 'Add soil and nutrients', :duration => 1, :days_from_start_date => 0, :estimated_hours => nil, :is_phase => 'false', :is_category => 'false'},
        {:phase => 'veg1', :task_category => '', :name => 'Place clones into pots', :duration => 1, :days_from_start_date => 0, :estimated_hours => nil, :is_phase => 'false', :is_category => 'false'},
        {:phase => 'veg1', :task_category => '', :name => 'Place in veg1 room', :duration => 1, :days_from_start_date => 0, :estimated_hours => nil, :is_phase => 'false', :is_category => 'false'},
        {:phase => 'veg1', :task_category => '', :name => 'tag plants', :duration => 1, :days_from_start_date => 0, :estimated_hours => nil, :is_phase => 'false', :is_category => 'false'},
        {:phase => 'veg1', :task_category => '', :name => 'Check on water system', :duration => 1, :days_from_start_date => 0, :estimated_hours => nil, :is_phase => 'false', :is_category => 'false'},
        {:phase => 'veg1', :task_category => '', :name => 'Check environment system', :duration => 0, :days_from_start_date => 0, :estimated_hours => nil, :is_phase => 'false', :is_category => 'false'},
        {:phase => 'veg1', :task_category => '', :name => 'Monitor Daily', :duration => 13, :days_from_start_date => 0, :estimated_hours => nil, :is_phase => 'false', :is_category => 'false'},

        {:phase => 'veg2', :task_category => '', :name => 'Veg2', :duration => 14, :days_from_start_date => 0, :estimated_hours => nil, :is_phase => 'true', :is_category => 'false'},

        {:phase => 'veg2', :task_category => '', :name => 'Check veg 2 room for set up', :duration => 1, :days_from_start_date => 0, :estimated_hours => nil, :is_phase => 'false', :is_category => 'false'},
        {:phase => 'veg2', :task_category => '', :name => 'transfer plant to veg2 room', :duration => 1, :days_from_start_date => 0, :estimated_hours => nil, :is_phase => 'false', :is_category => 'false'},
        {:phase => 'veg2', :task_category => '', :name => 'Add nutrients', :duration => 1, :days_from_start_date => 0, :estimated_hours => nil, :is_phase => 'false', :is_category => 'false'},
        {:phase => 'veg2', :task_category => '', :name => 'Check water', :duration => 1, :days_from_start_date => 0, :estimated_hours => nil, :is_phase => 'false', :is_category => 'false'},
        {:phase => 'veg2', :task_category => '', :name => 'Check environment system', :duration => 1, :days_from_start_date => 0, :estimated_hours => nil, :is_phase => 'false', :is_category => 'false'},
        {:phase => 'veg2', :task_category => '', :name => 'Monitor Daily', :duration => 13, :days_from_start_date => 0, :estimated_hours => nil, :is_phase => 'false', :is_category => 'false'},

        {:phase => 'flower', :task_category => '', :name => 'Flower', :duration => 56, :days_from_start_date => 0, :estimated_hours => nil, :is_phase => 'true', :is_category => 'false'},

        {:phase => 'flower', :task_category => '', :name => 'Check Veg 2 room for set up', :duration => 1, :days_from_start_date => 0, :estimated_hours => nil, :is_phase => 'false', :is_category => 'false'},
        {:phase => 'flower', :task_category => '', :name => 'transfer plant to Veg 2 room', :duration => 1, :days_from_start_date => 0, :estimated_hours => nil, :is_phase => 'false', :is_category => 'false'},
        {:phase => 'flower', :task_category => '', :name => 'Add nutrients', :duration => 1, :days_from_start_date => 0, :estimated_hours => nil, :is_phase => 'false', :is_category => 'false'},
        {:phase => 'flower', :task_category => '', :name => 'Check water', :duration => 1, :days_from_start_date => 0, :estimated_hours => nil, :is_phase => 'false', :is_category => 'false'},
        {:phase => 'flower', :task_category => '', :name => 'Check environment system', :duration => 1, :days_from_start_date => 0, :estimated_hours => nil, :is_phase => 'false', :is_category => 'false'},
        {:phase => 'flower', :task_category => '', :name => 'Monitor Daily', :duration => 55, :days_from_start_date => 0, :estimated_hours => nil, :is_phase => 'false', :is_category => 'false'},

        {:phase => 'harvest', :task_category => '', :name => 'Harvest', :duration => 2, :days_from_start_date => 0, :estimated_hours => nil, :is_phase => 'true', :is_category => 'false'},

        {:phase => 'harvest', :task_category => '', :name => 'Cut plants', :duration => 2, :days_from_start_date => 0, :estimated_hours => nil, :is_phase => 'false', :is_category => 'false'},
        {:phase => 'harvest', :task_category => '', :name => 'Measure wet weight', :duration => 1, :days_from_start_date => 0, :estimated_hours => nil, :is_phase => 'false', :is_category => 'false'},
        {:phase => 'harvest', :task_category => '', :name => 'Remove all Leaves ', :duration => 1, :days_from_start_date => 0, :estimated_hours => nil, :is_phase => 'false', :is_category => 'false'},
        {:phase => 'harvest', :task_category => '', :name => 'Cut Limbs', :duration => 1, :days_from_start_date => 0, :estimated_hours => nil, :is_phase => 'false', :is_category => 'false'},
        {:phase => 'harvest', :task_category => '', :name => 'Collect waste for disposal', :duration => 1, :days_from_start_date => 0, :estimated_hours => nil, :is_phase => 'false', :is_category => 'false'},
        {:phase => 'harvest', :task_category => '', :name => 'Measure weight of waste', :duration => 1, :days_from_start_date => 0, :estimated_hours => nil, :is_phase => 'false', :is_category => 'false'},
        {:phase => 'harvest', :task_category => '', :name => 'Tranfer to harvest to dry room', :duration => 1, :days_from_start_date => 0, :estimated_hours => nil, :is_phase => 'false', :is_category => 'false'},
        {:phase => 'harvest', :task_category => '', :name => 'Tag harvest', :duration => 1, :days_from_start_date => 0, :estimated_hours => nil, :is_phase => 'false', :is_category => 'false'},
        {:phase => 'harvest', :task_category => '', :name => 'Send waste for disposal', :duration => 1, :days_from_start_date => 0, :estimated_hours => nil, :is_phase => 'false', :is_category => 'false'},

        {:phase => 'dry', :task_category => '', :name => 'Dry and Cure', :duration => 10, :days_from_start_date => 0, :estimated_hours => nil, :is_phase => 'true', :is_category => 'false'},

        {:phase => 'dry', :task_category => '', :name => 'Hang dry', :duration => 10, :days_from_start_date => 0, :estimated_hours => nil, :is_phase => 'false', :is_category => 'false'},
        {:phase => 'dry', :task_category => '', :name => 'Monitor dry room', :duration => 10, :days_from_start_date => 0, :estimated_hours => nil, :is_phase => 'false', :is_category => 'false'},
        {:phase => 'dry', :task_category => '', :name => 'when ready, measure weight', :duration => 1, :days_from_start_date => 0, :estimated_hours => nil, :is_phase => 'false', :is_category => 'false'},

        {:phase => 'trim', :task_category => '', :name => 'Trim', :duration => 1, :days_from_start_date => 0, :estimated_hours => nil, :is_phase => 'true', :is_category => 'false'},

        {:phase => 'trim', :task_category => '', :name => 'Trim', :duration => 1, :days_from_start_date => 0, :estimated_hours => nil, :is_phase => 'false', :is_category => 'false'},
        {:phase => 'trim', :task_category => '', :name => 'Trim limbs', :duration => 1, :days_from_start_date => 0, :estimated_hours => nil, :is_phase => 'false', :is_category => 'false'},
        {:phase => 'trim', :task_category => '', :name => 'Save trim', :duration => 1, :days_from_start_date => 0, :estimated_hours => nil, :is_phase => 'false', :is_category => 'false'},
        {:phase => 'trim', :task_category => '', :name => 'Discard stem waste', :duration => 1, :days_from_start_date => 0, :estimated_hours => nil, :is_phase => 'false', :is_category => 'false'},
        {:phase => 'trim', :task_category => '', :name => 'Measure weight of trims', :duration => 1, :days_from_start_date => 0, :estimated_hours => nil, :is_phase => 'false', :is_category => 'false'},
        {:phase => 'trim', :task_category => '', :name => 'Measure weight of waste', :duration => 1, :days_from_start_date => 0, :estimated_hours => nil, :is_phase => 'false', :is_category => 'false'},
        {:phase => 'trim', :task_category => '', :name => 'Send waste for disposal', :duration => 1, :days_from_start_date => 0, :estimated_hours => nil, :is_phase => 'false', :is_category => 'false'},

        {:phase => 'packaging', :task_category => '', :name => 'Packaging', :duration => 2, :days_from_start_date => 0, :estimated_hours => nil, :is_phase => 'true', :is_category => 'false'},

        {:phase => 'packaging', :task_category => '', :name => 'Creat new package batch ID', :duration => 1, :days_from_start_date => 0, :estimated_hours => nil, :is_phase => 'false', :is_category => 'false'},
        {:phase => 'packaging', :task_category => '', :name => 'Prepare sample for testing', :duration => 1, :days_from_start_date => 0, :estimated_hours => nil, :is_phase => 'false', :is_category => 'false'},
        {:phase => 'packaging', :task_category => '', :name => 'Send sample for testing', :duration => 1, :days_from_start_date => 0, :estimated_hours => nil, :is_phase => 'false', :is_category => 'false'},
        {:phase => 'packaging', :task_category => '', :name => 'Create manifest for testing', :duration => 1, :days_from_start_date => 0, :estimated_hours => nil, :is_phase => 'false', :is_category => 'false'},
        {:phase => 'packaging', :task_category => '', :name => 'Create packages', :duration => 2, :days_from_start_date => 0, :estimated_hours => nil, :is_phase => 'false', :is_category => 'false'},
        {:phase => 'packaging', :task_category => '', :name => 'measure weight of packages', :duration => 1, :days_from_start_date => 0, :estimated_hours => nil, :is_phase => 'false', :is_category => 'false'},
        {:phase => 'packaging', :task_category => '', :name => 'Create ID tags for packages', :duration => 1, :days_from_start_date => 0, :estimated_hours => nil, :is_phase => 'false', :is_category => 'false'},
        {:phase => 'packaging', :task_category => '', :name => 'Create and attach labels', :duration => 1, :days_from_start_date => 0, :estimated_hours => nil, :is_phase => 'false', :is_category => 'false'},

      ]
    end

    def valid_permission?
      true
    end

    def valid_data?
      errors.add(:facility_strain_id, 'Facility strain is required.') if Inventory::FacilityStrain.find(args[:facility_strain_id]).nil?
      errors.add(:start_date, 'Start date is required.') if args[:start_date].blank?
      errors.add(:grow_method, 'Grow method is required.') if args[:grow_method].blank?
      errors.add(:batch_source, 'Batch source is required.') if args[:batch_source].blank?
      errors.add(:quantity, 'Quantity is required.') if args[:quantity].blank?
      errors.add(:facility_id, 'Facility is required.') if args[:facility_id].blank?
      errors.add(:phase_duration, 'Phase duration is required.') if args[:phase_duration].blank?
      errors.empty?
    end

    def save_record(args)
      # build a phase schedule hash
      phase_schedule = build_phase_schedule(args[:start_date], args[:phase_duration])

      batch = Cultivation::Batch.new
      batch.facility_id = args[:facility_id]
      batch.batch_source = args[:batch_source]
      batch.facility_strain_id = args[:facility_strain_id]
      batch.start_date = args[:start_date]
      batch.estimated_harvest_date = phase_schedule[Constants::CONST_DRY][0] # Start Day of Dry is the Harvest Date
      batch.grow_method = args[:grow_method]
      batch.quantity = args[:quantity]
      batch.batch_no = NextFacilityCode.call(:batch, Cultivation::Batch.last.try(:batch_no)).result
      batch.name = batch.batch_no
      batch.current_growth_stage = Constants::CONST_CLONE

      # TODO [ANDY]: UPDATE PHASE DURATION

      batch.save!

      phase_id = nil
      category_id = nil
      new_tasks = []
      start_date = nil
      task_templates.each do |task|
        task_id = BSON::ObjectId.new
        new_task = build_task(task_id, batch, start_date, task, phase_id, category_id, phase_schedule)
        new_tasks << new_task
        if task[:is_phase] == 'true'
          phase_id = task_id
          category_id = nil
        end
        category_id = task_id if task[:is_category] == 'true'
      end

      Cultivation::Task.create(new_tasks)
      batch
    end

    def build_phase_schedule(start_date, phase_duration)
      b_start_date = Time.parse(start_date)

      clone_start_date = b_start_date
      clone_end_date = clone_start_date + (phase_duration[Constants::CONST_CLONE].to_i).days

      veg_start_date = clone_end_date + 1
      veg_end_date = veg_start_date + (phase_duration[Constants::CONST_VEG].to_i).days

      veg1_start_date = clone_end_date + 1
      veg1_end_date = veg1_start_date + (phase_duration[Constants::CONST_VEG1].to_i).days

      veg2_start_date = veg1_end_date + 1
      veg2_end_date = veg2_start_date + (phase_duration[Constants::CONST_VEG2].to_i).days

      flower_start_date = veg2_end_date + 1
      flower_end_date = flower_start_date + (phase_duration[Constants::CONST_FLOWER].to_i).days

      dry_start_date = flower_end_date + 1
      dry_end_date = dry_start_date + (phase_duration[Constants::CONST_DRY].to_i).days

      cure_start_date = dry_end_date + 1
      cure_end_date = cure_start_date + (phase_duration[Constants::CONST_CURE].to_i).days

      {
        Constants::CONST_CLONE => [clone_start_date, clone_end_date, phase_duration[Constants::CONST_CLONE].to_i],
        Constants::CONST_VEG => [veg_start_date, veg_end_date, (phase_duration[Constants::CONST_VEG].to_i)],
        Constants::CONST_VEG1 => [veg1_start_date, veg1_end_date, (phase_duration[Constants::CONST_VEG1].to_i)],
        Constants::CONST_VEG2 => [veg2_start_date, veg2_end_date, (phase_duration[Constants::CONST_VEG2].to_i)],
        Constants::CONST_FLOWER => [flower_start_date, flower_end_date, (phase_duration[Constants::CONST_FLOWER].to_i)],
        Constants::CONST_DRY => [dry_start_date, dry_end_date, (phase_duration[Constants::CONST_DRY].to_i)],
        Constants::CONST_CURE => [cure_start_date, cure_end_date, (phase_duration[Constants::CONST_CURE].to_i)],
      }
    end

    def build_task(task_id, batch, start_date, task, phase_id, category_id, phase_schedule)
      parent_id = get_parent_id(task, phase_id, category_id)
      depend_on = get_depend_on(task, phase_id, category_id)

      if to_boolean(task[:is_phase]) && phase_schedule[task[:phase]]
        # Rails.logger.debug "\033[31m Task is_phase: #{task[:phase]} \033[0m"
        # is_phase Tasks, use the duration that the user set
        start_date = phase_schedule[task[:phase]][0]
        end_date = phase_schedule[task[:phase]][1]
        duration = phase_schedule[task[:phase]][2]
      else
        start_date = phase_schedule[task[:phase]][0] if phase_schedule[task[:phase]]
        duration = nil # task[:duration].to_i unless task[:duration].nil?
        end_date = nil
      end

      record = {
        id: task_id,
        batch_id: batch.id,
        phase: task[:phase],
        task_category: task[:task_category],
        name: task[:name],
        duration: duration,
        start_date: start_date,
        end_date: end_date,
        days_from_start_date: task[:days_from_start_date],
        estimated_hours: task[:estimated_hours],
        is_phase: to_boolean(task[:is_phase]),
        is_category: to_boolean(task[:is_category]),
        parent_id: parent_id,
        depend_on: depend_on,
      }
      record
    end

    def get_parent_id(task, phase_id, category_id)
      if task[:is_category] == 'false' and task[:is_phase] == 'false' #normal task
        # [fathi] - temporary change for demo
        # parent_id = category_id
        parent_id = phase_id
      elsif task[:is_category] == 'true' and task[:is_phase] == 'false' #category task
        parent_id = phase_id
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
  end
end

# phase(parent) is depending on other phase(parent)
# if start_date of parent change, child will change
# parallel task only depend on parent

#Phase has many category
#Category has many children task
#Some task depend on other task
#If some children task extend or reduce duration, it will affect category date, will affect other date too
