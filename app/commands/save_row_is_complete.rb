class SaveRowIsComplete
  prepend SimpleCommand

  attr_reader :args

  def initialize(row)
    @row = row
  end

  def call
    @row.wz_shelves_count = get_shelves_count(@row.shelves)
    @row.has_shelves = true if @row.wz_shelves_count > 1
    @row.wz_trays_count = get_trays_count(@row.shelves)
    @row.has_trays = true if @row.wz_trays_count > 1
    @row.is_complete = get_is_complete(@row.shelves)
    @row.save!
    Rails.logger.debug ">>> + SaveRowIsComplete <<<"
    Rails.logger.debug ">>> wz_shelves_count: #{@row.wz_shelves_count}"
    Rails.logger.debug ">>> wz_trays_count: #{@row.wz_trays_count}"
    Rails.logger.debug ">>> is_complete: #{@row.is_complete}"
    Rails.logger.debug ">>> - SaveRowIsComplete <<<"
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

  def get_shelves_count(shelves)
    if shelves.blank?
      0
    else
      shelves.size
    end
  end

  def get_trays_count(shelves)
    if shelves.blank?
      0
    else
      shelves.reduce(0) { |sum, shelf| sum + (shelf.trays.blank? ? 0 : shelf.trays.size) }
    end
  end
end
