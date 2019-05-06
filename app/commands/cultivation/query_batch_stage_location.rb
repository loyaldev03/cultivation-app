module Cultivation
  class QueryBatchStageLocation
    prepend SimpleCommand

    def initialize(batch, phase)
      @batch = batch
      @phase = phase
    end

    def call
      plan = ::Cultivation::TrayPlan.find_by(
        batch_id: @batch.id,
        phase: @phase,
      )
      if plan.present?
        tray = ::Tray.find(plan.tray_id)
        tray&.full_code
      elsif Constants::REQUIRED_BOOKING_PHASES.include?(@phase)
        errors.add(:error, "Missing tray booking for #{@phase}")
      else
        facility = batch.facility
        room = facility.rooms.detect { |r| r.purpose == @phase }
        room&.full_code
      end
    end
  end
end
