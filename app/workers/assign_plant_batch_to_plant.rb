class AssignPlantBatchToPlant
  include Sidekiq::Worker

  def perform(batch_id)
    @batch = Cultivation::Batch.find(batch_id)
    @plant_batches = Metrc::PlantBatch.where(batch_id: batch_id)
    @plants = @batch.plants
    current_plant_idx = 0
    @current_plant_batch = @plant_batches.first
    puts @current_plant_batch.inspect
    if @plants.count > 0
      @plants.each do |plant|
        if @current_plant_batch.metrc_untracked_count.to_i >= @current_plant_batch.count.to_i
          #pick next plant batch if plant count full
          current_plant_idx += 1
          @current_plant_batch = @plant_batches[current_plant_idx]
        end
        @current_plant_batch.update(metrc_untracked_count: @current_plant_batch.metrc_untracked_count.to_i + 1)
        puts @current_plant_batch.id.to_s
        plant.update(plant_batch_id: @current_plant_batch.id.to_s)
      end
    end
  end
end
