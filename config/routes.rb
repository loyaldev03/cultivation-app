Rails.application.routes.draw do  
  devise_for :users
  root to: "home#index"

  get "facility_setup/new" => "facility_setup#new"
  get "facility_setup/rooms_info" => "facility_setup#rooms_info"
  get "facility_setup/room_info" => "facility_setup#room_info", as: 'fetch_room_info'
  get "facility_setup/row_info" => "facility_setup#row_info", as: 'fetch_row_info'
  get "facility_setup/row_shelf_trays" => "facility_setup#row_shelf_trays", as: 'fetch_row_shelf_trays'
  get "facility_setup/section_info" => "facility_setup#section_info", as: 'fetch_section_info'
  post "facility_setup/generate_rooms" => "facility_setup#generate_rooms", as: 'generate_rooms'
  post "facility_setup/generate_rows" => "facility_setup#generate_rows", as: 'generate_rows'
  post "facility_setup/add_section" => "facility_setup#add_section", as: 'add_section'
  post "facility_setup/destroy_section" => "facility_setup#destroy_section", as: 'destroy_section'
  post "facility_setup/generate_tray" => "facility_setup#generate_tray", as: 'generate_tray'
  post "facility_setup/destroy_room" => "facility_setup#destroy_room", as: 'destroy_room'
  post "facility_setup/destroy_row" => "facility_setup#destroy_row", as: 'destroy_row'
  post "facility_setup/destroy_tray" => "facility_setup#destroy_tray", as: 'destroy_tray'
  get "facility_setup/room_summary" => "facility_setup#room_summary"
  get "facility_setup/row_shelf_info" => "facility_setup#row_shelf_info"
  post "facility_setup/update_basic_info" => "facility_setup#update_basic_info"
  post "facility_setup/update_room_info" => "facility_setup#update_room_info"
  post "facility_setup/update_section_info" => "facility_setup#update_section_info", as: 'update_section_info'
  post "facility_setup/update_row_info" => "facility_setup#update_row_info"
  post "facility_setup/update_shelf_trays" => "facility_setup#update_shelf_trays", as: 'update_shelf_trays'
  post "facility_setup/duplicate_rows" => "facility_setup#duplicate_rows", as: "duplicate_rows"

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

    namespace 'company', as: :company do
      resources :company_info, only: [:edit, :update]
      resources :team, only: [:index]
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

  namespace 'cultivation' do
    resources :batches
  end

  # API for web pages
  namespace :api do
    namespace :v1 do
      resources :plants do
        get 'strains/(:filter)',      action: :strains, on: :collection
        get 'plants/(:plant_status)', action: :plants, on: :collection
      end
      resources :batches do
        resources :tasks, only: [:index, :update, :create]
      end

      resource :plant_setup, only: [] do
        post 'setup_mother'
        post 'setup_clones'
        post 'setup_veg'
        post 'setup_harvest_yield'
        post 'setup_waste'
      end
    end
  end
end
