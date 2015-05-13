class Api::UsersController < BaseApiController

  actions :index, :show, :create

  def end_of_association_chain
    if params[:coordinates]
      super.within(params[:coordinates][:lat],
        params[:coordinates][:lng])
    else
      super
    end
  end
end