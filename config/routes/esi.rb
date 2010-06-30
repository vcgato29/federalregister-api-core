ActionController::Routing::Routes.draw do |map|
  # HOMEPAGE
  map.agency_highlight '/agency_highlight', :controller => 'special', :action => 'agency_highlight'
  map.popular_entries '/popular_entries', :controller => 'special', :action => 'popular_entries'
  map.entry_statistics_by_date 'articles/:year/:month/:day/statistics', :controller => 'entries',
                                                   :action     => 'statistics_by_date',
                                                   :year       => /\d{4}/,
                                                   :month      => /\d{1,2}/,
                                                   :day        => /\d{1,2}/
  
  # ENTRY SEARCH
  map.entries_search_header 'articles/search/header', :controller => 'entries/search', :action => 'header'
  map.entries_search_results 'articles/search/results', :controller => 'entries/search', :action => 'results'
  map.entries_search_facets 'articles/search/facets/:facet', :controller => 'entries/search', :action => 'facets'
  
  # EVENT SEARCH
  map.event_search_header 'events/search/header', :controller => 'events/search', :action => 'header'
  map.event_search_results 'events/search/results', :controller => 'events/search', :action => 'results'
  map.event_search_facets 'events/search/facets/:facet', :controller => 'events/search', :action => 'facets'
  
  # REGULATIONS
  map.regulatory_plan_timeline 'regulations/:regulation_id_number/timeline',
                                :controller => 'regulatory_plans',
                                :action     => 'timeline'
  
  # REGULATORY PLAN SEARCH
  map.regulatory_plan_search_header 'regulations/search/header', :controller => 'regulatory_plans/search', :action => 'header'
  map.regulatory_plan_search_results 'regulations/search/results', :controller => 'regulatory_plans/search', :action => 'results'
  map.regulatory_plan_search_facets 'regulations/search/facets/:facet', :controller => 'regulatory_plans/search', :action => 'facets'
  
  # SECTIONS
  map.popular_entries_section ':slug/popular_entries.:format', :controller => "sections", :action => "popular_entries"
  map.popular_topics_section ':slug/popular_topics.:format', :controller => "sections", :action => "popular_topics"
end
