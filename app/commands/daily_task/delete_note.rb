module DailyTask
  class DeleteNote
    prepend SimpleCommand

    attr_reader :current_user, :task_id, :note_id

    def initialize(current_user, task_id, note_id)
      @current_user = current_user
      @task_id = task_id&.to_bson_id
      @note_id = note_id&.to_bson_id
    end

    def call
      if valid_params?
        task = Cultivation::Task.find_by(id: task_id)
        note = task.notes.detect { |n| n.id == note_id }
        note.destroy
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
