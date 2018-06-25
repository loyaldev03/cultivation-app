class Array
  def pluck_to_hash(keys)
    pluck(*keys).map{|pa| Hash[keys.zip(pa)]}
  end
end
