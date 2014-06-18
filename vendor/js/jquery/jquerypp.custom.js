(function(window, $, undefined) {
// ## jquery/dom/styles/styles.js


	// ## jquery/dom/compare/compare.js
	// See http://ejohn.org/blog/comparing-document-position/
	$.fn.compare = function (element) { //usually
		try {
			// Firefox 3 throws an error with XUL - we can't use compare then
			element = element.jquery ? element[0] : element;
		} catch (e) {
			return null;
		}

		// make sure we aren't coming from XUL element
		if (window.HTMLElement) {
			var s = HTMLElement.prototype.toString.call(element);
			if (s == '[xpconnect wrapped native prototype]' || s == '[object XULElement]' || s === '[object Window]') {
				return null;
			}
		}

		if (this[0].compareDocumentPosition) {
			// For browsers that support it, use compareDocumentPosition
			// https://developer.mozilla.org/en/DOM/Node.compareDocumentPosition
			return this[0].compareDocumentPosition(element);
		}

		// this[0] contains element
		if (this[0] == document && element != document) { return 8; }

		var number =
		// this[0] contains element
		(this[0] !== element && this[0].contains(element) && 16) +
		// element contains this[0]
		(this[0] != element && element.contains(this[0]) && 8),
			docEl = document.documentElement;

		// Use the sourceIndex
		if (this[0].sourceIndex) {
			// this[0] precedes element
			number += (this[0].sourceIndex < element.sourceIndex && 4);
			// element precedes foo[0]
			number += (this[0].sourceIndex > element.sourceIndex && 2);
			// The nodes are in different documents
			number += (this[0].ownerDocument !== element.ownerDocument ||
        (this[0] != docEl && this[0].sourceIndex <= 0) ||
        (element != docEl && element.sourceIndex <= 0)) && 1;
		}

		return number;
	};

	// ## jquery/event/fastfix/fastfix.js

	// http://bitovi.com/blog/2012/04/faster-jquery-event-fix.html
	// https://gist.github.com/2377196

	// IE 8 has Object.defineProperty but it only defines DOM Nodes. According to
	// http://kangax.github.com/es5-compat-table/#define-property-ie-note
	// All browser that have Object.defineProperties also support Object.defineProperty properly
	if(Object.defineProperties) {
		var
			// Use defineProperty on an object to set the value and return it
			set = function (obj, prop, val) {
				if(val !== undefined) {
					Object.defineProperty(obj, prop, {
						value : val
					});
				}
				return val;
			},
			// special converters
			special = {
				pageX : function (original) {
					if(!original) {
						return;
					}

					var eventDoc = this.target.ownerDocument || document;
					var doc = eventDoc.documentElement;
					var body = eventDoc.body;
					return original.clientX + ( doc && doc.scrollLeft || body && body.scrollLeft || 0 ) - ( doc && doc.clientLeft || body && body.clientLeft || 0 );
				},
				pageY : function (original) {
					if(!original) {
						return;
					}

					var eventDoc = this.target.ownerDocument || document;
					var doc = eventDoc.documentElement;
					var body = eventDoc.body;
					return original.clientY + ( doc && doc.scrollTop || body && body.scrollTop || 0 ) - ( doc && doc.clientTop || body && body.clientTop || 0 );
				},
				relatedTarget : function (original) {
					if(!original) {
						return;
					}

					return original.fromElement === this.target ? original.toElement : original.fromElement;
				},
				metaKey : function (originalEvent) {
					if(!originalEvent) {
						return;
					}
					return originalEvent.ctrlKey;
				},
				which : function (original) {
					if(!original) {
						return;
					}

					return original.charCode !== null ? original.charCode : original.keyCode;
				}
			};

		// Get all properties that should be mapped
		$.each($.event.keyHooks.props.concat($.event.mouseHooks.props).concat($.event.props), function (i, prop) {
			if (prop !== "target") {
				(function () {
					Object.defineProperty($.Event.prototype, prop, {
						get : function () {
							// get the original value, undefined when there is no original event
							var originalValue = this.originalEvent && this.originalEvent[prop];
							// overwrite getter lookup
							return this['_' + prop] !== undefined ? this['_' + prop] : set(this, prop,
								// if we have a special function and no value
								special[prop] && originalValue === undefined ?
									// call the special function
									special[prop].call(this, this.originalEvent) :
									// use the original value
									originalValue);
						},
						set : function (newValue) {
							// Set the property with underscore prefix
							this['_' + prop] = newValue;
						}
					});
				})();
			}
		});

		$.event.fix = function (inEvent) {
			if (inEvent[ $.expando ]) {
				return inEvent;
			}
			// Create a jQuery event with at minimum a target and type set
			var originalEvent = inEvent;
			var event = $.Event(originalEvent);
			event.target = originalEvent.target;
			// Fix target property, if necessary (#1925, IE 6/7/8 & Safari2)
			if (!event.target) {
				event.target = originalEvent.srcElement || document;
			}

			// Target should not be a text node (#504, Safari)
			if (event.target.nodeType === 3) {
				event.target = event.target.parentNode;
			}

			return event;
		};
	}

	// ## jquery/event/livehack/livehack.js


	var event = $.event,

		//helper that finds handlers by type and calls back a function, this is basically handle
		// events - the events object
		// types - an array of event types to look for
		// callback(type, handlerFunc, selector) - a callback
		// selector - an optional selector to filter with, if there, matches by selector
		//     if null, matches anything, otherwise, matches with no selector
		findHelper = function( events, types, callback, selector ) {
			var t, type, typeHandlers, all, h, handle,
				namespaces, namespace,
				match;
			for ( t = 0; t < types.length; t++ ) {
				type = types[t];
				all = type.indexOf(".") < 0;
				if (!all ) {
					namespaces = type.split(".");
					type = namespaces.shift();
					namespace = new RegExp("(^|\\.)" + namespaces.slice(0).sort().join("\\.(?:.*\\.)?") + "(\\.|$)");
				}
				typeHandlers = (events[type] || []).slice(0);

				for ( h = 0; h < typeHandlers.length; h++ ) {
					handle = typeHandlers[h];

					match = (all || namespace.test(handle.namespace));

					if(match){
						if(selector){
							if (handle.selector === selector  ) {
								callback(type, handle.origHandler || handle.handler);
							}
						} else if (selector === null){
							callback(type, handle.origHandler || handle.handler, handle.selector);
						}
						else if (!handle.selector ) {
							callback(type, handle.origHandler || handle.handler);

						}
					}


				}
			}
		};

	/**
	 * Finds event handlers of a given type on an element.
	 * @param {HTMLElement} el
	 * @param {Array} types an array of event names
	 * @param {String} [selector] optional selector
	 * @return {Array} an array of event handlers
	 */
	event.find = function( el, types, selector ) {
		var events = ( $._data(el) || {} ).events,
			handlers = [];

		if (!events ) {
			return handlers;
		}
		findHelper(events, types, function( type, handler ) {
			handlers.push(handler);
		}, selector);
		return handlers;
	};
	/**
	 * Finds all events.  Group by selector.
	 * @param {HTMLElement} el the element
	 * @param {Array} types event types
	 */
	event.findBySelector = function( el, types ) {
		var events = $._data(el).events,
			selectors = {},
			//adds a handler for a given selector and event
			add = function( selector, event, handler ) {
				var select = selectors[selector] || (selectors[selector] = {}),
					events = select[event] || (select[event] = []);
				events.push(handler);
			};

		if (!events ) {
			return selectors;
		}
		//first check live:
		/*$.each(events.live || [], function( i, live ) {
			if ( $.inArray(live.origType, types) !== -1 ) {
				add(live.selector, live.origType, live.origHandler || live.handler);
			}
		});*/
		//then check straight binds
		findHelper(events, types, function( type, handler, selector ) {
			add(selector || "", type, handler);
		}, null);

		return selectors;
	};
	event.supportTouch = "ontouchend" in document;

	$.fn.respondsTo = function( events ) {
		if (!this.length ) {
			return false;
		} else {
			//add default ?
			return event.find(this[0], $.isArray(events) ? events : [events]).length > 0;
		}
	};
	$.fn.triggerHandled = function( event, data ) {
		event = (typeof event == "string" ? $.Event(event) : event);
		this.trigger(event, data);
		return event.handled;
	};
	/**
	 * Only attaches one event handler for all types ...
	 * @param {Array} types llist of types that will delegate here
	 * @param {Object} startingEvent the first event to start listening to
	 * @param {Object} onFirst a function to call
	 */
	event.setupHelper = function( types, startingEvent, onFirst ) {
		if (!onFirst ) {
			onFirst = startingEvent;
			startingEvent = null;
		}
		var add = function( handleObj ) {
			var bySelector,
                            selector = handleObj.selector || "",
                            namespace  = handleObj.namespace ? '.'+handleObj.namespace : '';

			if ( selector ) {
				bySelector = event.find(this, types, selector);
				if (!bySelector.length ) {
					$(this).delegate(selector, startingEvent + namespace, onFirst);
				}
			}
			else {
				//var bySelector = event.find(this, types, selector);
				if (!event.find(this, types, selector).length ) {
					event.add(this, startingEvent + namespace, onFirst, {
						selector: selector,
						delegate: this
					});
				}

			}

		},
			remove = function( handleObj ) {
				var bySelector, selector = handleObj.selector || "";
				if ( selector ) {
					bySelector = event.find(this, types, selector);
					if (!bySelector.length ) {
						$(this).undelegate(selector, startingEvent, onFirst);
					}
				}
				else {
					if (!event.find(this, types, selector).length ) {
						event.remove(this, startingEvent, onFirst, {
							selector: selector,
							delegate: this
						});
					}
				}
			};
		$.each(types, function() {
			event.special[this] = {
				add: add,
				remove: remove,
				setup: function() {},
				teardown: function() {}
			};
		});
	};


})(this, jQuery);