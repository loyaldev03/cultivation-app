module Inventory
  class MetrcTagSerializer
    include FastJsonapi::ObjectSerializer

    attributes :tag, :tag_type, :status, :replaced_by, :u_at

    attribute :id do |object|
      object.id.to_s
    end
  end
end
