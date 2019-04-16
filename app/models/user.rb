class User
  include Mongoid::Document
  include ImageUploader::Attachment.new(:photo, store: :avatar)
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable

  def active_for_authentication?
    # Reference: https://www.rubydoc.info/github/plataformatec/devise/Devise/Models/Authenticatable
    super && is_active == true
  end

  def inactive_message
    # Reference: https://www.rubydoc.info/github/plataformatec/devise/Devise/Models/Authenticatable
    is_active == true ? super : 'Your account has been deactivated'
  end

  # Information
  field :first_name, type: String
  field :last_name, type: String
  field :title, type: String
  field :timezone, type: String, default: 'Pacific Time (US & Canada)'
  field :default_facility_id, type: BSON::ObjectId
  field :is_active, type: Boolean, default: -> { true }
  field :photo_data, type: String
  field :hourly_rate, type: Float, default: -> { 0.0 }
  field :overtime_hourly_rate, type: Float

  ## Database authenticatable
  field :email, type: String, default: ''
  field :encrypted_password, type: String, default: ''

  ## Recoverable
  field :reset_password_token, type: String
  field :reset_password_sent_at, type: Time

  ## Rememberable
  field :remember_created_at, type: Time

  ## Trackable
  field :sign_in_count, type: Integer, default: 0
  field :current_sign_in_at, type: Time
  field :last_sign_in_at, type: Time
  field :current_sign_in_ip, type: String
  field :last_sign_in_ip, type: String

  field :roles, type: Array, default: []      # Array of BSON::ObjectId
  field :facilities, type: Array, default: [] # Array of BSON::ObjectId
  field :user_mode, type: String, default: 'worker' # admin | manage | worker

  has_many :time_logs, class_name: 'Cultivation::TimeLog'

  ## Confirmable
  # field :confirmation_token,   type: String
  # field :confirmed_at,         type: Time
  # field :confirmation_sent_at, type: Time
  # field :unconfirmed_email,    type: String # Only if using reconfirmable

  ## Lockable
  # field :failed_attempts, type: Integer, default: 0 # Only if lock strategy is :failed_attempts
  # field :unlock_token,    type: String # Only if unlock strategy is :email or :both
  # field :locked_at,       type: Time
  #

  # TODO: To remove this to a query object
  def cultivation_tasks
    Cultivation::Task.in(user_ids: id)
  end

  def display_name
    "#{first_name} #{last_name}"
  end
end
