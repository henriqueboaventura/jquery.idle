(function( $ ){
  $.fn.idle = function(options) {

    var defaults = {
      idle: 60000, //idle time in ms
      events: 'mousemove keypress mousedown', //events that will trigger the idle resetter
      callback: function(){}, //callback function to be executed after idle time
      keep_tracking: false //if you want to keep tracking user even after the first time, set this to true
    };

    var settings = $.extend( {}, defaults, options );

    var resetTimeout = function(id, idle, callback, keep_tracking){
      clearTimeout(id);
      if(keep_tracking){
        return timeout(idle, callback);
      }
    }

    var timeout = function(idle, callback){
      id = setTimeout(callback, idle);
      return id;
    }

    return this.each(function(){
      id = timeout(settings.idle, settings.callback);
      $(this).bind(settings.events, function(e){
        id = resetTimeout(id, settings.idle, settings.callback, settings.keep_tracking);
      });
    }); 

  }; 
})( jQuery );