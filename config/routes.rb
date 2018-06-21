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
      resources :facilities, only: [:edit, :update, :index] do
        get 'all', on: :collection
      end

      resources :rooms,     only: [:index, :edit, :update, :new, :create]
      resources :sections,  only: [:index, :edit, :update]
      resources :rows,      only: [:index, :edit, :update]
      resources :shelves,   only: [:index, :edit, :update]
    end
  end
end
