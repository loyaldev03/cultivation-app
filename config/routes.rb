Rails.application.routes.draw do
  get "facility_setup/new" => "facility_setup#new"
  get "facility_setup/save" => "facility_setup#new"
  get "facility_setup/summary" => "facility_setup#summary"
  post "facility_setup/save" => "facility_setup#save"

  devise_for :users
  root to: "home#index"
end
