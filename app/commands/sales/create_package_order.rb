module Sales
  class CreatePackageOrder
    prepend SimpleCommand
    attr_reader :current_user,
                :args

    def initialize(current_user, args)
      @current_user = current_user
      @args = args
    end

    def call
      package_ids = @args[:packages].map { |a| a[:id] }
      if @args[:customer_id].present?
        customer_id = @args[:customer_id]
      else
        customer = Sales::Customer.new(
          name: @args[:customer][:value],
          state_license: @args[:state_license],
          mobile_number: @args[:mobile_number],
        )
        customer.save
        Rails.logger.debug "Customer error saving ===> #{customer.errors.inspect}"
        customer_id = customer.id
      end
      order = Sales::PackageOrder.create(
        order_no: @args[:order_no],
        status: 'new',
        customer_id: customer_id,
      )
      packages = Inventory::ItemTransaction.in(id: package_ids)
      packages.update_all(package_order_id: order.id, status: 'sold')
    end

    private
  end
end
