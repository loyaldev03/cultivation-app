module Common
  class QueryAvailableRoomPurpose
    prepend SimpleCommand

    attr_accessor :active_growth_stages

    def initialize
    end

    def call
      active_purposes = Common::GrowPhase.where(is_active: true).pluck(:name)
      growth_purposes = Constants::ROOM_ONLY_SETUP

      self.active_growth_stages = active_purposes &
                                  Constants::REQUIRED_BOOKING_PHASES
      active_purposes | growth_purposes
    end

    def result_options
      result.map { |p| [p.capitalize, p] }
    end
  end
end
