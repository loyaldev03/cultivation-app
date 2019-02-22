module Cultivation
  class Note
    include Mongoid::Document
    include Mongoid::Timestamps::Short

    field :body, type: String

    embedded_in :task, class_name: 'Cultivation::Task', inverse_of: :notes

    # Modifier / created / updated
  end
end
