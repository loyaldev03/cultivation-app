class Api::V1::CustomersController < Api::V1::BaseApiController
  def index
    customers = Sales::Customer.all

    render json: CustomerSerializer.new(customers).serialized_json
  end

  def show
    customer = Sales::Customer.find(params[:id])
    render json: CustomerSerializer.new(customer).serialized_json
  end

  def create
    command = SaveCustomer.call(params[:customer].to_unsafe_h)
    if command.success?
      result = command.result
      #raise "#{result}"
      render json: CustomerSerializer.new(result).serialized_json
    else
      render json: params[:customer].to_unsafe_h.merge(errors: command.errors), status: 422
    end
  end
end
