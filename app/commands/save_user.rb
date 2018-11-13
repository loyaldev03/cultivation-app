class SaveUser
  prepend SimpleCommand

  attr_reader :args

  def initialize(args = {}, current_user)
    @args = args
    @current_user = current_user
  end

  def call
    if args[:id]
      user = User.find(args[:id])
      user.email = args[:email]
      user.password = args[:password]
      user.first_name = args[:first_name]
      user.last_name = args[:last_name]
      user.title = args[:title]
      if args[:photo_data].blank?
        user.photo = nil
      else
        user.photo_data = args[:photo_data]
      end
      user.is_active = args[:is_active]
      user.hourly_rate = args[:hourly_rate]
      user.overtime_hourly_rate = args[:overtime_hourly_rate]
      user.default_facility_id = args[:default_facility_id]
      user.roles = args[:roles].map(&:to_bson_id) if args[:roles]
      user.facilities = args[:facilities].map(&:to_bson_id) if args[:facilities]
      user.timezone = get_timezone(user, @current_user)
      user.save!
    else
      user = User.new(args)
      user.save!
    end
    user
  end

  private

  def get_timezone(user, current_user)
    timezone = Facility.find(user.default_facility_id)&.timezone if user.default_facility_id.present?
    timezone ||= Facility.find(user.facilities.first)&.timezone if user.facilities.any?
    timezone ||= current_user.timezone
    timezone
  end
end
