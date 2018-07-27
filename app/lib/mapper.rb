module Mapper
  def map_attrs_from_hash(attributes, hash)
    attributes.each do |key|
      self.send("#{key}=", hash[key])
    end
  end
end
