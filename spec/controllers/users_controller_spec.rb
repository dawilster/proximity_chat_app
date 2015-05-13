require 'rails_helper'

describe Api::UsersController do

  describe "index" do
    it "returns 200" do
      get :index, format: :json
      expect(response.response_code).to eq 200
    end
  end
end