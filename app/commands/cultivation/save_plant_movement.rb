module Cultivation
  class SavePlantMovement
    prepend SimpleCommand

    def initialize(current_user, args)
      @current_user = current_user
      @args = {
        batch_id: nil, # BSON::ObjectId
        task_id: nil,  # BSON::ObjectId
      }.merge(args)
    end

    def call
      if valid_params?
        Rails.logger.debug "\033[31m Calling SavePlantMovement \033[0m"
        Rails.logger.debug "\033[31m Calling SavePlantMovement \033[0m"
        Rails.logger.debug "\033[31m Calling SavePlantMovement \033[0m"
        Rails.logger.debug "\033[31m Calling SavePlantMovement \033[0m"
        Rails.logger.debug "\033[31m Calling SavePlantMovement \033[0m"
        Rails.logger.debug "\033[31m Calling SavePlantMovement \033[0m"
        Rails.logger.debug "\033[31m Calling SavePlantMovement \033[0m"
      end
    end

    private

    def valid_params?
      if @current_user.nil?
        errors.add(:current_user, 'current_user is required')
      end
      if @batch_id.nil?
        errors.add(:batch_id, 'batch_id is required')
      end
      errors.empty?
    end
  end
end
