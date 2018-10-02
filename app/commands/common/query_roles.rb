module Common
  class QueryRoles
    prepend SimpleCommand

    def initialize(args = {})
      @args = args
    end

    def call
      Common::Role.where(@args)
    end
  end
end
