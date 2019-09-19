class SeedUserDefaultFacility
  prepend SimpleCommand

  def initialize(user_id, facility_id)
    @user_id = user_id
    @facility_id = facility_id.to_bson_id
  end

  def call
    # Add Facility to current_user (person who created the Facility)
    user = User.find(@user_id)
    if user.present?
      user.facilities << @facility_id
      if user.default_facility_id
        prev = Facility.find_by(id: user.default_facility_id)
        if prev.nil?
          user.default_facility_id = @facility_id
        end
      else
        # Set facility as default if user do not have any default facility
        user.default_facility_id = @facility_id if user.default_facility_id.nil?
      end
      user.save!
    end
  end
end
