(function(window, $, undefined) {
// ## jquery/dom/styles/styles.js

	var getComputedStyle = document.defaultView && document.defaultView.getComputedStyle,
		// The following variables are used to convert camelcased attribute names
		// into dashed names, e.g. borderWidth to border-width
		rupper = /([A-Z])/g,
		rdashAlpha = /-([a-z])/ig,
		fcamelCase = function( all, letter ) {
			return letter.toUpperCase();
		},
		// Returns the computed style for an elementn
		getStyle = function( elem ) {
			if ( getComputedStyle ) {
				return getComputedStyle(elem, null);
			}
			else if ( elem.currentStyle ) {
				return elem.currentStyle;
			}
		},
		// Checks for float px and numeric values
		rfloat = /float/i,
		rnumpx = /^-?\d+(?:px)?$/i,
		rnum = /^-?\d/;

	// Returns a list of styles for a given element
	$.styles = function( el, styles ) {
		if (!el ) {
			return null;
		}
		var  currentS = getStyle(el),
			oldName, val, style = el.style,
			results = {},
			i = 0,
			left, rsLeft, camelCase, name;

		// Go through each style
		for (; i < styles.length; i++ ) {
			name = styles[i];
			oldName = name.replace(rdashAlpha, fcamelCase);

			if ( rfloat.test(name) ) {
				name = $.support.cssFloat ? "float" : "styleFloat";
				oldName = "cssFloat";
			}

			// If we have getComputedStyle available
			if ( getComputedStyle ) {
				// convert camelcased property names to dashed name
				name = name.replace(rupper, "-$1").toLowerCase();
				// use getPropertyValue of the current style object
				val = currentS.getPropertyValue(name);
				// default opacity is 1
				if ( name === "opacity" && val === "" ) {
					val = "1";
				}
				results[oldName] = val;
			} else {
				// Without getComputedStyles
				camelCase = name.replace(rdashAlpha, fcamelCase);
				results[oldName] = currentS[name] || currentS[camelCase];

				// convert to px
				if (!rnumpx.test(results[oldName]) && rnum.test(results[oldName]) ) {
					// Remember the original values
					left = style.left;
					rsLeft = el.runtimeStyle.left;

					// Put in the new values to get a computed value out
					el.runtimeStyle.left = el.currentStyle.left;
					style.left = camelCase === "fontSize" ? "1em" : (results[oldName] || 0);
					results[oldName] = style.pixelLeft + "px";

					// Revert the changed values
					style.left = left;
					el.runtimeStyle.left = rsLeft;
				}

			}
		}

		return results;
	};

	/**
	 * @function jQuery.fn.styles
	 * @parent jQuery.styles
	 * @plugin jQuery.styles
	 *
	 * Returns a set of computed styles. Pass the names of the styles you want to
	 * retrieve as arguments:
	 *
	 *      $("div").styles('float','display')
	 *      // -> { cssFloat: "left", display: "block" }
	 *
	 * @param {String} style pass the names of the styles to retrieve as the argument list
	 * @return {Object} an object of `style` : `value` pairs
	 */
	$.fn.styles = function() {
		// Pass the arguments as an array to $.styles
		return $.styles(this[0], $.makeArray(arguments));
	};

	// ## jquery/dom/animate/animate.js


	// Overwrites `jQuery.fn.animate` to use CSS 3 animations if possible

	var
		// The global animation counter
		animationNum = 0,
		// The stylesheet for our animations
		styleSheet = null,
		// The animation cache
		cache = [],
		// Stores the browser properties like transition end event name and prefix
		browser = null,
		// Store the original $.fn.animate
		oldanimate = $.fn.animate,

		// Return the stylesheet, create it if it doesn't exists
		getStyleSheet = function () {
			if(!styleSheet) {
				var style = document.createElement('style');
				style.setAttribute("type", "text/css");
				style.setAttribute("media", "screen");

				document.getElementsByTagName('head')[0].appendChild(style);
				if (!window.createPopup) { /* For Safari */
					style.appendChild(document.createTextNode(''));
				}

				styleSheet = style.sheet;
			}

			return styleSheet;
		},

		//removes an animation rule from a sheet
		removeAnimation = function (sheet, name) {
			for (var j = sheet.cssRules.length - 1; j >= 0; j--) {
				var rule = sheet.cssRules[j];
				// 7 means the keyframe rule
				if (rule.type === 7 && rule.name == name) {
					sheet.deleteRule(j)
					return;
				}
			}
		},

		// Returns whether the animation should be passed to the original $.fn.animate.
		passThrough = function (props, ops) {
			var nonElement = !(this[0] && this[0].nodeType),
				isInline = !nonElement && $(this).css("display") === "inline" && $(this).css("float") === "none";

			for (var name in props) {
				// jQuery does something with these values
				if (props[name] == 'show' || props[name] == 'hide' || props[name] == 'toggle'
					// Arrays for individual easing
					|| $.isArray(props[name])
					// Negative values not handled the same
					|| props[name] < 0
					// unit-less value
					|| name == 'zIndex' || name == 'z-index' || name == 'scrollTop' || name == 'scrollLeft'
					) {
					return true;
				}
			}

			return props.jquery === true || getBrowser() === null ||
				// Animating empty properties
				$.isEmptyObject(props) ||
				// We can't do custom easing
				(ops && ops.length == 4) || (ops && typeof ops[2] == 'string') ||
				// Second parameter is an object - we can only handle primitives
				$.isPlainObject(ops) ||
				// Inline and non elements
				isInline || nonElement;
		},

		// Gets a CSS number (with px added as the default unit if the value is a number)
		cssValue = function(origName, value) {
			if (typeof value === "number" && !$.cssNumber[ origName ]) {
				return value += "px";
			}
			return value;
		},

		// Feature detection borrowed by http://modernizr.com/
		getBrowser = function(){
			if(!browser) {
				var t,
					el = document.createElement('fakeelement'),
					transitions = {
						'transition': {
							transitionEnd : 'transitionEnd',
							prefix : ''
						},
//						'OTransition': {
//							transitionEnd : 'oTransitionEnd',
//							prefix : '-o-'
//						},
//						'MSTransition': {
//							transitionEnd : 'msTransitionEnd',
//							prefix : '-ms-'
//						},
						'MozTransition': {
							transitionEnd : 'animationend',
							prefix : '-moz-'
						},
						'WebkitTransition': {
							transitionEnd : 'webkitAnimationEnd',
							prefix : '-webkit-'
						}
					}

				for(t in transitions){
					if( el.style[t] !== undefined ){
						browser = transitions[t];
					}
				}
			}
			return browser;
		},

		// Properties that Firefox can't animate if set to 'auto':
		// https://bugzilla.mozilla.org/show_bug.cgi?id=571344
		// Provides a converter that returns the actual value
		ffProps = {
			top : function(el) {
				return el.position().top;
			},
			left : function(el) {
				return el.position().left;
			},
			width : function(el) {
				return el.width();
			},
			height : function(el) {
				return el.height();
			},
			fontSize : function(el) {
				return '1em';
			}
		},

		// Add browser specific prefix
		addPrefix = function(properties) {
			var result = {};
			$.each(properties, function(name, value) {
				result[getBrowser().prefix + name] = value;
			});
			return result;
		},

		// Returns the animation name for a given style. It either uses a cached
		// version or adds it to the stylesheet, removing the oldest style if the
		// cache has reached a certain size.
		getAnimation = function (style) {
			var sheet, name, last;

			// Look up the cached style, set it to that name and reset age if found
			// increment the age for any other animation
			$.each(cache, function (i, animation) {
				if (style === animation.style) {
					name = animation.name;
					animation.age = 0;
				} else {
					animation.age += 1;
				}
			});

			if (!name) { // Add a new style
				var rule, index;

				sheet = getStyleSheet();
				name 	= "jquerypp_animation_" + (animationNum++);
				index = (sheet.cssRules && sheet.cssRules.length) || 0;

				// get the last sheet and insert this rule into it

				// try using a browser prefix, if an exception is thrown, we try the
				// prefixless version, if it still fails, we abort the animation
				try {
					rule = "@" + getBrowser().prefix + "keyframes " + name + ' ' + style;
					sheet.insertRule(rule, index);
				} catch (err) {
					// Opera sets error name as DOMException while Chrome and FF use SyntaxError
					if ([ 'DOMException', 'SyntaxError' ].indexOf(err.name) == -1) {
						throw err;
					}

					try {
						// try without a browser prefix
						rule = "@keyframes " + name + ' ' + style;
						sheet.insertRule(rule,  index);

					} catch(err) {
						if ([ 'DOMException', 'SyntaxError' ].indexOf(err.name) == -1) {
							throw err;
						}

						return void 0;
					}
				}

				cache.push({
					'name': name,
					'style': style,
					'age': 0
				});

				// Sort the cache by age
				cache.sort(function (first, second) {
					return first.age - second.age;
				});

				// Remove the last (oldest) item from the cache if it has more than 20 items
				if (cache.length > 20) {
					last = cache.pop();
					removeAnimation(sheet, last.name);
				}
			}

			return name;
		};


	/**
	 * @function $.fn.animate
	 * @parent $.animate
	 *
	 * Animate CSS properties using native CSS animations, if possible.
	 * Uses the original [$.fn.animate()](http://api.$.com/animate/) otherwise.
	 *
	 * @param {Object} props The CSS properties to animate
	 * @param {Integer|String|Object} [speed=400] The animation duration in ms.
	 * Will use $.fn.animate if a string or object is passed
	 * @param {Function} [callback] A callback to execute once the animation is complete
	 * @return {jQuery} The jQuery element
	 */
	$.fn.animate = function (props, speed, easing, callback) {
		//default to normal animations if browser doesn't support them
		if (passThrough.apply(this, arguments)) {
			return oldanimate.apply(this, arguments);
		}

		var optall = $.speed(speed, easing, callback);

		// Add everything to the animation queue
		this.queue(optall.queue, function(done) {
			var
				//current CSS values
				current,
				// The list of properties passed
				properties = [],
				to = "",
				prop,
				self = $(this),
				duration = optall.duration,
				//the animation keyframe name
				animationName,
				// The key used to store the animation hook
				dataKey,
				//the text for the keyframe
				style = "{ from {",
				// The animation end event handler.
				// Will be called both on animation end and after calling .stop()
				animationEnd = function (currentCSS, exec) {
					self.css(currentCSS);

					self.css(addPrefix({
						"animation-duration" : "",
						"animation-name" : "",
						"animation-fill-mode" : "",
						"animation-play-state" : ""
					}));

					// Call the original callback
					if ($.isFunction(optall.old) && exec) {
						// Call success, pass the DOM element as the this reference
						optall.old.call(self[0], true)
					}

					$.removeData(self, dataKey, true);
				},
				finishAnimation = function() {
					// Call animationEnd using the passed properties
					animationEnd(props, true);
					done();
				};

			for(prop in props) {
				properties.push(prop);
			}

			if(getBrowser().prefix === '-moz-') {
				// Normalize 'auto' properties in FF
				$.each(properties, function(i, prop) {
					var converter = ffProps[$.camelCase(prop)];
					if(converter && self.css(prop) == 'auto') {
						self.css(prop, converter(self));
					}
				});
			}

			// Use $.styles
			current = self.styles.apply(self, properties);
			$.each(properties, function(i, cur) {
				// Convert a camelcased property name
				var name = cur.replace(/([A-Z]|^ms)/g, "-$1" ).toLowerCase();
				style += name + " : " + cssValue(cur, current[cur]) + "; ";
				to += name + " : " + cssValue(cur, props[cur]) + "; ";
			});

			style += "} to {" + to + " }}";

			animationName = getAnimation(style);

			if (!animationName) {
				if (!gotoEnd) {
					animationEnd(self.styles.apply(self, properties), false);
				} else {
					animationEnd(props, true);
				}

				finishAnimation();
			}

			dataKey = animationName + '.run';

			// Add a hook which will be called when the animation stops
			$._data(this, dataKey, {
				stop : function(gotoEnd) {
					// Pause the animation
					self.css(addPrefix({
						'animation-play-state' : 'paused'
					}));
					// Unbind the animation end handler
					self.off(getBrowser().transitionEnd, finishAnimation);
					if(!gotoEnd) {
						// We were told not to finish the animation
						// Call animationEnd but set the CSS to the current computed style
						animationEnd(self.styles.apply(self, properties), false);
					} else {
						// Finish animaion
						animationEnd(props, true);
					}
				}
			});

			// set this element to point to that animation
			self.css(addPrefix({
				"animation-duration" : duration + "ms",
				"animation-name" : animationName,
				"animation-fill-mode": "forwards"
			}));

			// Attach the transition end event handler to run only once
			self.one(getBrowser().transitionEnd, finishAnimation);

		});

		return this;
	};

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
			var s = HTMLElement.prototype.toString.call(element)
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
		if (this[0] == document && element != document) return 8;

		var number =
		// this[0] contains element
		(this[0] !== element && this[0].contains(element) && 16) +
		// element contains this[0]
		(this[0] != element && element.contains(this[0]) && 8),
			docEl = document.documentElement;

		// Use the sourceIndex
		if (this[0].sourceIndex) {
			// this[0] precedes element
			number += (this[0].sourceIndex < element.sourceIndex && 4)
			// element precedes foo[0]
			number += (this[0].sourceIndex > element.sourceIndex && 2)
			// The nodes are in different documents
			number += (this[0].ownerDocument !== element.ownerDocument || (this[0] != docEl && this[0].sourceIndex <= 0) || (element != docEl && element.sourceIndex <= 0)) && 1
		}

		return number;
	}

	// ## jquery/dom/form_params/form_params.js
	var
	// use to parse bracket notation like my[name][attribute]
	keyBreaker = /[^\[\]]+/g,
		// converts values that look like numbers and booleans and removes empty strings
		convertValue = function (value, el) {
			var $el = el;

			if ($.isNumeric(value)) {
				return parseFloat(value);
			} else if (value === 'true') {
			  if ($el.is(":checkbox") && !$el.is(":checked")) {
					return false;
				}

				return true;
			} else if (value === 'false') {
				return false;
			} else if (value === '' || value === null) {
				return undefined;
			} else if (value && $el.is(":checkbox")) {
				if ($el.is(":checked"))
					return value;
				else
					return undefined;
			}

			return value;
		},
		// Access nested data
		nestData = function (elem, type, data, parts, value, seen, fullName) {
			var name = parts.shift();
			// Keep track of the dot separated fullname. Used to uniquely track seen values
			// and if they should be converted to an array or not
			fullName = fullName ? fullName + '.' + name : name;

			if (parts.length) {
				if (!data[name]) {
					data[name] = {};
				}

				// Recursive call
				nestData(elem, type, data[name], parts, value, seen, fullName);
			} else {

				// Handle same name case, as well as "last checkbox checked"
				// case
				if (fullName in seen && type != "radio" && !$.isArray(data[name])) {
					if (name in data) {
						data[name] = [data[name]];
					} else {
						data[name] = [];
					}
				} else {
					seen[fullName] = true;
				}

				// Finally, assign data
				// if ((type == "radio" || type == "checkbox") && !elem.is(":checked")) {
				if ((type == "radio") && !elem.is(":checked")) {
					return;
				}

				if (!data[name]) {
					data[name] = value;
				} else {
					data[name].push(value);
				}


			}

		};

	/**
	 * @function jQuery.fn.formParams
	 * @parent jQuery.formParams
	 * @plugin jquery/dom/form_params
	 * @test jquery/dom/form_params/qunit.html
	 *
	 * Returns a JavaScript object for values in a form.
	 * It creates nested objects by using bracket notation in the form element name.
	 *
	 * @param {Object} [params] If an object is passed, the form will be repopulated
	 * with the values of the object based on the name of the inputs within
	 * the form
	 * @param {Boolean} [convert=false] True if strings that look like numbers
	 * and booleans should be converted and if empty string should not be added
	 * to the result.
	 * @return {Object} An object of name-value pairs.
	 */

	$.fn.extend({
		formParams: function (params) {

			var convert;

			// Quick way to determine if something is a boolean
			if ( !! params === params) {
				convert = params;
				params = null;
			}

			if (params) {
				return this.setParams(params);
			} else {
				return this.getParams(convert);
			}
		},
		setParams: function (params, options) {
      options = options || {};

			// Find all the inputs
			this.find("[name]").each(function () {
				var $this = $(this);
        var name = $this.attr('name');
        var myval;

        if (options.deindexize) {
          name = name.replace(/\[\]/, '');
        }

				var value = params[name];

				// Don't do all this work if there's no value
				if (value !== undefined) {

					// Nested these if statements for performance
					if ($this.is(":radio")) {
						if ($this.val() == value) {
							$this.prop("checked", true);
						}
					} else if ($this.is(":checkbox")) {
            myval = $this.val();

						// Convert single value to an array to reduce complexity
            value = $.isArray(value) ? value : [value];

            if (options.stringify) {
              myval = String(myval);

              for (var i = 0; i < value.length; ++i) {
                value[i] = String(value[i]);
              }
            }
            else if (options.convert) {
              if (!!Number(myval)) {
                myval = Number(myval);
              }
              else if (String(myval) === 'true') {
                myval = true;
              }
              else if (String(myval) === 'false') {
                myval = false;
              }
            }

						if (value.indexOf(myval) > -1) {
							$this.prop("checked", true);
						}

						if (value.length == 1 && String(value[0]) === 'true') {
							$this.prop("checked", true);
						}

					} else {
						$this.val(value);
					}
				}
			});

			return $(this);
		},
		getParams: function (convert) {
			var data = {},
				// This is used to keep track of the checkbox names that we've
				// already seen, so we know that we should return an array if
				// we see it multiple times. Fixes last checkbox checked bug.
				seen = {},
				current;

			this.find("[name]:not(:disabled)").each(function () {
				var $this = $(this),
					type = $this.attr("type"),
					name = $this.attr("name"),
					value = $this.val(),
					parts;

				// Don't accumulate submit buttons and nameless elements
				if (type == "submit" || !name) {
					return;
				}

				// Figure out name parts
				parts = name.match(keyBreaker);
				if (!parts.length) {
					parts = [name];
				}

				// Convert the value
				if (convert) {
					value = convertValue(value, $this);

					if (value === undefined)
						return;
				}

				// Assign data recursively
				nestData($this, type, data, parts, value, seen);

			});

			return data;
		}
	});

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
					doc = eventDoc.documentElement;
					body = eventDoc.body;
					return original.clientX + ( doc && doc.scrollLeft || body && body.scrollLeft || 0 ) - ( doc && doc.clientLeft || body && body.clientLeft || 0 );
				},
				pageY : function (original) {
					if(!original) {
						return;
					}

					var eventDoc = this.target.ownerDocument || document;
					doc = eventDoc.documentElement;
					body = eventDoc.body;
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

					return original.charCode != null ? original.charCode : original.keyCode;
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
									originalValue)
						},
						set : function (newValue) {
							// Set the property with underscore prefix
							this['_' + prop] = newValue;
						}
					});
				})();
			}
		});

		$.event.fix = function (event) {
			if (event[ $.expando ]) {
				return event;
			}
			// Create a jQuery event with at minimum a target and type set
			var originalEvent = event,
				event = $.Event(originalEvent);
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
		}
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
			handlers = [],
			t, liver, live;

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

	// ## jquery/event/swipe/swipe.js

