class QueryUserFacilities
  prepend SimpleCommand

  def initialize(current_user)
    raise ArgumentError, 'current_user' if current_user.nil?

    @current_user = current_user
  end

  def call
    Facility
      .completed
      .where(:_id.in => @current_user.facilities)
  end
end
