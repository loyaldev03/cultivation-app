# Helper function to pluck array into hash
class Array
  def pluck_to_hash(keys)
    pluck(*keys).map { |pa| Hash[keys.zip(pa)] }
  end
end

# Convert string into BSON::ObjectId
class String
  def to_bson_id
    BSON::ObjectId.from_string(self)
  end
end

class NilClass
  def to_bson_id
    self
  end
end

# When call to_bson_id on BSON::ObjectId, just return self
module BSON
  class ObjectId
    def to_bson_id
      self
    end
  end
end
