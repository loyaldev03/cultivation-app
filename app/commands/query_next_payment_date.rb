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
      date.beginning_of_week + 5.days
    else
      date.next_week(:friday)
    end
  end
end
