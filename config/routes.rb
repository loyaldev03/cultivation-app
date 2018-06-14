Rails.application.routes.draw do
  get "facility_setup/new" => "facility_setup#new"
  post "facility_setup/save" => "facility_setup#save"
  get "facility_setup/summary" => "facility_setup#summary"

  devise_for :users
  root to: "home#index"
end