var isPhantom = /Phantom/.test(navigator.userAgent),
	supportTouch = !isPhantom && "ontouchend" in document,
	scrollEvent = "touchmove scroll",
	// Use touch events or map it to mouse events
	touchStartEvent = supportTouch ? "touchstart" : "mousedown",
	touchStopEvent = supportTouch ? "touchend" : "mouseup",
	touchMoveEvent = supportTouch ? "touchmove" : "mousemove",
	data = function(event){
		var d = event.originalEvent.touches ?
			event.originalEvent.touches[ 0 ] :
			event;
		return {
			time: (new Date).getTime(),
			coords: [ d.pageX, d.pageY ],
			origin: $( event.target )
		};
	};

/**
 * @add jQuery.event.swipe
 */
var swipe = $.event.swipe = {
	/**
	 * @attribute delay
	 * Delay is the upper limit of time the swipe motion can take in milliseconds.  This defaults to 500.
	 *
	 * A user must perform the swipe motion in this much time.
	 */
	delay : 500,
	/**
	 * @attribute max
	 * The maximum distance the pointer must travel in pixels.  The default is 75 pixels.
	 */
	max : 320,
	/**
	 * @attribute min
	 * The minimum distance the pointer must travel in pixels.  The default is 30 pixels.
	 */
	min : 30
};

