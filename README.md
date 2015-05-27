#jQuery Idle

A dead simple jQuery plugin that executes a callback function if the user is idle.

##Usage

Since this is a simple plugin, the usage is simple too.

First, add the jquery.idle.js to your document along with jQuery library:

```html
<script type="text/javascript" src="//ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js"></script>
<script type="text/javascript" src="jquery.idle.js"></script>
```

Then, just call the function in the element that you want to track user idleness

```js
$(document).idle({
  onIdle: function(){
  	alert('Since you waited so long, the answer to the Ultimate Question of Life, the Universe, and Everything is 42');
  },
  idle: 10000
})
```

That will display a alert (and a great revelation :D) to the user after 10 seconds of idleness.

If you want to call some function after user back from idleness, just add the onActive option:

```js
$(document).idle({
  onIdle: function(){
    alert('I\'m idle');
  },
  onActive: function(){
    alert('Hey, I\'m back!');
  },
  idle: 10000
})
```

To check window visibility, add the onShow or onHide options:

```js
$(document).idle({
  onHide: function(){
    alert('I\'m hidden');
  },
  onShow: function(){
    alert('Hey, I\'m visible!');
  }
})

```

You can also check if a specific element is idle, actually, you can use any jQuery selector:

```js
$('header, footer').idle({
  onIdle: function(){
  	alert('It\'s been a long time since you don\'t see me');
  },
  idle: 20000
})
```

And you can choose which events will be used to "refresh" the idle timer

```js
$(document).idle({
  onIdle: function(){
  	alert('It\'s been a long time since you don\'t see me');
  },
  events: 'mouseover mouseout',
  idle: 30000
})
```

If you want to stop the idle event just trigger the "idle.stop" on the element

```js
$(document).trigger("idle.stop");
})
```

##Options

```
onIdle	    	# callback function that will be triggered when the user gets idle
onActive    	[ default function(){} ] # callback function that will be triggered when the user gets active
onHide	    	[ default function(){} ] # callback function that will be triggered when window is hidden
onShow	    	[ default function(){} ] # callback function that will be triggered when window is visible
events			[ default = mousemove keypress mousedown touchstart ] # events that will reset the idle time
idle			[ default = 60000 ] # idle time in ms
keepTracking 	[ default = true ] # if you want to keep tracking user idleness, set it to true
```

##Changelog

###1.3.0
--------
* Added the 'idle.stop' event to finish the idle events, stopping it ([@diegoarize](https://github.com/diegoarize))

###1.2.0
--------
* Added the 'onHide' and 'onShow' callback functions to be executed when window changes visibility ([@DanH42](https://github.com/DanH42))

###1.1.0
--------
* Renamed the 'callback' setting to 'onIdle'
* Added the 'onActive' callback function to be executed when user back from idleness (thanks [@joelsouza](https://github.com/joelsouza) for the tip)

###1.0.0
--------
First basic version
