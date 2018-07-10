module CoreForm
  class UnitOfMeasureForm
    include ActiveModel::Model

    delegate :id, :name, :code, :desc, to: :uom

    validates :name, presence: true
    validates :code, presence: true
    validates_with UniqUomCodeValidator

    def initialize(_record = nil)
      @uom = _record
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
      @uom ||= UnitOfMeasure.new
    end
  end
end
