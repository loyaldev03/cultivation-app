module Cultivation
  class WorkDay
    include Mongoid::Document
    include Mongoid::Timestamps::Short

    field :user_id, type: BSON::ObjectId
    field :date, type: DateTime
    field :is_done, default: -> { false } # indicate the task is done for the day

    validates_presence_of :user_id, :date
    validates_uniqueness_of :user_id, scope: :date # one record per user per day of work

    embedded_in :task
    belongs_to :user
    embeds_many :work_logs, class_name: 'Cultivation::WorkLog::Log'
  end
end
