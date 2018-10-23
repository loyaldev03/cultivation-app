module Cultivation
  class QueryBatch
    prepend SimpleCommand

    def initialize(args = {})
      @args = args
    end

    def call
      record = Cultivation::Batch.includes(:facility_strain).where(@args)
    end
  end
end
