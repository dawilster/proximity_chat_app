class EnablePostGis < ActiveRecord::Migration
  def change
    system('rake db:gis:setup')
  end
end
