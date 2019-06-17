module Common
  class SeedGrowPhase
    prepend SimpleCommand

    def initialize(args = {})
      @args = args
    end

    def call
      seed_grow_phase!
      nil
    end

    private

    def seed_grow_phase!
      grow_phase_templates.each do |phase|
        Common::GrowPhase.find_or_create_by!(phase)
      end
    end

    def grow_phase_templates
      [
        {name: 'Clone'},
        {name: 'Cure'},
        {name: 'Drying'},
        {name: 'Flower'},
        {name: 'Mother'},
        {name: 'Storage'},
        {name: 'Vault'},
        {name: 'Trim'},
        {name: 'Veg', is_active: false},
        {name: 'Veg 1', is_active: false},
        {name: 'Veg 2', is_active: false},
        {name: 'Harvest'},
      ]
    end
  end
end
