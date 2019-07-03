class Sales::CustomersController < ApplicationController
  def index
    @records = QueryCustomer.call.result
  end

  def new
    @record = SaleForm::CustomerForm.new
  end

  def create
    @record = Sales::Customer.new
    @record.name = record_params[:name]
    @record.account_no = record_params[:account_no]
    if record_params[:addresses].present?
      @record.addresses = []
      Rails.logger.debug('TRUE!!!')
      Rails.logger.debug("TRUE!!! #{record_params[:addresses][:address]}")
      @record.addresses.build({
        address: record_params[:addresses][:address],
        zipcode: record_params[:addresses][:zipcode],
        country: record_params[:addresses][:country],
        city: record_params[:addresses][:city],
        state: record_params[:addresses][:state],
      })
    end
    if @record.save
      render 'layouts/hide_sidebar', layouts: nil
    else
      render 'new', layout: nil
    end
  end

  def show
    @record = SaleForm::CustomerForm.new(params[:id])
  end

  def edit
    @record = Sales::Customer.find(params[:id])
    #   @addresses = @record.addresses
    #   .map { |a|
    #   {
    #     address: a[:address],
    #     zipcode: a[:zipcode],
    #     country: a[:country],
    #     city: a[:city]
    #   }
    # }
  end

  def update
    @record = Sales::Customer.find(params[:id])
    @record.name = record_params[:name]
    @record.customer_no = record_params[:account_no]
    if record_params[:addresses].present?
      @record.addresses = []
      Rails.logger.debug('TRUE!!!')
      Rails.logger.debug("TRUE!!! #{record_params[:addresses][:address]}")
      @record.addresses.build({
        address: record_params[:addresses][:address],
        zipcode: record_params[:addresses][:zipcode],
        country: record_params[:addresses][:country],
        city: record_params[:addresses][:city],
        state: record_params[:addresses][:state],
      })
    end

    if @record.save
      render 'layouts/hide_sidebar', layouts: nil
    else
      render 'edit', layout: nil
    end
  end

  def destroy
    command = DestroyCustomer.call(params[:id])
    if command.success?
      render 'layouts/hide_sidebar', layouts: nil
    else
      flash[:error] = 'Unable to delete'
      render 'edit', layout: nil
    end
  end

  private

  def record_params
    params.require(:record).permit(:name, :account_no, addresses: [:id, :address, :zipcode, :country, :city, :state, :_destroy], addresses_attributes: [:_id, :address, :zipcode, :country, :city, :_destroy])
  end

  def update_params
    {id: params[:id]}.merge(record_params)
  end
end
