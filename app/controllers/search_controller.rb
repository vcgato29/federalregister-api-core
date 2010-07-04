class SearchController < ApplicationController
  before_filter :load_search
  
  def header
    render :layout => false
  end
  
  def results
    render :layout => false
  end
  
  def facets
    facets = @search.send(params[:facet] + "_facets")
    render :partial => "search/facets", :locals => {:facets => facets, :name => params[:facet].humanize.capitalize_first}, :layout => false
  end
end