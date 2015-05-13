require 'rails_helper'

RSpec.describe User, type: :model do
  it "has valid factory" do
    user = build(:user)
    expect(user).to be_valid
  end

  it "sets lat and lng" do
    user = create(:user, lat: 10, lng: 10)
    expect(user.coordinates).to be_present
  end

  describe "near location" do
    it "returns nearest user to a location" do
      user = create(:user, lat: -37.809075, lng: 139.964770)
      expect(User.near(-37.809075, 139.96, 500)).to include user
    end

    it "returns venue within 50 meters from point" do
      user = create(:user, lat: -37.808695, lng: 144.966055)
      expect(User.near(-37.808617, 144.966317, 50)).to include user
    end

    it "doesn't return user thats greater than 50 minutes away" do
      user = create(:user, lat: -37.808695, lng: 144.966055)
      expect(User.near(-37.809401, 144.966370, 50)).to_not include user
    end
  end
end