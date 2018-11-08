class FindDefaultFacility
  prepend SimpleCommand

  def initialize(current_user)
    raise ArgumentError, 'current_user' if current_user.nil?

    @current_user = current_user
  end

  def call
    # TODO::ANDY should only return facility that exists in the database
    default_facility = @current_user&.default_facility_id
    default_facility ||= @current_user&.facilities&.first

    if default_facility.nil?
      err_message = "#{@current_user.email} do not have a default facility. Set a default facility for user via \"Team Settings\"."
      Rails.logger.debug "\033[31m WARNING: #{err_message} \033[0m"
      Rollbar.warning(err_message)
      nil
    else
      Facility.find(default_facility)
    end
  end
end
