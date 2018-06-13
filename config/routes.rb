Rails.application.routes.draw do
  get "facility_setup/wizard" => "facility_setup#wizard"
  post "facility_setup/save" => "facility_setup#save"
  get "facility_setup/summary" => "facility_setup#summary"

  devise_for :users
  root to: "home#index"
end
