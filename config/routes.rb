Rails.application.routes.draw do
  get "facility_setup/wizard" => "facility_setup#wizard"
  post "facility_setup/save" => "facility_setup#save"

  devise_for :users
  root to: "home#index"
end
