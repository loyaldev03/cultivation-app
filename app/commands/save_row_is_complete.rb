class SaveRowIsComplete
  prepend SimpleCommand

  attr_reader :args

  def initialize(row)
    @row = row
  end

  def call
    new_result = get_is_complete(@row.shelves)
    Rails.logger.debug ">>> SaveRowIsComplete 1 #{new_result}"
    Rails.logger.debug ">>> SaveRowIsComplete 2 #{@row.is_complete}"
    if @row.is_complete != new_result
      @row.is_complete = new_result
      @row.save!
    end
    @row
  end

  private

  def get_is_complete(shelves)
    if shelves.blank?
      false
    else
      res = shelves.any? { |s| s.is_complete == false }
      !res
    end
  end
end
