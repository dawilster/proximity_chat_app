require 'rails_helper'

describe Api::UsersController, type: :controller do

  describe "index" do
    it "returns 200" do
      get :index, format: :json
      expect(response.response_code).to eq 200
    end

    context "coordinates" do
      it "returns 200" do
        get :index, format: :json, coordinates: {lat: "10", lng: "10"}
        expect(response.response_code).to eq 200
      end
    end
  end

  describe "create" do
    it "returns 200" do
      post :create, user: {name: "William", lat: "10", lng: "10"}, format: :json
      expect(response.response_code).to eq 201
    end
  end

end