module Cultivation
  class CreateEmptyBatch
    attr_reader :name, :batch_no, :facility, :strain

    def call()
      Cultivation::Batch.create(
        name: 'batch',
        batch_no: batch_no,
        batch_source: '',
        strain: strain,
        start_date: nil,
        facility: facility,
      )
    end
  end
end
