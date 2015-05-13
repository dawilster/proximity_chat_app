# == Schema Information
#
# Table name: users
#
#  id                  :integer          not null, primary key
#  name                :string(255)
#  current_sign_in_at  :datetime
#  last_sign_in_at     :datetime
#  coordinates         :spatial          point, 4326
#  location_updated_at :datetime
#  created_at          :datetime
#  updated_at          :datetime
#

class User < ActiveRecord::Base
  attr_accessor :lng, :lat

  ## Validations
  before_validation :set_lat_and_lng

  def self.near(lat, lng, radius=500)
    select("users.*, ST_Distance(coordinates, ST_GeographyFromText('POINT(#{lng} #{lat})')) AS distance")
    .where("ST_DWithin(coordinates , ST_GeographyFromText('POINT(#{lng} #{lat})'), #{radius})")
    .order("distance ASC")
  end

  private

  def set_lat_and_lng
    self.coordinates = "POINT(#{lng} #{lat})" if lat.present? and lng.present?
  end
end
