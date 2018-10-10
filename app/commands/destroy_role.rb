class DestroyRole
  prepend SimpleCommand

  def initialize(record_id)
    if record_id.nil?
      raise 'Invalid record id'
    else
      @record_id = record_id
    end
  end

  def call
    @record = Common::Role.where(id: @record_id).delete
  end
end
