module Common
  class GrowPhaseSerializer
    include FastJsonapi::ObjectSerializer
    attributes :name, :is_active, :number_of_days

    attribute :id do |object|
      object.id.to_s
    end
  end
end
