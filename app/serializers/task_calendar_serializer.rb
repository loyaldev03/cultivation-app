class TaskCalendarSerializer
  include FastJsonapi::ObjectSerializer

  attributes :name,
    :start_date,
    :end_date,
    :work_status,
    :estimated_hours

  # attribute :location_name do |object, params|
  #   batch_query = params[:query].detect { |a| a[:batch_id] == object.batch_id.to_s }
  #   query = batch_query[:query] if batch_query.present?
  #   if query && object.location_id
  #     query.get_location_code(object.location_id)
  #   else
  #     ''
  #   end
  # end

  attribute :batch_name do |object, params|
    pp ">>>>>"
    pp params[:batches]
    batch = params[:batches].detect { |a| a.id == object.batch_id }
    batch.name || '--'
  end
end
