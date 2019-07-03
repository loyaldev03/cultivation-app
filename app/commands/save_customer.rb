
class SaveCustomer
  prepend SimpleCommand

  attr_reader :args

  def initialize(args = {})
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
    params = args.except(:id)
    customer = if id.present?
                 Sales::Customer.find_by(id: id)
               else
                 Sales::Customer.find_by(name: params[:name])
               end

    if customer
      Rails.logger.debug("CUSTOMER ATTRIBUTES UPDATE--->#{params}")
      customer.update(params)
      customer
    else
      # TODO: Temporary solution!
      Rails.logger.debug("CUSTOMER ATTRIBUTES NEW--->#{params}")
      Sales::Customer.create!(params)
    end
  end

  def valid?
    errors.add(:name, 'Customer name cannot be empty') if args['name'].blank?
    errors.empty?
  end
end
