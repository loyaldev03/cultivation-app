class User
  include Mongoid::Document
  include Mongoid::Timestamps::Short
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
  field :phone_number, type: String
  field :badge_id, type: String
  field :department, type: String
  field :title, type: String
  field :timezone, type: String, default: 'Pacific Time (US & Canada)'
  field :address, type: String
  field :default_facility_id, type: BSON::ObjectId
  field :is_active, type: Boolean, default: -> { true }
  field :photo_data, type: String
  field :hourly_rate, type: Float, default: -> { 0.0 }
  field :overtime_hourly_rate, type: Float
  field :expected_start_date, type: Time
  field :expected_leave_date, type: Time

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
  field :skills, type: Array, default: []
  field :facilities, type: Array, default: [] # Array of BSON::ObjectId
  field :user_mode, type: String, default: 'worker' # admin | manager | worker
  field :reporting_manager_id, type: BSON::ObjectId
  field :exempt, type: Boolean, default: -> { false } #  false => non exempt => hourly worker , true => exempt => salary worker

  field :login_code, type: String
  field :login_code_expired_at, type: Time
  field :work_log_status, type: String, default: 'stopped' # use for work_log_status started, stopped , pause (to detect take a break )

  has_many :time_logs, class_name: 'Cultivation::TimeLog' # for daily_task
  has_many :work_logs, class_name: 'Common::WorkLog' # clock in , clock out , break and stuff
  embeds_many :work_schedules, class_name: 'Common::WorkSchedule'
  belongs_to :reporting_manager, class_name: 'User', foreign_key: 'reporting_manager_id', optional: true

  has_many :work_requests, class_name: 'Common::WorkRequest', foreign_key: 'user_id' # users work request
  has_many :work_applications, class_name: 'Common::WorkRequest', foreign_key: 'reporting_manager_id' # work request manager view

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

  def display_roles
    Common::Role.find(roles)&.pluck(:name)
  end
end
