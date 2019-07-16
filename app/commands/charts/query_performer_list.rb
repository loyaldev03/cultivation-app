module Charts
  class QueryPerformerList
    prepend SimpleCommand

    def initialize(current_user, args = {})
      @user = current_user
      @args = args
    end

    def call
      batches = Cultivation::Batch.all.includes(:harvest_batch)
      if @args[:order_type].nil? or @args[:order_type] == 'yield'
        batches_json = batches.map do |batch|
          {
            batch_id: batch.id.to_s,
            batch_name: batch.name,
            total_dry_weight: batch.harvest_batch.sum(:total_dry_weight),
          }
        end
        highest_dry_weight = 0

        if @args[:order].present?
          if @args[:order] == 'top'
            batches_json = batches_json.sort_by { |a| -a[:total_dry_weight] }
            highest_dry_weight = batches_json.first[:total_dry_weight]
          else
            batches_json = batches_json.sort_by { |a| a[:total_dry_weight] }
            highest_dry_weight = batches_json.last[:total_dry_weight]
          end
        end

        batches_json = batches_json.map do |batch|
          batch.merge({percentage: (batch[:total_dry_weight] / highest_dry_weight) * 100})
        end
      else
        batches_json = batches.map do |batch|
          {
            batch_id: batch.id.to_s,
            batch_name: batch.name,
            revenue: 0,
          }
        end
      end
      batches_json
    end
  end
end
