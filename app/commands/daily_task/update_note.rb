module DailyTask
  class UpdateNote
    prepend SimpleCommand

    attr_reader :current_user, :task_id, :note_id, :body

    def initialize(current_user, task_id, note_id, body)
      @current_user = current_user
      @task_id = task_id.to_bson_id if task_id.present?
      @note_id = note_id.to_bson_id if note_id.present?
      @body = body
    end

    def call
      if valid_params?
        task = Cultivation::Task.find_by(id: task_id)
        if note_id.nil?
          note = task.notes.build(body: body, modifier: current_user)
        else
          note = task.notes.detect { |n| n.id == note_id }
          note.body = body
          note.modifier = current_user
        end
        note.save!
        note[:u_by] = current_user.display_name
        note
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
