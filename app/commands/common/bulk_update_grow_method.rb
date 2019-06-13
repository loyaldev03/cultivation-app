module Common
  class BulkUpdateGrowMethod
    prepend SimpleCommand

    def initialize(current_user, args = {})
      @user = current_user
      @args = args
    end

    def call
      ids = @args[:ids]
      grow_method = Common::GrowMethod.all
      temp_grow_method = []
      grow_method.each do |grow_method|
        rm = grow_method
        if ids.include?(rm.id.to_s)
          rm.is_active = true
        else
          rm.is_active = false
        end
        temp_grow_method << rm
      end
      bulk_update(temp_grow_method)
    end

    def bulk_update(array)
      bulk_catalogue = array.map do |arr|
        {update_one: {
          filter: {_id: arr.id},
          update: {:'$set' => {
            is_active: arr.is_active,
          }},
        }}
      end
      Common::GrowMethod.collection.bulk_write(bulk_catalogue)
    end
  end
end
