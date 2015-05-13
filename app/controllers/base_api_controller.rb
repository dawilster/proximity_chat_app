require 'json_responder'

class BaseApiController < InheritedResources::Base
  respond_to :json
  responders :json

  has_scope :page, :default => 1
  has_scope :per, :default => 100

  # Set up Ransack search defaults
  def collection
    @q = end_of_association_chain.search(params[:q])
    @q.result(distinct: true)
  end

  def default_serializer_options
    { meta:
      {
        pagination: { per_page: collection.limit_value, total_pages: collection.total_pages, total_objects: collection.total_count }
      }
    }
  end

end