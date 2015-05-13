class UserSerializer < ActiveModel::Serializer
  attributes :id, :name, :lat, :lng

  def lat
    object.coordinates.lat if object.coordinates
  end

  def lng
    object.coordinates.lon if object.coordinates
  end
end
