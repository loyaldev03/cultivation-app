module Common
  class QueryAvailableRoomPurpose
    prepend SimpleCommand

    def initialize
    end

    def call
      active_purposes = Common::GrowPhase.where(is_active: true).pluck(:name)
      growth_purposes = Constants::ROOM_ONLY_SETUP
      active_purposes | growth_purposes
    end

    def result_options
      self.result.collect {|p| [p.capitalize, p]}
    end
  end
end
