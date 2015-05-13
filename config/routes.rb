Rails.application.routes.draw do
  namespace :api do
    resources :users, only: [:index, :show, :update]
  end
  root to: 'chat#index'

  resources :chat, only: [:index]
end
