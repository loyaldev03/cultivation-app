class Constants.rb
  class << self
    def plant_types
      return [
        { code: :clone, "Clone" },
        { code: :mother, "Mother" },
        { code: :seed, "Seed" },
        { code: :veg, "Veg Group" },
      ]
    end

    def strain_types
      return [
        { code: :hybrid, "Hybrid" },
        { code: :indica, "Indica" },
        { code: :sativa, "Sativa" },
      ]
    end

    def room_purpose
      return [
        { code: :clone, "Clone" },
        { code: :dry, "Dry" },
        { code: :flower, "Flower" },
        { code: :mother, "Mother" },
        { code: :storage, "Storage" },
        { code: :trim, "Trim" },
        { code: :veg, "Veg" },
        { code: :veg1, "Veg 1" },
        { code: :veg2, "Veg 2" },
      ]
    end

    def source_types
      return [
        { code: :clone, "Clone" },
        { code: :mother, "Mother" },
        { code: :seed, "Seed" },
      ]
    end

    def clone_types
      return [
        { code: :purchased, "Purchased" },
        { code: :mother, "Mother" },
      ]
    end

    def accounting_types
      return [
        { code: :cogs, "Cost of Goods" },
        { code: :finished_goods, "Finished Goods" },
        { code: :raw_materials, "Raw Materials" },
        { code: :wip, "Work in Process" },
        { code: :other, "Other" },
      ]
    end
  end
end
