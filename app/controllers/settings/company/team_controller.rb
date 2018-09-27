class Settings::Company::TeamController < ApplicationController
  def index
    # Show list of Groups
    # Show list of Job Roles (Permission Group)
    @roles = Common::QueryRoles.call.result.all
    # Show list of Users
    @users = User.all
  end
end
