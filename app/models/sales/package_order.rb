module Sales
  class PackageOrder
    include Mongoid::Document
    include Mongoid::Timestamps::Short

    field :order_no, type: String
    field :status, type: String #default new

    # has_many :harvest_packages
    belongs_to :customer
  end
end
