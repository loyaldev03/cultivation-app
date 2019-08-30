
class SaveCustomer
  prepend SimpleCommand

  attr_reader :args

  def initialize(args = {})
    #@args = args
    @args = HashWithIndifferentAccess.new(args) # wrap with this so access by symbol and string works
  end

  def call
    if valid?
      save_record
    else
      nil
    end
  end

  private

  def save_record
    id = args[:id]
    params = args.except(:id, :address, :zipcode, :state, :country, :city)
    customer = if id.present?
                 Sales::Customer.find_by(id: id)
               else
                 Sales::Customer.find_by(name: params[:name])
               end

    if customer
      Rails.logger.debug("CUSTOMER ATTRIBUTES UPDATE--->#{params}")
      customer.name = @args[:name]
      customer.account_no = @args[:account_no]
      customer.license_type = @args[:license_type]
      customer.state_license = @args[:state_license]
      if customer.addresses.any?
        customer.addresses.first.address = @args[:address] if @args[:address].present?
        customer.addresses.first.zipcode = @args[:zipcode] if @args[:zipcode].present?
        customer.addresses.first.city = @args[:city]
        customer.addresses.first.state = @args[:state]
        customer.addresses.first.country = @args[:country]
      else
        if @args[:address].present? || @args[:zipcode].present? || @args[:city].present? || @args[:state].present? || @args[:country].present?
          customer.addresses.build(args.except(:id, :name, :account_no, :license_type, :state_license))
        end
      end

      customer.save!
      customer
    else
      # TODO: Temporary solution!
      Rails.logger.debug("CUSTOMER ATTRIBUTES NEW--->#{params}")
      new_customer = Sales::Customer.new(params)
      new_customer.name = @args[:name]
      new_customer.account_no = @args[:account_no]
      new_customer.license_type = @args[:license_type]
      new_customer.state_license = @args[:state_license]
      new_customer.addresses.build(args.except(:id, :name, :account_no, :license_type, :state_license))

      new_customer.save!
      new_customer
    end
  end

  def valid?
    errors.add(:name, 'Customer name cannot be empty') if args['name'].blank?
    errors.empty?
  end
end
