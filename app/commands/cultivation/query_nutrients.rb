module Cultivation
  class QueryNutrients
    prepend SimpleCommand

    attr_reader :batch_id, :phases

    def initialize(batch_id, phases)
      @batch_id = batch_id.to_bson_id
      @phases = phases.split(',') if phases.present?
    end

    def call
      batch_tasks = Cultivation::Task.where(batch_id: batch_id,
                                            indelible: 'add_nutrient')
      batch_tasks = batch_tasks.where(:phase.in => phases) if phases.present?
      nutrients = batch_tasks.map do |t|
        if t.add_nutrients.present?
          t.add_nutrients.map do |n|
            {
              phase: t.phase,
              task_name: t.name,
              element: n.element,
              value: n.value,
              checked: n.checked,
            }
          end
        end
      end
      nutrients.flatten.compact
    end
  end
end
