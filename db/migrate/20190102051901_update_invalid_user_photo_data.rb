class UpdateInvalidUserPhotoData < Mongoid::Migration
  def self.up
    users = User.all
    users.each do |u|
      if u.photo_data == 'null'
        u.photo_data = nil
        u.save!
      end
    end
  end

  def self.down
  end
end
