module Mapper
  def map_attrs_from_hash(attributes, hash)
    attributes.each do |key|
      self.send("#{key}=", hash[key])
    end
  end

  def copy_attrs(attributes, source, target)
    attributes.each do |key|
      target.send("#{key}=", source[key])
    end
  end
end
