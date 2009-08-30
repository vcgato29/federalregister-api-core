$(document).ready(function() {
  
  //initialize scrollable for ticker 
  $("div.daily").scrollable({ 
             
          // items are auto-scrolled in 2.5 second interval 
          interval: 2500,   
        
          horizontal: true,
         
          // when last item is encountered go back to first item 
          loop: true,  
         
          // make animation a little slower than the default 
          speed: 600,
        
          clickable: false
      });
  
  //init tooltips for ticker
  $("ul.items li a.entry").each(function(){
    
    $(this).qtip({
      content: $(this).parent().children('div.tip'),
      position: {
          corner: {
             target: 'bottomMiddle',
             tooltip: 'topMiddle'
          }
      },
      style: {
       name: 'light',
       padding: 5,
       width: 530,
       border: {
         width: 7,
         radius: 5,
         color: '#ddd'
         },
      tip: { // Now an object instead of a string
         corner: 'topMiddle', // We declare our corner within the object using the corner sub-option
         color: '#ddd'
        }   
      }
      
    });
  });

  
  
  $(":text").labelify({ labelledClass: "labelHighlight" });
  
  // This needs to be fixed to use a proper slug - may require url rewriting.
  $('.tag_cloud').each(function(){
    $('.tag_cloud ul').hide();
    var tagcloud = new TagCloud(document.getElementById('fancy_tag_cloud'),'descending',[{r:255,g:167,b:105},{r:250,g:159,b:94},{r:244,g:150,b:84},{r:239,g:142,b:73},{r:233,g:133,b:63},{r:227,g:125,b:52},{r:222,g:117,b:42},{r:216,g:108,b:31},{r:211,g:100,b:21},{r:205,g:91,b:10},{r:199,g:83,b:0}],[{r:0,g:80,b:115},{r:13,g:92,b:125},{r:26,g:105,b:136},{r:39,g:118,b:146},{r:53,g:130,b:157},{r:66,g:143,b:167},{r:79,g:156,b:178},{r:92,g:168,b:188},{r:106,g:181,b:198},{r:119,g:194,b:109},{r:132,g:206,b:219}], '/topics/');
    $('.tag_cloud li').each(function(){
      var li = $(this)
      var text = li.text();
      var name = text.replace(/ \(\d+\)/,'');
      var count = text.replace(/.*\(|\).*/g,'') / 7;
      var slug = $(li.find('a').get(0)).attr('href').replace(/.*\/topics\//,'');
      tagcloud.addNode(new Node(name, count, slug));
    });
  
    tagcloud.draw();
  });
});