$.event.setupHelper( [

/**
 * @hide
 * @attribute swipe
 */
"swipe",
/**
 * @hide
 * @attribute swipeleft
 */
'swipeleft',
/**
 * @hide
 * @attribute swiperight
 */
'swiperight',
/**
 * @hide
 * @attribute swipeup
 */
'swipeup',
/**
 * @hide
 * @attribute swipedown
 */
'swipedown'], touchStartEvent, function(ev){
	var
		// update with data when the event was started
		start = data(ev),
		stop,
		delegate = ev.delegateTarget || ev.currentTarget,
		selector = ev.handleObj.selector,
		entered = this;

	function moveHandler(event){
		if ( !start ) {
			return;
		}
		// update stop with the data from the current event
		stop = data(event);

		// prevent scrolling
		if ( Math.abs( start.coords[0] - stop.coords[0] ) > 10 ) {
			event.preventDefault();
		}
	};

	// Attach to the touch move events
	$(document.documentElement).bind(touchMoveEvent, moveHandler)
		.one(touchStopEvent, function(event){
			$(this).unbind( touchMoveEvent, moveHandler);
			// if start and stop contain data figure out if we have a swipe event
			if ( start && stop ) {
				// calculate the distance between start and stop data
				var deltaX = Math.abs(start.coords[0] - stop.coords[0]),
					deltaY = Math.abs(start.coords[1] - stop.coords[1]),
					distance = Math.sqrt(deltaX*deltaX+deltaY*deltaY);

				// check if the delay and distance are matched
				if ( stop.time - start.time < swipe.delay && distance >= swipe.min && distance <= swipe.max ) {
					var events = ['swipe'];
					// check if we moved horizontally
					if( deltaX >= swipe.min && deltaY < swipe.min) {
						// based on the x coordinate check if we moved left or right
						events.push( start.coords[0] > stop.coords[0] ? "swipeleft" : "swiperight" );
					} else
					// check if we moved vertically
					if(deltaY >= swipe.min && deltaX < swipe.min){
						// based on the y coordinate check if we moved up or down
						events.push( start.coords[1] < stop.coords[1] ? "swipedown" : "swipeup" );
					}

					// trigger swipe events on this guy
					$.each($.event.find(delegate, events, selector), function(){
						this.call(entered, ev, {start : start, end: stop})
					})

				}
			}
			// reset start and stop
			start = stop = undefined;
		})
});


})(this, jQuery);