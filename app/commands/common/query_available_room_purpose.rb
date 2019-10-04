module Common
  class QueryAvailableRoomPurpose
    prepend SimpleCommand

    attr_accessor :active_growth_stages

    def initialize; end

    def call
      all_purposes = Constants::FACILITY_ROOMS_ORDER
      growth_phases = Common::GrowPhase.all.to_a

      active_phases = growth_phases.select(&:is_active).pluck(:name)
      inactive_phases = growth_phases.reject(&:is_active).pluck(:name)

      self.active_growth_stages = active_phases &
        Constants::REQUIRED_BOOKING_PHASES

      all_purposes - inactive_phases
    end

    def result_options
      result.map { |p| [p.capitalize, p] }
    end
  end
end
