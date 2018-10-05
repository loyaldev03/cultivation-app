class SaveRole
  prepend SimpleCommand

  attr_reader :args

  def initialize(args = {})
    @args = args
  end

  def call
    if args[:id]
      role = Common::Role.find(args[:id])
      role.name = args[:name]
      role.desc = args[:desc]
      role.save!
    else
      role = Common::Role.new
      role.name = args[:name]
      role.desc = args[:desc]
      role.save!
    end
    role
  end
end
