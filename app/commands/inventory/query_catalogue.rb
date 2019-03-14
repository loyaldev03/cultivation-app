module Inventory
  class QueryCatalogue
    prepend SimpleCommand

    attr_reader :key

    def initialize(key)
      @key = key
    end

    def call
      Inventory::Catalogue.find_by(key: key, category: '', is_active: true)
    end
  end
end
