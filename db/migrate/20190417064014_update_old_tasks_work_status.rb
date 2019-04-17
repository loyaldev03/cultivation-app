class UpdateOldTasksWorkStatus < Mongoid::Migration
  def self.up
    Cultivation::Task.
      where(work_status: "not_started").
      update(work_status: "new")
  end

  def self.down
  end
end
