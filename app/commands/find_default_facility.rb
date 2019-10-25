class FindDefaultFacility
  prepend SimpleCommand

  def initialize(current_user)
    raise ArgumentError, 'current_user' if current_user.nil?

    @current_user = current_user
  end

  def call
    default_facility = @current_user&.default_facility_id
    default_facility ||= @current_user&.facilities&.first

    if default_facility.nil?
      err_message = "#{@current_user.email} do not have a default facility. Set a default facility for user via \"Team Settings\"."
      Rollbar.warning(err_message)
      nil
    else
      facility = Facility.find_by(id: default_facility)
      if facility.nil?
        Rollbar.info "#{@current_user.email} has an invalid facility"
      end
      facility
    end
  end
end
