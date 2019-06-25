class SeedMetrcHistoriesCode < Mongoid::Migration
  def self.up
    CompanyInfo.all.each do |company|
      company.metrc_histories.find_or_create_by(code: "Item Categories", category: "State (CA)" , metrc_type: "MetrcUpdateItemCategoryWorker")
      company.metrc_histories.find_or_create_by(code: "Unit of measure", category: "State (CA)", metrc_type: "MetrcUpdateUomWorker")

      company.metrc_histories.find_or_create_by(code: "Facility - Read", category: "Facility")
      company.metrc_histories.find_or_create_by(code: "Strains", category: "Facility")
      company.metrc_histories.find_or_create_by(code: "Items (E.g. Bud's Blue Dream)", category: "Facility")
      company.metrc_histories.find_or_create_by(code: "Rooms", category: "Facility")

      company.metrc_histories.find_or_create_by(code: "Receive Tags into Metrc", category: "Tags")
      company.metrc_histories.find_or_create_by(code: "Void unused tag - Read", category: "Tags")

      company.metrc_histories.find_or_create_by(code: "Batch Types", category: "Batches")
      company.metrc_histories.find_or_create_by(code: "Create Batch", category: "Batches")
      company.metrc_histories.find_or_create_by(code: "Active Batch", category: "Batches")
      company.metrc_histories.find_or_create_by(code: "Change Growth Phase", category: "Batches")
      company.metrc_histories.find_or_create_by(code: "Move Plants Batches", category: "Batches")
      company.metrc_histories.find_or_create_by(code: "Create Packages", category: "Batches")
      company.metrc_histories.find_or_create_by(code: "Destroyed (immature plants)", category: "Batches")

      company.metrc_histories.find_or_create_by(code: "Waste Methods", category: "Plants")
      company.metrc_histories.find_or_create_by(code: "Waste Reason", category: "Plants")
      company.metrc_histories.find_or_create_by(code: "Growth Phases", category: "Plants")
      company.metrc_histories.find_or_create_by(code: "Create Plantings", category: "Plants")
      company.metrc_histories.find_or_create_by(code: "Moving", category: "Plants")
      company.metrc_histories.find_or_create_by(code: "Destroy Plants", category: "Plants")
      company.metrc_histories.find_or_create_by(code: "Destroyed by rooms	", category: "Plants")
      company.metrc_histories.find_or_create_by(code: "Replace Tag", category: "Plants")
      company.metrc_histories.find_or_create_by(code: "Record Plant Waste", category: "Plants")
      company.metrc_histories.find_or_create_by(code: "Create Harvest", category: "Plants")
      company.metrc_histories.find_or_create_by(code: "Manicure", category: "Plants")

      company.metrc_histories.find_or_create_by(code: "Info", category: "Harvest")
      company.metrc_histories.find_or_create_by(code: "Create Package	", category: "Harvest")
      company.metrc_histories.find_or_create_by(code: "Remove Package	", category: "Harvest")
      company.metrc_histories.find_or_create_by(code: "Finish", category: "Harvest")
      company.metrc_histories.find_or_create_by(code: "Unfinish", category: "Harvest")

      company.metrc_histories.find_or_create_by(code: "Types", category: "Package")
      company.metrc_histories.find_or_create_by(code: "Adjust Reasons", category: "Package")
      company.metrc_histories.find_or_create_by(code: "Info", category: "Package")
      company.metrc_histories.find_or_create_by(code: "List Active", category: "Package")
      company.metrc_histories.find_or_create_by(code: "List on hold", category: "Package")
      company.metrc_histories.find_or_create_by(code: "Create from harvest batch", category: "Package")
      company.metrc_histories.find_or_create_by(code: "Adjust", category: "Package")
      company.metrc_histories.find_or_create_by(code: "Create for testing", category: "Package")
      company.metrc_histories.find_or_create_by(code: "Change Item", category: "Package")
      company.metrc_histories.find_or_create_by(code: "Change room", category: "Package")
      company.metrc_histories.find_or_create_by(code: "Finish", category: "Package")
      company.metrc_histories.find_or_create_by(code: "Unfinish", category: "Package")
    end
  end

  def self.down
    CompanyInfo.all.each do |company|
      company.metrc_histories.delete_all
    end
  end
end