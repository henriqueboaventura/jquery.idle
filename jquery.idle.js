/**
 *  File: jquery.idle.js
 *  Title:  JQuery Idle.
 *  A dead simple jQuery plugin that executes a callback function if the user is idle.
 *  About: Author
 *  Henrique Boaventura (hboaventura@gmail.com).
 *  About: Version
 *  Tested with jQuery 2.2.4
 *  About: License
 *  Copyright (C) 2013, Henrique Boaventura (hboaventura@gmail.com).
 *  MIT License:
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the "Software"), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *  - The above copyright notice and this permission notice shall be included in all
 *    copies or substantial portions of the Software.
 *  - THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 *    SOFTWARE.
 **/
(function($, window) {

    var _jIdleTimes = [];

    $.fn.idle = function(options) {
        var idleElement = $(this);
        var idleDetector = new jQuery_IDLE_Detection_API(idleElement, options);
        idleDetector.bind_idle_events();

        return idleDetector;
    };

    $.fn.is_idle = function() {
        let idleElement = $(this);
        let idlevalue = Boolean(idleElement.data("jquery_idle"));
        return idlevalue;
    };

    this.jQuery_IDLE_Detection_API = function(element, options) {
        var self = this;

        let defaults = {
            idle: 60000, // idle time in ms
            events: 'mousemove keydown mousedown touchstart', //events that will trigger the idle resetter
            onIdle: function() {}, // callback function to be executed after idle time
            onActive: function() {}, // callback function to be executed after back from idleness
            onHide: function() {}, // callback function to be executed when window is hidden
            onShow: function() {}, // callback function to be executed when window is visible
            keepTracking: true, // set it to false if you want to track only the first time
            startAtIdle: false, // start the BIND at IDLE
            recurIdleCall: false // setInterval|setTimeout
        };

        self.options = (typeof(options) === 'object') ? options : defaults;
        self.idle = self.options.startAtIdle || false;
        self.visible = !self.options.startAtIdle || true;
        self.settings = $.extend({}, defaults, self.options);
        self.keepTracking = self.settings.keepTracking;
        self.idleTime = self.settings.idle;
        self.idleTime = Number(self.idleTime);
        self.idleTime = !isNaN(self.idleTime) ? self.idleTime : 0;
        self.idleTime = Number(self.idleTime);
        self.idleTime = self.idleTime.jIdle_unique_idle_time();
        self.idleTime = Number(self.idleTime);
        self.idleTimeIndex = false;
        self.idSettings = {};
        self.unique = Date.now();
        self.element = $(element);
        self.idleDocument = $(document);
        self.idleElement = $(self.element);
        self.idleNode = self.idleElement.get(0);
        self.idleStartTime = false;
        self.idleDurationStart = false;
        self.idleEndTime = false;
        self.idleDurationTime = false;
        self.id = false;
        self.documentEvents = "visibilitychange webkitvisibilitychange mozvisibilitychange msvisibilitychange";
    };

    // Person is ACTIVE
    this.jQuery_IDLE_Detection_API.prototype.isActive = function() {
        var self = this;
        // This person was AFK
        if (self.idle) {
            // Mark this Person was ACTIVE
            self.changeIdle(false);
            // Create an EVENT to send to the ON ACTIVE setting
            var activeEvent = self.createIdleEventObject("jquery_idle_active_user");
            // Trigger the ON ACTIVE event
            self.settings.onActive.apply(self.idleNode, [self, activeEvent]);
            // If the ON ACTIVE default is being PREVENTED, stop tracking our IDLE actions
            if (activeEvent.defaultPrevented) {
                self.keepTracking = false;
            }
        }
        // Clear last IDLE timer
        if (typeof(self.id) === 'number') {
            self.removeIdle();
        }
        // Stop Tracking the IDLE
        if (!self.keepTracking) {
            return false;
        }
        // Open new IDLE timer
        self.isIdle();
        // Done
        return true;
    };

    // Person is IDLE
    this.jQuery_IDLE_Detection_API.prototype.isIdle = function() {
        var self = this;
        if (typeof(self.id) === 'number') {
            return true;
        }
        if (!self.keepTracking) {
            return false;
        }
        if (self.idleTime > 0) {
            self.id = self._runSettingsTimerStart(function() {
                var trackAsIdle = true;
                trackAsIdle = (trackAsIdle && self.idleElement.length);
                trackAsIdle = (trackAsIdle && self.keepTracking);
                trackAsIdle = Boolean(trackAsIdle);
                if (!trackAsIdle) {
                    self.changeIdle(false);
                    self.removeIdle();
                    self.keepTracking = false;
                    return false;
                }
                self.changeIdle(true);
                if (typeof(self.idleStartTime) === 'boolean') {
                    self.startIdleClock();
                }
                self.settings.onIdle.apply(self.idleNode, [self]);
            }, self.idleTime);
        }
        return (typeof(self.id) === 'number');
    };

    // Create an EVENT for the JQUERY IDLE manager
    this.jQuery_IDLE_Detection_API.prototype.createIdleEventObject = function(event_name) {
        var self = this;

        var idle_active_event = {};
        idle_active_event.instance = self.unique;
        idle_active_event.target = self.idleNode;
        idle_active_event.name = String(event_name).trim();
        idle_active_event.defaultPrevented = false;
        idle_active_event.idleStartTime = false;
        idle_active_event.idleEndTime = false;
        idle_active_event.idleDuration = self.idleDurationTime;
        idle_active_event.idleDuration = Number(idle_active_event.idleDuration);
        idle_active_event.window = window;
        idle_active_event.document = document;

        if (isNaN(idle_active_event.idleDuration) || !idle_active_event.idleDuration) {
            idle_active_event.idleDuration = self.stopIdleClock();
            idle_active_event.idleDuration = Number(idle_active_event.idleDuration);
        }

        idle_active_event.idleDuration = self.idleDurationTime; // time spent going AFK
        idle_active_event.idleStartTime = self.idleDurationStart; // when user went AFK
        idle_active_event.idleEndTime = self.idleEndTime; // time user got back to PC

        idle_active_event.preventDefault = function() {
            var that = this;
            self.keepTracking = false;
            that.defaultPrevented = true;
            self.removeIdle();
        };

        idle_active_event.restoreDefault = function() {
            var that = this;
            self.keepTracking = true;
            self.removeIdle();
            self.isIdle();
        };

        return idle_active_event;
    };

    // REMOVE Tracking on IDLE USER
    this.jQuery_IDLE_Detection_API.prototype.removeIdle = function(event_name) {
        var self = this;
        if (typeof(self.id) === 'number') {
            self._runSettingsTimerEnd(self.id);
            self.id = false;
            return true;
        }
        return false;
    };

    // Request Timer OPEN function
    this.jQuery_IDLE_Detection_API.prototype._runSettingsTimerStart = function(onComplete, wait) {
        var self = this;
        var createTimer = (self.settings.recurIdleCall ? setInterval : setTimeout);
        return createTimer(onComplete, wait);
    };

    // Request Timer CLOSE function
    this.jQuery_IDLE_Detection_API.prototype._runSettingsTimerEnd = function(id) {
        var self = this;
        if (typeof(id) === 'undefined') {
            return false;
        }
        var resetTimer = (self.settings.recurIdleCall ? clearInterval : clearTimeout);
        return resetTimer(id);
    };

	// Callable function from "idle:stop"
    this.jQuery_IDLE_Detection_API.prototype.stopIdle = function() {
        var self = this;
        self.unbind_idle_events();
        self.keepTracking = false;
        self.isActive();
    };

    // Bind EVENTS for IDLE user
    this.jQuery_IDLE_Detection_API.prototype.bind_idle_events = function() {
        var self = this;
        if (self.idleElement && self.idleElement.length) {
            self.idleElement.on("idle:stop", self._triggers_onStopEvent());
            self.idleElement.on("idle:active", self._triggers_onActiveEvent());
            self._openIdleEvent().call();
            return true;
        }
        return false;
    };

    // Start Document Bind
    this.jQuery_IDLE_Detection_API.prototype._openIdleEvent = function() {
        var self = this;
        return function() {
            _jIdleTimes.push(self.idleTime);
            self.idleTimeIndex = _jIdleTimes.length;
            if (self.idle) {
                self.changeIdle(self.idle);
            }
            self.isIdle();
            self.idleDocument.on(self.settings.events, self._onDocumentAction());
            if (self.settings.onShow || self.settings.onHide) {
                self.idleDocument.on(self.documentEvents, self._onDocumentChange());
            }
        };
    };

    // On self.settings.events Action
    this.jQuery_IDLE_Detection_API.prototype._onDocumentAction = function() {
        var self = this;
        return function(event) {
            if (self.keepTracking) {
                self.isActive();
            } else {
                self.changeIdle(false);
                self.removeIdle();
            }
        };
    };

    // On `documentEvents` Action
    this.jQuery_IDLE_Detection_API.prototype._onDocumentChange = function() {
        var self = this;
        return function() {
            self.doDocumentChange();
        };
    };

    // On "idle:active" Action
    this.jQuery_IDLE_Detection_API.prototype._triggers_onActiveEvent = function() {
        var self = this;
        return function(event) {
            self.isActive();
        };
    };

    // On "idle:stop" Action
    this.jQuery_IDLE_Detection_API.prototype._triggers_onStopEvent = function() {
        var self = this;
        return function(event) {
            self.stopIdle();
        };
    };

    // Unbind Events for IDLE USER
    this.jQuery_IDLE_Detection_API.prototype.unbind_idle_events = function() {
        var self = this;
        self.idleElement.off(self.settings.events);
        self.idleElement.off("idle:active");
        self.idleElement.off("idle:stop");
        self.changeIdle(false);
        if (typeof(self.idleTimeIndex) === 'number') {
            delete _jIdleTimes[self.idleTimeIndex - 1];
            self.idleTimeIndex = false;
        }
    };

    // Do this event on Document Change
    this.jQuery_IDLE_Detection_API.prototype.doDocumentChange = function() {
        var self = this;
        if (document.hidden || document.webkitHidden || document.mozHidden || document.msHidden) {
            if (self.visible) {
                self.onHide();
            }
        } else {
            if (!self.visible) {
                self.onShow();
            }
        }
    };

    // doDocumentChange.onHide action
    this.jQuery_IDLE_Detection_API.prototype.onHide = function() {
        var self = this;
        self.visible = false;
        self.settings.onHide.call();
    };

    // doDocumentChange.onShow action
    this.jQuery_IDLE_Detection_API.prototype.onShow = function() {
        var self = this;
        self.visible = true;
        self.settings.onShow.call();
    };

    // Update `jquery_idle` on idleElement
    this.jQuery_IDLE_Detection_API.prototype.changeIdle = function(idle) {
        var self = this;
        self.idle = Boolean(idle);
        self.idleElement.data("jquery_idle", self.idle);
        self.idleElement.data("jquery_idle_lastId", self.id);
    };

    // Start the IDLE clock
    this.jQuery_IDLE_Detection_API.prototype.startIdleClock = function() {
        var self = this;
        self.idleStartTime = Date.now();
        self.idleDurationStart = false;
        self.idleDurationTime = false;
        self.idleEndTime = false;
    }

    // Stop the IDLE clock
    this.jQuery_IDLE_Detection_API.prototype.stopIdleClock = function() {
        var self = this;
        var startTime = self.idleStartTime;
        var endTime = Date.now();

        self.idleEndTime = endTime;
        self.idleStartTime = false;
        self.idleDurationStart = startTime;

        if (startTime) {
            self.idleDurationTime = (endTime - startTime);
            self.idleDurationTime = Math.round(self.idleDurationTime);
            self.idleDurationTime = Number(self.idleDurationTime);
        } else {
            self.idleDurationTime = 0;
        }

        return self.idleDurationTime;
    };

    // Make the time unqiue, across the idle binds.
    Number.prototype.jIdle_unique_idle_time = function() {
        var proposedTime = this;
        var propNumTime = Number(proposedTime);
        if (!_jIdleTimes.length) {
            return propNumTime;
        }
        for (var x = 0; x < _jIdleTimes.length; x++) {
            let jIdleTime = Number(_jIdleTimes[x]);
            if (jIdleTime === propNumTime) {
                propNumTime = propNumTime + 1;
            }
        }
        return propNumTime;
    };

}(jQuery, window));