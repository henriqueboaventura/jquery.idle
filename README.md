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

You can choose which events will be used to "refresh" the idle timer

```js
$(document).idle({
  onIdle: function(){
    alert('It\'s been a long time since you don\'t see me');
  },
  events: 'mouseover mouseout',
  idle: 30000
})
```

And you can choose if you want to start from an idle state or not

```js
$(document).idle({
  onIdle: function(){
    alert('It\'s been a long time since you don\'t see me');
  },
  idle: 30000,
  startAtIdle: true
})
```

##Options

```
onIdle        # callback function that will be triggered when the user gets idle
onActive      [ default function(){} ] # callback function that will be triggered when the user gets active
onHide        [ default function(){} ] # callback function that will be triggered when window is hidden
onShow        [ default function(){} ] # callback function that will be triggered when window is visible
events        [ default = mousemove keydown mousedown touchstart ] # events that will reset the idle time
idle          [ default = 60000 ] # idle time in ms
keepTracking  [ default = true ] # set it to false if you want to track only the first time
startAtIdle   [ default = false ] # if you want to start idle, set it to true
recurIdleCall [ default = false ] # by default use setTimeout, set it to true if you want to use setInterval
```

##Events
```
"idle:stop": will stop and remove user tracking
```

##Vanilla

jQuery Idle also provide a non-jQuery version. Use the `vanilla.idle.js` file instead, and initialize it like this:

```
idle().start();
```

Options are the same as with the jQuery version:

```
idle({
  onIdle: function (){
    console.log('idle !');
  },
  // ...
}).start();
```

##Changelog

###1.2.6
--------
* Added a non-Jquery version ([@hugohil](https://github.com/hugohil))

###1.2.5
--------
* Added the recurIdleCall option to choose between setTimeout ou setInterval (thanks [kgaikwad](https://github.com/kgaikwad))

###1.2.4
--------
* Changed keypress to keydown to also detect arrow keys on a keyboard press, and not just the normal A-Z keys (thanks [carlblock](https://github.com/carlblock))

###1.2.3
--------
* Added 'idle:stop' event to stop and remove user tracking (thanks [D3add3d](https://github.com/D3add3d) and [zachdixon](https://github.com/zachdixon))

###1.2.2
--------
* The logic behind 'keepTracking' was a total mess. Rewrote the functionality to work as it should
* Change the default 'keepTracking' value. Now is set to true

###1.2.1
--------
* Added the 'startAtIdle' option so you can choose if you want to start idle or not ([@hugohil](https://github.com/hugohil))

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
