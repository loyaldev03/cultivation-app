class SaveUser
  prepend SimpleCommand

  attr_reader :args

  def initialize(args = {})
    @args = args
  end

  def call
    if args[:id]
      user = User.find(id: args[:id])
      user.email = args[:email]
      user.password = args[:password]
      user.first_name = args[:first_name]
      user.last_name = args[:last_name]
      user.title = args[:title]
      user.photo_data = args[:photo_data]
      user.is_active = args[:is_active]
      user.default_facility_id = args[:default_facility_id]
      user.roles = args[:roles].map(&:to_bson_id) if args[:roles]
      user.facilities = args[:facilities].map(&:to_bson_id) if args[:facilities]
      user.save!
    else
      user = User.new(args)
      user.save!
    end
    user
  end
end
