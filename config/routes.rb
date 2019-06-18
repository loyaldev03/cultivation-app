Rails.application.routes.draw do
  # Mount Shrine endpoints
  mount ImageUploader.upload_endpoint(:cache) => "/images/upload"
  mount IssueAttachmentUploader.upload_endpoint(:cache) => "issues/attachment/upload"

  authenticate do
    mount Shrine.presign_endpoint(:cache) => "/s3/params"
  end

  devise_for :users, controllers: { registrations: 'registrations' }

  root to: "home#dashboard"

  # These set is for dummy only
  get "first_setup" => "home#index"
  get "employees-dashboard" => "home#employees_dashboard"
  get "employees" => "home#employees"
  get "employees_schedule" => "home#employees_schedule"
  get "timesheets" => "home#timesheets"
  get "cult/batches" => "home#cult_batches"
  get "cult/plants" => "home#cult_plants"
  get "cult/harvests" => "home#cult_harvests"
  get "cult/tasks" => "home#cult_tasks"
  get "cult/issues" => "home#cult_issues"
  get "onboarding" => "home#onboarding"
  # End of dummy pages

  #work_requests
  get "requests" => "work_requests#requests"
  # get "worker_schedule/:worker_id" => "work_requests#worker_schedule", as: 'worker_schedule'
  post "update_requests/:work_request_id" => "work_requests#update_requests", as: 'update_requests' #for accept and reject requests (manager view)

  get "qr_code" => "home#qr"

  get "facility_setup/new" => "facility_setup#new"
  get "facility_setup/rooms_info" => "facility_setup#rooms_info"
  get "facility_setup/room_info" => "facility_setup#room_info", as: 'fetch_room_info'
  get "facility_setup/row_info" => "facility_setup#row_info", as: 'fetch_row_info'
  get "facility_setup/row_shelf_trays" => "facility_setup#row_shelf_trays", as: 'fetch_row_shelf_trays'
  get "facility_setup/section_info" => "facility_setup#section_info", as: 'fetch_section_info'
  post "facility_setup/generate_rooms" => "facility_setup#generate_rooms", as: 'generate_rooms'
  post "facility_setup/generate_rows" => "facility_setup#generate_rows", as: 'generate_rows'
  post "facility_setup/generate_tray" => "facility_setup#generate_tray", as: 'generate_tray'
  post "facility_setup/add_section" => "facility_setup#add_section", as: 'add_section'
  post "facility_setup/destroy_section" => "facility_setup#destroy_section", as: 'destroy_section'
  post "facility_setup/destroy_all_rooms" => "facility_setup#destroy_all_rooms", as: 'destroy_all_rooms'
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
  post "facility_setup/whitelist_ip" => "facility_setup#whitelist_ip", as: 'whitelist_ip'

  get "dashboard" => "home#dashboard"
  get "worker_dashboard" => "home#worker_dashboard"
  get "worker_schedule" => "home#worker_schedule", as: "worker_calendar"

  get "settings" => "home#settings"
  get "inventory/setup" => "home#inventory_setup"
  post "reset_data" => "home#reset_data"

  namespace 'facility_dashboard' do
    get '/' => 'facility_dashboard#index'
    get '/summary' => 'facility_dashboard#summary'
  end

  namespace 'materials', as: :materials do
    # FIXME: IS THIS IN USE?
    get '/' => 'materials#index'
  end

  namespace 'purchasing', as: :purchasing do
    get '/' => 'purchasing#index'
    resources :vendors, only: [:index, :edit, :update, :new, :create, :destroy, :show]
    resources :purchase_orders, only: [:index, :show]
    resources :vendor_invoices, only: [:index, :show]
  end

  namespace 'worker' do 
    resources :login, only: [:index] do
      post    'generate_code', on: :collection
      post    'check_code', on: :collection
    end
  end

  namespace 'mobile' do
    namespace 'worker' do 
      resources :logins, only: [:index] do
        collection do 
          get     'pin_request'
          post    'generate_code'
          post    'check_code'
        end
      end
      resources :dashboards, only: [:index]
      resources :work_logs do
        collection do
          post 'clock_in'
          post 'clock_out'
          post 'pause'
          post 'resume'
        end
      end
    end
  end



  get "inventory/setup" => "home#inventory_setup"
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

    resources :raw_materials, only: [] do
      collection do
        get 'nutrients'
        get 'grow_medium'
        get 'grow_lights'
        get 'supplements'
        get 'others'
        get 'seeds'
        get 'purchased_clones'
      end
    end

    resources :sales_products, only: [] do
      collection do
        get 'products'
        get 'convert_products'
        get 'product_info'
      end
    end

    resources :non_sales_items, only: [:index]
    resources :metrc, only: [:index]
    # TaskDashboardApp
  end

  namespace 'settings' do
    namespace 'core', as: :core do
      get '/' => 'core#index'
      resources :unit_of_measures, only: [:index, :edit, :update, :new, :create, :destroy]

      resources :packages do
        put 'bulk_update', on: :collection
      end
      
      resources :raw_materials do
        put 'bulk_update', on: :collection
      end

      resources :grow_methods do
        put 'bulk_update', on: :collection
      end
      
      resources :grow_phases do
        put 'bulk_update', on: :collection
      end
    end

    namespace 'company', as: :company do
      resources :company_info, only: [:edit, :update]
      resources :team, only: [:index]
      resources :metrc_integrations do
        get :metrc_setup, on: :collection
      end
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
    resources :batches do
      get 'dashboard', on: :collection
      member do
        get 'gantt'
        get 'locations'
        get 'issues'
        get 'secret_sauce'
        get 'resource'
        get 'material'
      end
    end
  end

  resources :daily_tasks, only: [:index]

  # API for web pages
  namespace :api do
    namespace :v1 do
      resources :notifications, only: [:index] do
        member do
          post 'mark_as_read'
        end
      end

      resources :system, only: [], as: :system do
        collection do
          get 'configuration'
          post 'update_configuration'
        end
      end

      resources :facilities, only: [] do
        member do
          get 'search_locations'
          get 'locations'
          get 'current_trays_summary'
        end
      end

      resources :plants, only: [:show] do
        collection do
          get 'all/(:current_growth_stage)', action: :all
          get 'search/:current_growth_stage/(:facility_strain_id)/(:search)', action: :search
          get 'search_by_location'
          get 'destroyed_plants'
          get 'harvests'
          get 'harvests/:id', action: 'show_harvest'
          post 'setup_mother'
          post 'setup_plants'
          post 'setup_harvest_batch'
          post 'lot_numbers'
          post 'save_destroyed_plant'
        end
      end

      resources :raw_materials, only: [:index, :show] do
        collection do
          post 'setup'
          post 'setup_seed'
          post 'setup_purchased_clones'
          get 'products'
        end
      end

      resources :sales_products, only: [:index] do
        collection do
          get 'harvest_package/:id', action: :harvest_package
          get 'converted_product/:id', action: :converted_product
          get 'products'
          get 'harvest_packages'
          get 'converted_products'
          get 'harvest_products/:cultivation_batch_id', action: 'harvest_products'
          get 'conversion_plans_by_task/:task_id', action: 'conversion_plans_by_task'
          get 'harvest_products_from_package/:source_package_id', action: 'harvest_products_from_package'

          post 'setup_harvest_package'
          post 'setup_converted_product'
          post 'scan_and_create'
          post 'scan_and_convert'
        end

        member do
          get 'product_plans'
          post 'save_product_plans'
        end
      end

      resources :non_sales_items, only: [:index, :show] do
        collection do
          post 'setup'
        end
      end

      resources :vendors, only: [:index]
      resources :purchase_orders, only: [:index]
      resources :vendor_invoices, only: [:index, :show]
      resources :products, only: [:index] do
        get :non_nutrients, on: :collection
        get :upc, on: :collection
      end

      resources :strains, only: [:index, :create, :show] do
        get 'suggest', on: :collection
      end

      resources :metrc, only: [:index] do
        collection do
          post 'bulk_create/:facility_id', action: 'bulk_create'
          get 'verify/:facility_id', action: 'verify'
        end
      end

      resources :batches, only: [:index, :create] do
        get 'batch_info'
        get 'harvest_batch'
        get 'list_infos', on: :collection
        get 'active_tasks', on: :collection, controller: :tasks, action: :active_tasks
        get 'active_tasks_agg', on: :collection, controller: :tasks, action: :active_tasks_agg
        get 'search_locations', on: :collection
        get 'plants_movement_history', on: :collection
        post 'search_batch_plans', on: :collection
        post 'setup_simple_batch', on: :collection
        post 'update_plants_movement'
        post 'update_locations'
        post 'update_batch'
        post 'update_batch_info'
        post 'save_harvest_batch'
        post 'destroy', on: :collection
        get 'product_plans'
        post 'save_product_plans'

        resources :tasks, only: [:index, :update, :create, :destroy] do
          member do
            post 'update_indent'
            post 'update_position'
            get 'locations'
            post 'delete_relationship'
            post 'update_material_use'
            post 'append_material_use'
          end
          collection do
            get 'actual_hours'
            get 'load_issues'
          end
        end
        resources :nutrient_profiles, only: [:index, :create, :update] do 
          collection do 
            get 'by_phases'
            post 'update_week_nutrient'
          end
        end


        # resources :product_plans, only: [:index, :create] do
        #   post ':product_type_id/destroy', action: 'destroy'
        #   post ':product_type_id/package_plans', action: 'save_package_plan'
        #   post ':product_type_id/package_plans/:package_plan', action: 'delete_package_plan'
        # end
      end

      resources :users, only: [:index] do
        collection do
          get 'roles'
          get 'by_facility/:facility_id', action: 'by_facility'
        end
      end

      resource :user_roles, only: [] do
        get     'search'
        post    'update_user'
        post    'update_role'
        delete  'destroy_role'
        get     'schedules_by_date'
        post    'copy_schedule_week'
        get     'week_work_schedule'
      end

      # TODO: items to be removed. Material used for task should be move to batches/tasks api
      #       whereas catalogue related to facility should call catalogues.
      resources :items, only: [:index, :create, :destroy]
      resources :uoms, only: [:index]
      resources :catalogues, only: [] do
        collection do
          get 'raw_material_tree'
          get 'raw_materials'
        end
      end

      # TODO: change this to resources
      scope :daily_tasks do
        put ':id/start_task', to: 'daily_tasks#start_task' # TODO: delete this?
        put ':id/stop_task', to: 'daily_tasks#stop_task' # TODO: delete this?
        post ':id/update_note', to: 'daily_tasks#update_note'
        post ':id/update_nutrients', to: 'daily_tasks#update_nutrients'
        delete ':id/notes/:note_id', to: 'daily_tasks#destroy_note'
        get '/tasks', to: 'daily_tasks#tasks'
        get '/other_tasks', to: 'daily_tasks#other_tasks'
        get '/tasks_by_date', to: 'daily_tasks#tasks_by_date'
        get '/tasks_by_date_range', to: 'daily_tasks#tasks_by_date_range'
        put '/time_log', to: 'daily_tasks#time_log'
        get '/work_schedules', to: 'daily_tasks#work_schedules'
        get '/schedule_by_date', to: 'daily_tasks#schedule_by_date'

        post ':id/save_material_used', to: 'daily_tasks#save_material_used'
        post 'materials_used', to: 'daily_tasks#materials_used' 

        get ':batch_id/harvest_batch_status', to: 'daily_tasks#harvest_batch_status'
        post ':batch_id/save_harvest_batch_weight', to: 'daily_tasks#save_harvest_batch_weight'
        post ':batch_id/save_weight', to: 'daily_tasks#save_weight'
        post '/save_pto', to: 'daily_tasks#save_pto'
        post '/save_ot', to: 'daily_tasks#save_ot'
      end

      resources :issues, only: [:create, :by_batch, :show, :archive] do
        collection do
          get 'all'
          get 'by_batch/:batch_id', action: 'by_batch'
          get 'unresolved_count/:batch_id', action: 'unresolved_count'
          post 'archive'
        end

        member do
          post 'add_comment'
          post 'resolve'
          post 'assign_to'
          post 'followers'
          post 'update_comment'
          post 'delete_comment'
          get 'comments'
          get 'attachment'
        end
      end

      resources :harvests, only: [:index]
      resources :holidays, only: [:index, :create]
    end
  end
end
