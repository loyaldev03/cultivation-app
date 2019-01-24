module Cultivation
  class ValidatePurchaseClone
    prepend SimpleCommand

    attr_reader :args

    def initialize(args = {})
      @args = args
    end

    def call
      save_record
    end

    private

    def save_record
      batch = Cultivation::Batch.find(args[:batch_id])
      catalogue_id = Inventory::Catalogue.purchased_clones.id
      products = Inventory::Product.in(catalogue: catalogue_id).where(facility_id: batch.facility_id)

      tasks = batch.tasks
      plant_task = tasks.detect { |a| a['indelible'] == 'plants' }
      #check purchase clone is selected or not
      if plant_task and plant_task.material_use.count == 0
        #if no material is selected
        issue = Issues::Issue.find_by(
          task_id: plant_task.id,
          cultivation_batch_id: batch.id.to_s,
          reported_by: args[:current_user].id,
        )
        #create issue
        unless issue and issue.persisted?
          issue = Issues::Issue
            .create!(
              issue_no: Issues::Issue.count + 1,
              title: 'Purchase Clone is not selected',
              description: 'Purchase Clone is not selected',
              severity: 'severe',
              issue_type: 'task_from_batch',
              status: 'open',
              task_id: plant_task.id,
              cultivation_batch_id: batch.id.to_s,
              reported_by: args[:current_user].id,
            )
        end
        errors.add('strain', 'Purchase Clone is not selected')
      else

        #make command to sum total booked per product id
        batches_selected = Cultivation::Batch.where(:start_date.gte => Time.now).not_in(id: batch.id)

        # batches_selected = batches.select{|a| a[:start_date] > Time.now}
        #add to filter by status active and scheduled batch
        purchased_clone_products = plant_task.material_use.pluck(:product_id)
        material_available = []
        plant_task.material_use.each do |material|
          product = material.product
          material_available << {product_id: product.id, quantity: product.packages.sum { |a| a.quantity }.to_i}
        end

        material_booked = []
        plant_tasks = Cultivation::Task.where(:batch_id.in => batches_selected.pluck(:id), indelible: 'plants')
        Rails.logger.debug "Plant Task Details => #{plant_tasks.first.id.to_s}"
        Rails.logger.debug "Plant Task ==> #{plant_tasks.first.material_use.count}"
        plant_tasks.each do |task|
          task.material_use.each do |material|
            Rails.logger.debug 'SINI LAH KIRA'
            product = material.product
            material_booked << {product_id: product.id, quantity: product.packages.sum { |a| a.quantity }.to_i}
          end
        end
        Rails.logger.debug "Material Available ==> #{material_available.inspect}"
        Rails.logger.debug "Material Booked ==> #{material_booked.inspect}"
        material_available.each do |material|
          book_material = material_booked.detect { |a| a[:product_id] == material[:product_id] }
          material_quantity = 0
          material_quantity = book_material[:quantity] if book_material
          Rails.logger.debug "Book Material ==> #{book_material.present?}"
          Rails.logger.debug "Sum #{material[:quantity]} - #{material_quantity}"
          Rails.logger.debug "Sum #{material[:quantity] - material_quantity}"
        end
        # batches_selected.each do |batch|
        #   plant_task = batch.tasks.detect { |a| a['indelible'] == 'plants' }

        #   material_booked << {}
        # end

        #compare for all batches that doesnt started yet
        #create issue if not sufficient
        #check if products > quantity
      end
    rescue
      Rails.logger.debug "#{$!.message}"
      errors.add(:error, $!.message)
    end
  end
end
