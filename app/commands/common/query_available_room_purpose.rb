module Common
  class QueryAvailableRoomPurpose
    prepend SimpleCommand

    attr_accessor :active_growth_stages

    def initialize
    end

    def call
      all_purposes = Constants::FACILITY_ROOMS_ORDER

      not_active = Common::GrowPhase.where(is_active: false).pluck(:name)
      # growth_purposes = Constants::ROOM_ONLY_SETUP

      # self.active_growth_stages = active_purposes &
      #                             Constants::REQUIRED_BOOKING_PHASES
      # active_purposes | growth_purposes
      all_purposes - not_active
    end

    def result_options
      result.map { |p| [p.capitalize, p] }
    end
  end
end
