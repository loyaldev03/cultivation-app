class Array
  def pluck_to_hash(keys)
    pluck(*keys).map { |pa| Hash[keys.zip(pa)] }
  end
end

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
