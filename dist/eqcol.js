(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Eqcol = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

function useNative() {
	if (typeof window.CustomEvent === 'function') {
		return true;
	}

	return false;
}

// https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/CustomEvent
module.exports = useNative() ? window.CustomEvent : function (event, params) {
	const e = document.createEvent('CustomEvent');

	params = params || {
		bubbles: false,
		cancelable: false,
		detail: undefined
	};

	e.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);

	return e;
};

},{}],2:[function(require,module,exports){
'use strict';

function elementDatasetPolyfill() {
	if (!document.documentElement.dataset && (!Object.getOwnPropertyDescriptor(Element.prototype, 'dataset') || !Object.getOwnPropertyDescriptor(Element.prototype, 'dataset').get)) {
		var descriptor = {};

		descriptor.enumerable = true;

		descriptor.get = function () {
			var element = this;
			var map = {};
			var attributes = this.attributes;

			function toUpperCase(n0) {
				return n0.charAt(1).toUpperCase();
			}

			function getter() {
				return this.value;
			}

			function setter(name, value) {
				if (typeof value !== 'undefined') {
					this.setAttribute(name, value);
				} else {
					this.removeAttribute(name);
				}
			}

			for (var i = 0; i < attributes.length; i++) {
				var attribute = attributes[i];

				// This test really should allow any XML Name without
				// colons (and non-uppercase for XHTML)

				if (attribute && attribute.name && /^data-\w[\w\-]*$/.test(attribute.name)) {
					var name = attribute.name;
					var value = attribute.value;

					// Change to CamelCase

					var propName = name.substr(5).replace(/-./g, toUpperCase);

					Object.defineProperty(map, propName, {
						enumerable: this.enumerable,
						get: getter.bind({ value: value || '' }),
						set: setter.bind(element, name)
					});
				}
			}
			return map;
		};

		Object.defineProperty(Element.prototype, 'dataset', descriptor);
	}
}

module.exports = elementDatasetPolyfill;
},{}],3:[function(require,module,exports){
'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

require('element-dataset');

var _customevent = require('customevent');

var _customevent2 = _interopRequireDefault(_customevent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var NAME = 'eqcol';

var DEFAULTS = {
	useTallest: true,
	minHeight: 0,
	byRow: true,
	groupAttr: 'data-' + NAME,
	watchAttr: 'data-' + NAME + '-watch'
};

var EVENT = {
	before: 'equal',
	after: 'equaled'
};

var slice = Array.prototype.slice;

var Eqcol = function () {
	function Eqcol(element, options) {
		var _this = this;

		_classCallCheck(this, Eqcol);

		if (typeof element === 'string') {
			this._element = document.querySelector(element);
		} else if (element.nodeType) {
			this._element = element;
		}

		this._options = _extends({}, DEFAULTS, this._element.dataset, options);

		// Give listeners enough time to attach
		setTimeout(function () {
			return _this.equalize();
		}, 0);
	}

	_createClass(Eqcol, [{
		key: 'equalize',
		value: function equalize() {
			var _this2 = this;

			var $items = this._getItems();

			if (!$items.length) {
				return;
			}

			var preEqualize = new _customevent2.default(EVENT.before, {
				cancelable: true
			});

			this._element.dispatchEvent(preEqualize);
			if (preEqualize.defaultPrevented) {
				return;
			}

			var _loop = function _loop() {
				var $cols = slice.call($items);

				// Keep unselected columns
				var temp = [];

				if (_this2._options.byRow) {
					(function () {
						var that = _this2;

						// Get top offset of first item in the row
						var offset = $items[0].getBoundingClientRect().top;

						// Get all columns with the same offset
						$cols = $cols.filter(function (item) {
							if (that._getHeight(item) > 0) {
								if (item.getBoundingClientRect().top === offset) {
									return true;
								}

								temp.push(item);
							}

							return false;
						});
					})();
				}

				if ($cols.length === 1) {
					var height = _this2._getHeight($cols[0]);

					if (height < _this2._options.minHeight) {
						$cols[0].style.height = _this2._options.minHeight + 'px';
					} else {
						$cols[0].style.height = 'auto';
					}
				} else if ($cols.length > 1) {
					(function () {
						var heights = $cols.map(_this2._getHeight);

						var max = _this2._options.useTallest ? Math.max.apply(null, heights) : Math.min.apply(null, heights);

						// Make sure the height is greater than minHeight
						max = Math.max(_this2._options.minHeight, max);

						$cols.forEach(function (item) {
							item.style.height = max + 'px';
						});
					})();
				}

				// Copy unselected columns to items
				$items = temp;
			};

			while ($items.length > 0) {
				_loop();
			}

			var postEqualize = new _customevent2.default(EVENT.after, {
				cancelable: true
			});

			this._element.dispatchEvent(postEqualize);
		}
	}, {
		key: 'destroy',
		value: function destroy() {
			var items = this._getItems();

			// Reset heights
			slice.call(items).forEach(function (item) {
				item.style.height = 'auto';
			});
		}
	}, {
		key: '_getItems',
		value: function _getItems() {
			var group = this._element.getAttribute('' + this._options.groupAttr) || '';

			return this._element.querySelectorAll('[' + this._options.watchAttr + '="' + group + '"]');
		}
	}, {
		key: '_getHeight',
		value: function _getHeight(col) {
			return col.offsetHeight;
		}
	}]);

	return Eqcol;
}();

module.exports = Eqcol;

},{"customevent":1,"element-dataset":2}]},{},[3])(3)
});