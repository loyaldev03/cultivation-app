Rails.application.routes.draw do  
  devise_for :users
  root to: "home#index"

  get "facility_setup/new" => "facility_setup#new"
  get "facility_setup/save" => "facility_setup#new"
  get "facility_setup/summary" => "facility_setup#summary"
  post "facility_setup/save" => "facility_setup#save"
  get "settings" => "home#settings"

  namespace 'settings' do
    namespace 'facility' do
      # get '/', action: 'index', controller: 'root'
      resources :facilities do
        get 'all', on: :collection
      end

      resources :rooms
      resources :sections
      resources :rows
      resources :shelves
    end
  end
end
