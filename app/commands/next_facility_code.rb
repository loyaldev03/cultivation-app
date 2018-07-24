class NextFacilityCode
  prepend SimpleCommand

  def initialize(code_type, last_code = nil, increment = 1)
    @code_format_name = "#{code_type}_code_format"
    raise "Invalid code_type: #{code_type}" unless Sequence.respond_to?(@code_format_name)
    @last_code = last_code
    @increment = increment
  end

  def call
    code_format = Sequence.send(@code_format_name)
    generate_next_code(@last_code, code_format, @increment)
  end

  private

  def generate_next_code(last_code, code_format, increment)
    if last_code.present?
      next_times(last_code, increment)
    else
      code_format % increment
    end
  end

  def next_times(code, increment = 1)
    result = code
    increment.times { result = result.next }
    result
  end
end
