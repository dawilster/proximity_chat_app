class ChatController < ApplicationController
  def index
    if cookies[:user_id]
      @user = User.find_or_create_by(id: cookies[:user_id])
    else
      @user = User.create
      cookies.permanent[:user_id] = @user.id
    end
  end
end