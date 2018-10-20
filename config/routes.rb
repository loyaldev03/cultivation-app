Rails.application.routes.draw do
  # Mount a POST endpoint /images/upload endpoint which accepts file multipart upload
  mount ImageUploader.upload_endpoint(:avatar) => "/images/upload"

  devise_for :users

  get "dashboard" => "home#dashboard"

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
  post "reset_data" => "home#reset_data"
  get "inventory/setup" => "home#inventory_setup"

  namespace 'materials', as: :materials do
    get '/' => 'materials#index'
    resources :items, only: [:index, :edit, :update, :new, :create, :destroy, :show] do
      resources :item_transactions, only: [:new, :create]
    end
  end

  namespace 'purchasing', as: :purchasing do
    get '/' => 'purchasing#index'
    resources :vendors, only: [:index, :edit, :update, :new, :create, :destroy]
  end

  namespace 'inventory', as: :inventory do
    resources 'strains', only: [:index]
    resources 'plants', only: [:index] do 
      collection do
        get 'mothers'
        get 'cultivation_batches'
        get 'clones'
        get 'vegs'
        get 'flowers'
        get 'harvests'
        get 'harvest_batches'
      end
    end
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
      
      resources :plants, only: [:show] do
        get 'all/(:current_growth_stage)',    action: :all, on: :collection
        get 'search/:current_growth_stage/(:facility_strain_id)/(:search)',    action: :search, on: :collection
        collection do
          post 'setup_mother'
          post 'setup_plants'
          # post 'setup_harvest_batch'
          # post 'setup_waste'
        end
      end

      resources :strains, only: [:index, :create, :show] do
        get 'suggest', on: :collection
      end

      resources :batches, only: [:index, :create] do
        get 'search_locations', on: :collection
        get 'search_tray_plans', on: :collection
        post 'setup_simple_batch', on: :collection
        post 'update_locations'
        resources :tasks, only: [:index, :update, :create, :destroy] do
          put 'indent', on: :member
        end
        resources :nutrient_profiles
      end

      resources :users, only: [:index] do
        get 'roles', on: :collection
      end

      resource :user_roles, only: [] do
        get 'search'
        post 'update_user'
        post 'update_role'
        delete 'destroy_role'
      end

      resources :items, only: [:index, :create, :destroy]

    end
  end
end
