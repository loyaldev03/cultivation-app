class Ability
  include CanCan::Ability

  def initialize(user)
    user ||= User.new
    if user.user_mode == 'admin'
      can :manage, :all
    elsif user.user_mode == 'manager'
      can :manage, :all
      cannot :manage, Settings::Company::TeamController
    elsif user.user_mode == 'worker'
      can :worker_dashboard, HomeController
      can :worker_schedule, HomeController
      can :manage, DailyTasksController
    end
  end
end
