class DailyTasksController < ApplicationController
  def index
    @todo = current_user.cultivation_tasks.expected_on(Date.today).to_a
    @done = []
  end
end
