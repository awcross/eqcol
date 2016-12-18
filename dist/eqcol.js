(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.eqcol = factory());
}(this, (function () { 'use strict';

// <3 Modernizr
// https://raw.githubusercontent.com/Modernizr/Modernizr/master/feature-detects/dom/dataset.js

function useNative() {
	var elem = document.createElement('div');
	elem.setAttribute('data-a-b', 'c');

	return Boolean(elem.dataset && elem.dataset.aB === 'c');
}

function nativeDataset(element) {
	return element.dataset;
}

var index = useNative() ? nativeDataset : function (element) {
	var map = {};
	var attributes = element.attributes;

	function getter() {
		return this.value;
	}

	function setter(name, value) {
		if (typeof value === 'undefined') {
			this.removeAttribute(name);
		} else {
			this.setAttribute(name, value);
		}
	}

	for (var i = 0, j = attributes.length; i < j; i++) {
		var attribute = attributes[i];

		if (attribute) {
			var name = attribute.name;

			if (name.indexOf('data-') === 0) {
				var prop = name.slice(5).replace(/-./g, function (u) {
					return u.charAt(1).toUpperCase();
				});

				var value = attribute.value;

				Object.defineProperty(map, prop, {
					enumerable: true,
					get: getter.bind({ value: value || '' }),
					set: setter.bind(element, name)
				});
			}
		}
	}

	return map;
};

function useNative$1() {
	if (typeof window.CustomEvent === 'function') {
		return true;
	}

	return false;
}

// https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/CustomEvent
var index$1 = useNative$1() ? window.CustomEvent : function (event, params) {
	var e = document.createEvent('CustomEvent');

	params = params || {
		bubbles: false,
		cancelable: false,
		detail: undefined
	};

	e.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);

	return e;
};

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

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
		_classCallCheck(this, Eqcol);

		this._element = element;
		this._options = _extends({}, DEFAULTS, index(this._element), options);
	}

	Eqcol.prototype.equalize = function equalize() {
		var _this = this;

		var items = this._getItems();

		if (items.length === 0) {
			return;
		}

		var length = items.length;
		var preEqualize = new index$1(EVENT.before, {
			cancelable: true,
			detail: {
				length: length
			}
		});

		this._element.dispatchEvent(preEqualize);
		if (preEqualize.defaultPrevented) {
			return;
		}

		// Reset heights
		this._reset(items);

		var _loop = function _loop() {
			var cols = slice.call(items);

			// Keep unselected columns
			var temp = [];

			if (_this._options.byRow) {
				(function () {
					var that = _this;

					// Get top offset of first item in the row
					var offset = items[0].getBoundingClientRect().top;

					// Get all columns with the same offset
					cols = cols.filter(function (item) {
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

			if (cols.length === 1) {
				var height = _this._getHeight(cols[0]);

				if (height < _this._options.minHeight) {
					cols[0].style.height = _this._options.minHeight + 'px';
				} else {
					cols[0].style.height = 'auto';
				}
			} else if (cols.length > 1) {
				(function () {
					var heights = cols.map(_this._getHeight);

					var max = _this._options.useTallest ? Math.max.apply(null, heights) : Math.min.apply(null, heights);

					// Make sure the height is greater than minHeight
					max = Math.max(_this._options.minHeight, max);

					cols.forEach(function (item) {
						item.style.height = max + 'px';
					});
				})();
			}

			// Copy unselected columns to items
			items = temp;
		};

		while (items.length > 0) {
			_loop();
		}

		var postEqualize = new index$1(EVENT.after, {
			detail: {
				length: length
			}
		});

		this._element.dispatchEvent(postEqualize);
	};

	Eqcol.prototype.destroy = function destroy() {
		this._reset();
	};

	Eqcol.prototype._getHeight = function _getHeight(col) {
		return col.offsetHeight;
	};

	Eqcol.prototype._getItems = function _getItems() {
		var group = this._element.getAttribute('' + this._options.groupAttr) || '';

		return this._element.querySelectorAll('[' + this._options.watchAttr + '="' + group + '"]');
	};

	Eqcol.prototype._reset = function _reset() {
		var items = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this._getItems();

		slice.call(items).forEach(function (item) {
			item.style.height = 'auto';
		});
	};

	return Eqcol;
}();

var eqcol = function (element, options) {
	if (typeof element === 'string') {
		element = document.querySelectorAll(element);
	}

	var items = element instanceof NodeList ? slice.call(element) : [].concat(element);

	var _loop2 = function _loop2(item) {
		var instance = new Eqcol(item, (typeof options === 'undefined' ? 'undefined' : _typeof(options)) === 'object' && options);

		if (typeof options === 'string') {
			instance[options]();
		} else {
			setTimeout(function () {
				return instance.equalize();
			});
		}
	};

	for (var _iterator = items, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
		var _ref;

		if (_isArray) {
			if (_i >= _iterator.length) break;
			_ref = _iterator[_i++];
		} else {
			_i = _iterator.next();
			if (_i.done) break;
			_ref = _i.value;
		}

		var item = _ref;

		_loop2(item);
	}

	return items;
};

return eqcol;

})));
