module Common
  class QueryGrowPhase
    prepend SimpleCommand

    def initialize(args = {})
      @args = args
    end

    def call
      json = []
      Constants::GROW_PHASES.each do |p|
        Common::GrowPhase.find_or_create_by(name: p)
      end

      Common::GrowPhase.all.order(name: :asc).each do |phase|
        json << {
          id: phase.id.to_s,
          type: 'grow_phase',
          attributes: {
            id: phase.id.to_s,
            name: phase.name,
            is_active: phase.is_active,
            number_of_days: phase.number_of_days,
            number_of_days_avg: phase.number_of_days_avg,
          },

        }
      end

      {
        data: json,
      }
    end
  end
end
