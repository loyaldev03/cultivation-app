module Cultivation
  class UpdateTrayPlans
    prepend SimpleCommand

    def initialize(current_user, args = {})
      args = {
        batch_id: nil, # BSON::ObjectId, Batch.id
      }.merge(args)

      @batch_id = args[:batch_id].to_bson_id
      @current_user = current_user
    end

    def call
      if valid_params?
        tray_plans.each do |plan|
          task = phase_tasks.detect { |t| t.phase == plan.phase }
          if task.present?
            plan.start_date = task.start_date
            plan.end_date = task.end_date
            plan.save
          end
        end
      end
    end

    private

    def batch
      @batch ||= Cultivation::Batch.includes(:facility,
                                             :tasks,
                                             :tray_plans).find_by(id: @batch_id)
    end

    def tray_plans
      @tray_plans ||= batch.tray_plans
    end

    def facility
      @facility ||= batch.facility
    end

    def phase_tasks
      @phase_tasks ||= Cultivation::QueryBatchPhases.call(
        batch,
        facility.growth_stages,
      ).result
    end

    def valid_params?
      if @current_user.nil?
        errors.add(:current_user, 'current_user is required')
      end
      if @batch_id.nil?
        errors.add(:batch_id, 'batch_id is required')
      end
      errors.empty?
    end
  end
end