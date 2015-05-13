FactoryGirl.define do
  factory :user do
    name "James Adams"
    coordinates "POINT(112.5 5655.6)"
    location_updated_at Time.now
  end

end
