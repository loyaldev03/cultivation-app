module DailyTask
  class UpdateNutrients
    prepend SimpleCommand

    attr_reader :current_user, :task_id, :nutrients

    def initialize(current_user, task_id, nutrients)
      @current_user = current_user
      @task_id = task_id.to_bson_id if task_id.present?
      @nutrients = nutrients
    end

    def call
      if valid_params?
        task = Cultivation::Task.find_by(id: task_id)
        task.material_use.each do |n|
          if nutrients.map { |a| a[:product_id] }.include? n.product_id.to_s
            n.checked = nutrients.detect { |a| a[:product_id] == n.product_id.to_s }[:checked]
          end
        end
        task.modifier = current_user
        task.save!
        task
      end
    end

    private

    def valid_params?
      if current_user.nil?
        errors.add(:error, 'Missing param :current_user')
        return false
      end
      if task_id.nil?
        errors.add(:error, 'Missing param :task_id')
        return false
      end
      true
    end
  end
end
