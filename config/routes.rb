Rails.application.routes.draw do
  namespace :api do
    resources :users, only: [:index, :show, :create]
  end
end
