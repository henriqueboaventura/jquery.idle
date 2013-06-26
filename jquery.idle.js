/**
 *  File: jquery.idle.js
 *  Title:  JQuery Idle.
 *  A dead simple jQuery plugin that executes a callback function if the user is idle.
 *  About: Author
 *  Henrique Boaventura (hboaventura@gmail.com).
 *  About: Version
 *  1.0.0
 *  About: License
 *  Copyright (C) 2012, Henrique Boaventura (hboaventura@gmail.com).
 *  MIT License:
 *  Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *  - The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *  - THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 **/ 

(function( $ ){
  $.fn.idle = function(options) {

    var defaults = {
      idle: 60000, //idle time in ms
      events: 'mousemove keypress mousedown', //events that will trigger the idle resetter
      onIdle: function(){}, //callback function to be executed after idle time
      onActive: function(){}, //callback function to be executed after back from idleness
      keepTracking: false //if you want to keep tracking user even after the first time, set this to true
    };

    var idle = false;

    var settings = $.extend( {}, defaults, options );

    var resetTimeout = function(id, settings){
      if(idle){
        settings.onActive.call();
        idle = false;
      }
      var clearTimer = (settings.keepTracking ? clearInterval : clearTimeout);
      clearTimer(id);

      return timeout(settings);
    }

    var timeout = function(settings){
        var timer = (settings.keepTracking ? setInterval : setTimeout);
        var id = timer(function(){
        idle = true;
        settings.onIdle.call();
        if(settings.keepTracking){
          timeout(settings);
        }
      }, settings.idle);
      return id;
    }

    return this.each(function(){
      var id = timeout(settings);
      $(this).on(settings.events, function(e){
        id = resetTimeout(id, settings);
      });
    }); 

  }; 
})( jQuery );
