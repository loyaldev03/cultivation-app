class SaveRole
  prepend SimpleCommand

  attr_reader :args

  def initialize(args = {}, current_user)
    @args = args
  end

  def call
    if args[:id]
      role = Common::Role.find(args[:id])
      return role if role.readonly?
    else
      role = Common::Role.new
    end
    role.name = args[:name]
    role.desc = args[:desc]
    role.permissions = map_permissions(args[:permissions])
    role.save!
    role
  end

  private

  def map_permissions(permissions)
    permissions.map do |p|
      {
        code: p[:code],
        value: p[:value],
      }
    end
  end
end
