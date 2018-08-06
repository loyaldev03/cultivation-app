Rails.application.routes.draw do  
  devise_for :users
  root to: "home#index"

  get "facility_setup/new" => "facility_setup#new"
  get "facility_setup/save" => "facility_setup#new"
  get "facility_setup/rooms_info" => "facility_setup#rooms_info"
  get "facility_setup/room_info" => "facility_setup#room_info", as: 'fetch_room_info'
  get "facility_setup/row_info" => "facility_setup#row_info", as: 'fetch_row_info'
  post "facility_setup/generate_rooms" => "facility_setup#generate_rooms", as: 'generate_rooms'
  post "facility_setup/generate_rows" => "facility_setup#generate_rows", as: 'generate_rows'
  post "facility_setup/destroy_room" => "facility_setup#destroy_room", as: 'destroy_room'
  post "facility_setup/destroy_row" => "facility_setup#destroy_row", as: 'destroy_row'
  get "facility_setup/room_summary" => "facility_setup#room_summary"
  get "facility_setup/row_shelf_info" => "facility_setup#row_shelf_info"
  post "facility_setup/update_basic_info" => "facility_setup#update_basic_info"
  post "facility_setup/update_room_info" => "facility_setup#update_room_info"
  post "facility_setup/update_row_info" => "facility_setup#update_row_info"
  post "facility_setup/save" => "facility_setup#save"
  get "settings" => "home#settings"

  get "inventory/setup" => "home#inventory_setup"

  namespace 'materials', as: :materials do
    get '/' => 'materials#index'
    resources :items, only: [:index, :edit, :update, :new, :create, :destroy]
    resources :strains, only: [:index, :edit, :update, :new, :create, :destroy]
  end

  namespace 'purchasing', as: :purchasing do
    get '/' => 'purchasing#index'
    resources :vendors, only: [:index, :edit, :update, :new, :create, :destroy]
  end

  namespace 'inventory', as: :inventory do
    resources 'plant_setup', only: [:index]
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

  namespace :api do
    namespace :v1 do
      resources :plants
    end
  end
end
