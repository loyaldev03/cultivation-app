class UpdateUserFacilities < Mongoid::Migration
  def self.up
    users = User.all
    users.each do |user|
      if user.default_facility_id
        user.default_facility_id = user.default_facility_id.to_bson_id
      end
      if user.facilities.present?
        user.facilities = user.facilities.map(&:to_bson_id)
      end
      if user.roles.present?
        user.roles = user.roles.map(&:to_bson_id)
      end
      user.save!
    end
  end

  def self.down
  end
end
