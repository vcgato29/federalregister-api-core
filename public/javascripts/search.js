$(document).ready(function () {
    var populate_expected_results = function (count) {
        $('#expected_result_count').removeClass('loading');
        $('#expected_result_count').text(count).show();
    }
    
    var indicate_loading = function() {
        $('#expected_result_count').show().addClass('loading');
    }
    
    // ajax-y lookup of number of expected results
    var calculate_expected_results = function () {
        var form = $('#entry_search_form');
        var url = '/articles/search/results.js?' + form.serialize();
        
        var cache = form.data('count_cache') || {};
        
        // don't go back to the server if you've checked this before
        if (cache[url]) {
            populate_expected_results(cache[url])
        } else {
            // record that this is the current results we're looking for
            form.data('count_current_url', url);
            indicate_loading();
            
            $.getJSON(url, function(data){
                var form = $('#entry_search_form');
                var cache = form.data('count_cache') || {};
                cache[url] = data.count;
                form.data('count_cache', cache);
                
                // don't show number if user has already made another request
                if (form.data('count_current_url') == url) {
                    populate_expected_results(data.count);
                }
            });
        }
    };
    
    $('#entry_search_form').bind('calculate_expected_results', calculate_expected_results);
    
    $('#entry_search_form select').bind('blur', function(event) {
      $(this).trigger('calculate_expected_results');
    });
    
    $('#entry_search_form input[type=checkbox]').bind('click', function(){
      $(this).trigger('calculate_expected_results');
    });

    // basic check for pause between events
    var typewatch = (function(){
      var timer = 0;
      return function(callback, ms){
        clearTimeout (timer);
        timer = setTimeout(callback, ms);
      }  
    })();
    
    $('#entry_search_form input[type=text]').keyup(function () {
        // only trigger if stopped typing for more than half a second
        typewatch(function () {
            $("#entry_search_form").trigger('calculate_expected_results');
        }, 500);
    });
    
    var display_rin_info = function(message) {
        var input = $('#conditions_regulation_id_number');
        
        input.siblings('.inline-hints').remove();
        
        if(message) {
            var node = $('<p class="inline-hints" />');
            node.text(message);
        
            input.after(node);
        }
    }
    
    var cache_rin_name = function (rin, name) {
        var input = $('#conditions_regulation_id_number');
        var cache = input.data('name_cache') || {};
        cache[rin] = name;
        input.data('name_cache', cache);
    }
    
    var load_rin_info = function() {
        var input = $('#conditions_regulation_id_number');
        var rin = input.val();
        
        if (rin.length == 9) {
            var cache = input.data('name_cache') || {};
            
            if (cache[rin]) {
                display_rin_info(cache[rin])
            }
            else {
                display_rin_info('loading');
            
                var url = '/regulations/' + rin + '.js';
                $.ajax({
                    url : url,
                    success : function(str) {
                        var data = $.parseJSON(str);
                        var name = data.name;
                        cache_rin_name(rin,name);
                        display_rin_info(name);
                    },
                    error : function() {
                        var name = 'Not in current Unified Agenda'
                        cache_rin_name(rin,name);
                        display_rin_info(name);
                    }
                });
            }
        }
        else {
            display_rin_info('');
        }
    }
    $('#conditions_regulation_id_number').blur(load_rin_info);
    $('#conditions_regulation_id_number').keyup(function () {
        // only trigger if stopped typing for more than half a second
        typewatch(function () {
            load_rin_info();
        }, 500);
    });
    
    $('.clear_form').click(function(){
        $('#entry_search_form').find('input[type=text],input[type=hidden]').val('');
        $('#entry_search_form').find('input[type=radio],input[type=checkbox]').removeAttr('checked');
        $('#entry_search_form').find('select option:eq(0)').attr('selected','selected');
        $('#entry_search_form').find('#conditions_agency_ids option').remove();
        $('#entry_search_form').find('#conditions_within option:eq(3)').attr('selected','selected');
        $('#entry_search_form .bsmListItem').remove();
        $('#entry_search_form .date').hide().find("input").val('');
        $(this).trigger('calculate_expected_results');
        return false;
    });
    
    $('a.load_facet').live('click',
    function () {
        var anchor = $(this);
        $(this).after('<img src="/images/ui/ui-anim_basic_16x16.gif" />');
        var facet_name = anchor.attr('data-facet-name');
        var url = $(location).attr('href').replace('/search?', '/search/facets/' + facet_name + '?all=1&');
        $.ajax({
            url: url,
            success: function (data) {
                anchor.closest('ul').html(data);
            }
        });

        return false;
    });


    if ($(".result_set.events").size() > 0) {
        $('body#search.show').each(function () {
            $('body').append([
              '<div id="modal">',
              '  <a href="#" class="jqmClose">Close</a>',
              '  <h3 class="title_bar">Loading...</h3>',
              '</div>'].join("\n")
            );
        });
    }

    $('#modal').centerScreen().jqm({
        ajax: '@href',
        ajaxText: 'Loading...',
        trigger: '.results a.add_to_calendar'
    });
    
    $(".date_options .date").hide();
    $("input[data-show-field]").bind('change', function(event) {
      var parent_fieldset = $(this).closest("fieldset");
      parent_fieldset.find(".date").hide().find(":input").disable(); 
      parent_fieldset.find("." + $(this).attr("data-show-field")).show().find(":input").enable();
      $("#expected_result_count").hide();
      //$(this).trigger('calculate_expected_results');
    });
    $(".date_options input[data-show-field]:checked").trigger("change");
    
    //Add in some helpful hints that would be redundant if we had all the labels displaying
    $(".range_start input").after("<span> to </span>");
    $(".cfr li:first-child input").after("<span> CFR </span>");
    $(".zip li:first-child input").after("<span> within </span>");
    
    $("#toggle_advanced").bind('click', function(event) {
      event.preventDefault();
      var isOpen = $(this).attr("data-state") == "open";
      isOpen ? $(this).text("Show Advanced Search") : $(this).text("Hide Advanced Search");
      isOpen ? $(this).attr("title", "Show Advanced Search") : $(this).attr("title", "Hide Advanced Search");
      $(this).attr("data-state", isOpen ? 'close' : 'open');
      $(".advanced").toggle().find(":input").toggleDisabled();
      $(this).trigger('calculate_expected_results');
    });
    
    $(".formtastic select[multiple]").hide().bsmSelect({
      removeClass: 'remove'
    });
    
    $("input[data-autocomplete]").autocomplete({
      minLength: 3,
      source: function( request, response ){
        $.ajax({
          url: "/agencies/search?term=" + request.term,
          success: function(data){
            response( 
              $.map( data, function( item ) {
  							return {
  								label: item.name,
  								value: item.name,
  								id: item.id
  							}
						}));	
          } // end success
        }) // end ajax
      },
      select: function( event, ui ) {
        $("#conditions_agency_ids").append("<option value=" + ui.item.id +" selected='selected'>" + ui.item.label + "</option>");
        $("#conditions_agency_ids").trigger("change");
        $(this).trigger('calculate_expected_results');
      },
      open: function( event, ui ){
        $(this).removeClass("loading");
      },
      close: function( event, ui ) {
        $(this).val('');
        $(this).removeClass("loading");
      },
      search: function( event, ui) {
        $(this).addClass("loading");
      }
    });
});
