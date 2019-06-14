module Common
  class SeedGrowMethod
    prepend SimpleCommand

    def initialize(args = {})
      @args = args
    end

    def call
      seed_grow_method!
      nil
    end

    private

    def seed_grow_method!
      grow_method_templates.each do |raw_material|
        Common::GrowMethod.find_or_create_by!(raw_material)
      end
    end

    def grow_method_templates
      [
        {name: 'Aerophonics', is_active: true},
        {name: 'Coco noir', is_active: true},
        {name: 'Compost soil', is_active: true},
        {name: 'Aerophonics', is_active: true},
        {name: 'Hardened Expanded Clay (HEC)', is_active: true},
        {name: 'Hydrophonics', is_active: true},
        {name: 'Mineral Wool', is_active: true},
        {name: 'Peat', is_active: true},
        {name: 'Perlite', is_active: true},
        {name: 'Soil', is_active: true},
        {name: 'Sphagnum', is_active: true},
        {name: 'Vermiculite', is_active: true},
      ]
    end
  end
end
