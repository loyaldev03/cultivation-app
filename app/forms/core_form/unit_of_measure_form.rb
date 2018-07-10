module CoreForm
  class UnitOfMeasureForm
    include ActiveModel::Model

    delegate :id, :name, :code, :desc, to: :uom

    validates :name, presence: true
    validates :code, presence: true
    validates_with UniqUomCodeValidator

    def initialize(uom_id = nil)
      @uom_id = uom_id
    end

    def submit(params)
      uom.attributes = params.slice(:name, :code, :desc, to: :uom)
      if valid?
        uom.save!
      else
        false
      end
    end

    private

    def uom
      if @uom_id.nil?
        @uom ||= UnitOfMeasure.new
      else
        @uom ||= UnitOfMeasure.find_by(id: @uom_id)
      end
    end
  end
end
