module Cultivation
  class SavePlantMovement
    prepend SimpleCommand

    attr_reader :current_user, :args

    # NOTE: When user finishes recording the plants movements & hit the save
    # button, this command will run and record all the plants movement scans.
    # After the task which own this history is completed. The actual plant
    # location will also be update (by MovePlantsToNextPhaseJob)

    def initialize(current_user, args)
      @current_user = current_user
      @args = {
        batch_id: nil, # BSON::ObjectId
        task_id: nil,  # BSON::ObjectId
      }.merge(args)
    end

    def call
      if valid_params?
        task = Cultivation::Task.find(
          args[:task_id].to_bson_id,
        )

        if task.indelible == 'clip_pot_tag'
          hist = Cultivation::PlantMovementHistory.find_or_initialize_by(
            batch_id: args[:batch_id].to_bson_id,
            task_id: task.id,
            phase: task.phase,
            activity: task.indelible,
            mother_plant_id: args[:mother_plant_id].to_bson_id,
            mother_plant_code: args[:mother_plant_code],
          )
        elsif task.indelible == 'moving_to_tray' || task.indelible == 'moving_to_next_phase'
          hist = Cultivation::PlantMovementHistory.find_or_initialize_by(
            batch_id: args[:batch_id].to_bson_id,
            task_id: task.id,
            phase: task.phase,
            activity: task.indelible,
            destination_id: args[:destination_id],
            destination_code: args[:destination_code],
            destination_type: args[:destination_type],
          )
        end

        hist.plants = args[:plants]
        hist.user_id = current_user.id
        hist.user_name = current_user.display_name
        hist.save!
        hist
      end
    end

    private

    def valid_params?
      if current_user.nil?
        errors.add(:current_user, 'current_user is required')
      end
      if args[:batch_id].nil?
        errors.add(:batch_id, 'batch_id is required')
      end
      if args[:task_id].nil?
        errors.add(:task_id, 'batch_id is required')
      end
      errors.empty?
    end
  end
end
