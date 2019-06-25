class SeedMetrcHistoriesCode < Mongoid::Migration
  def self.up
    CompanyInfo.all.each do |company|
      company.metrc_histories.find_or_create_by(code: "Item Categories", category: "State (CA)" , metrc_type: "MetrcUpdateItemCategoryWorker")
      company.metrc_histories.find_or_create_by(code: "Unit of measure", category: "State (CA)", metrc_type: "MetrcUpdateUomWorker")

      company.metrc_histories.find_or_create_by(code: "Facility - Read", category: "Facility", metrc_type: "MetrcUpdateFacilityReadWorker")
      company.metrc_histories.find_or_create_by(code: "Strains", category: "Facility", metrc_type: "MetrcUpdateStrainsWorker")
      company.metrc_histories.find_or_create_by(code: "Items (E.g. Bud's Blue Dream)", category: "Facility", metrc_type: "MetrcUpdateItemsWorker")
      company.metrc_histories.find_or_create_by(code: "Rooms", category: "Facility", metrc_type: "MetrcUpdateRoomsWorker")

      company.metrc_histories.find_or_create_by(code: "Receive Tags into Metrc", category: "Tags", metrc_type: "MetrcUpdateReceiveTags")
      company.metrc_histories.find_or_create_by(code: "Void unused tag - Read", category: "Tags", metrc_type: "MetrcUpdateUnusedTags")

      company.metrc_histories.find_or_create_by(code: "Batch Types", category: "Batches", metrc_type: "MetrcUpdateBatchTypes")
      company.metrc_histories.find_or_create_by(code: "Create Batch", category: "Batches", metrc_type: "MetrcUpdateCreateBatch")
      company.metrc_histories.find_or_create_by(code: "Active Batch", category: "Batches", metrc_type: "MetrcUpdateActiveBatch")
      company.metrc_histories.find_or_create_by(code: "Change Growth Phase", category: "Batches", metrc_type: "MetrcUpdateChangeGrowthPhase")
      company.metrc_histories.find_or_create_by(code: "Move Plants Batches", category: "Batches", metrc_type: "MetrcUpdateMovePlantsBatches")
      company.metrc_histories.find_or_create_by(code: "Create Packages", category: "Batches", metrc_type: "MetrcUpdateCreatePackages")
      company.metrc_histories.find_or_create_by(code: "Destroyed (immature plants)", category: "Batches", metrc_type: "MetrcUpdateDestroyedPlants")

      company.metrc_histories.find_or_create_by(code: "Waste Methods", category: "Plants", metrc_type: "MetrcUpdatePlantWasteMethods")
      company.metrc_histories.find_or_create_by(code: "Waste Reason", category: "Plants", metrc_type: "MetrcUpdatePlantWasteReasons")
      company.metrc_histories.find_or_create_by(code: "Growth Phases", category: "Plants", metrc_type: "MetrcUpdateGrowthPhases")
      company.metrc_histories.find_or_create_by(code: "Create Plantings", category: "Plants", metrc_type: "MetrcUpdateCreatePlantings")
      company.metrc_histories.find_or_create_by(code: "Moving", category: "Plants", metrc_type: "MetrcUpdateMovingWorker")
      company.metrc_histories.find_or_create_by(code: "Destroy Plants", category: "Plants", metrc_type: "MetrcUpdateDestroyPlants")
      company.metrc_histories.find_or_create_by(code: "Destroyed by rooms	", category: "Plants", metrc_type: "MetrcUpdateDestroyedByRooms")
      company.metrc_histories.find_or_create_by(code: "Replace Tag", category: "Plants", metrc_type: "MetrcUpdateReplaceTagWorker")
      company.metrc_histories.find_or_create_by(code: "Record Plant Waste", category: "Plants", metrc_type: "MetrcUpdateRecordPlantWaste")
      company.metrc_histories.find_or_create_by(code: "Create Harvest", category: "Plants", metrc_type: "MetrcUpdateCreateHarvest")
      company.metrc_histories.find_or_create_by(code: "Manicure", category: "Plants", metrc_type: "MetrcUpdateManicureWorker")

      company.metrc_histories.find_or_create_by(code: "Info", category: "Harvest", metrc_type: "MetrcUpdateHarvestInfo")
      company.metrc_histories.find_or_create_by(code: "Create Package	", category: "Harvest", metrc_type: "MetrcUpdateHarvestCreatePackage")
      company.metrc_histories.find_or_create_by(code: "Remove Package	", category: "Harvest", metrc_type: "MetrcUpdateHarvestRemovePackage")
      company.metrc_histories.find_or_create_by(code: "Finish", category: "Harvest", metrc_type: "MetrcUpdateHarvestFinish")
      company.metrc_histories.find_or_create_by(code: "Unfinish", category: "Harvest", metrc_type: "MetrcUpdateHarvestUnfinish")

      company.metrc_histories.find_or_create_by(code: "Types", category: "Package", metrc_type: "MetrcUpdatePackageTypes")
      company.metrc_histories.find_or_create_by(code: "Adjust Reasons", category: "Package", metrc_type: "MetrcUpdatePackageAdjustReasons")
      company.metrc_histories.find_or_create_by(code: "Info", category: "Package", metrc_type: "MetrcUpdatePackageInfo")
      company.metrc_histories.find_or_create_by(code: "List Active", category: "Package", metrc_type: "MetrcUpdatePackageListActive")
      company.metrc_histories.find_or_create_by(code: "List on hold", category: "Package", metrc_type: "MetrcUpdatePackageListOnHold")
      company.metrc_histories.find_or_create_by(code: "Create from harvest batch", category: "Package", metrc_type: "MetrcUpdateCreateHarvestBatch")
      company.metrc_histories.find_or_create_by(code: "Adjust", category: "Package", metrc_type: "MetrcUpdatePackageAdjust")
      company.metrc_histories.find_or_create_by(code: "Create for testing", category: "Package", metrc_type: "MetrcUpdateCreateForTesting")
      company.metrc_histories.find_or_create_by(code: "Change Item", category: "Package", metrc_type: "MetrcUpdateChangeItem")
      company.metrc_histories.find_or_create_by(code: "Change room", category: "Package", metrc_type: "MetrcUpdateChangeRoom")
      company.metrc_histories.find_or_create_by(code: "Finish", category: "Package", metrc_type: "MetrcUpdatePackageFinish")
      company.metrc_histories.find_or_create_by(code: "Unfinish", category: "Package", metrc_type: "MetrcUpdatePackageUnfinish")
    end
  end

  def self.down
    CompanyInfo.all.each do |company|
      company.metrc_histories.delete_all
    end
  end
end