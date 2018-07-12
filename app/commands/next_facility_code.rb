class NextFacilityCode
  prepend SimpleCommand

  def initialize(args = {})
    @code_format_name = "#{args[:code_type]}_code_format"
    raise 'Invalid code type' unless Sequence.respond_to?(@code_format_name)
    @last_code = args[:last_code]
    @offset = args[:offset] || 1
  end

  def call
    code_format = Sequence.send(@code_format_name)
    generate_next_code(@last_code, code_format, @offset)
  end

  private

  def generate_next_code(last_code, code_format, offset)
    if last_code.present?
      next_times(last_code, offset)
    else
      code_format % offset
    end
  end

  def next_times(code, increment = 1)
    result = code
    increment.times { result = result.next }
    result
  end
end
