class Api::UsersController < BaseApiController

  actions :index, :show, :update

  def end_of_association_chain
    if params[:coordinates]
      super.near(params[:coordinates][:lat],
        params[:coordinates][:lng])
    else
      super
    end
  end

  def permitted_params
    params.permit(:user => [
      :id,
      :name,
      :lat,
      :lng
    ])
  end
end