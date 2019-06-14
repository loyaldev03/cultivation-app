module Common
  class BulkUpdateGrowPhase
    prepend SimpleCommand

    def initialize(current_user, args = {})
      @user = current_user
      @args = args
    end

    def call
      ids = @args[:ids]
      grow_phase = Common::GrowPhase.all
      temp_grow_phase = []
      grow_phase.each do |grow_phase|
        rm = grow_phase
        if ids.include?(rm.id.to_s)
          rm.is_active = true
        else
          rm.is_active = false
        end
        temp_grow_phase << rm
      end
      bulk_update(temp_grow_phase)
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
      Common::GrowPhase.collection.bulk_write(bulk_catalogue)
    end
  end
end
