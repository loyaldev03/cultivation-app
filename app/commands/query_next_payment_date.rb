class QueryNextPaymentDate
  prepend SimpleCommand

  attr_reader :date

  def initialize(date)
    raise ArgumentError, 'date' if date.nil?
    @date = date
  end

  def call
    calculate_next_friday(date)
  end

  private

  def calculate_next_friday(date)
    if date.friday?
      date
    elsif date.strftime('%w').to_i < 5
      num_days = date.strftime('%w').to_i
      date + (5 - num_days).days
    else
      date.next_week(:friday)
    end
  end
end
