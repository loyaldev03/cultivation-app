Rails.application.routes.draw do  
  devise_for :users
  root to: "home#index"

  get "facility_setup/new" => "facility_setup#new"
  get "facility_setup/save" => "facility_setup#new"
  get "facility_setup/rooms_info" => "facility_setup#rooms_info"
  get "facility_setup/room_info" => "facility_setup#room_info", as: 'fetch_room_info'
  get "facility_setup/rooms_from_count" => "facility_setup#rooms_from_count", as: 'fetch_rooms'
  post "facility_setup/save" => "facility_setup#save"
  get "settings" => "home#settings"

  namespace 'materials', as: :materials do
    get '/' => 'materials#index'
    resources :items, only: [:index, :edit, :update, :new, :create, :destroy]
    resources :strains, only: [:index, :edit, :update, :new, :create, :destroy]
  end

  namespace 'purchasing', as: :purchasing do
    get '/' => 'purchasing#index'
    resources :vendors, only: [:index, :edit, :update, :new, :create, :destroy]
  end

  namespace 'settings' do
    namespace 'core', as: :core do
      get '/' => 'core#index'
      resources :unit_of_measures, only: [:index, :edit, :update, :new, :create, :destroy]
    end

    namespace 'facilities', as: :facility do
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
