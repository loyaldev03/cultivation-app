module Common
  class GrowPhaseSerializer
    include FastJsonapi::ObjectSerializer
    attributes :name, :is_active

    attribute :id do |object|
      object.id.to_s
    end
  end
end
