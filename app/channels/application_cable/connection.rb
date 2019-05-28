module ApplicationCable
  class Connection < ActionCable::Connection::Base
    identified_by :current_user

    def connect
      Rails.logger.debug "\033[31m >>> ActionCable >>>> \033[0m"
      self.current_user = find_verified_user
    end

    protected

    def find_verified_user
      if current_user = env['warden'].user
        current_user
      else
        reject_unauthorized_connection
      end
    end
  end
end
