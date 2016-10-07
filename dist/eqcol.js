(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (factory());
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

var asyncGenerator = function () {
  function AwaitValue(value) {
    this.value = value;
  }

  function AsyncGenerator(gen) {
    var front, back;

    function send(key, arg) {
      return new Promise(function (resolve, reject) {
        var request = {
          key: key,
          arg: arg,
          resolve: resolve,
          reject: reject,
          next: null
        };

        if (back) {
          back = back.next = request;
        } else {
          front = back = request;
          resume(key, arg);
        }
      });
    }

    function resume(key, arg) {
      try {
        var result = gen[key](arg);
        var value = result.value;

        if (value instanceof AwaitValue) {
          Promise.resolve(value.value).then(function (arg) {
            resume("next", arg);
          }, function (arg) {
            resume("throw", arg);
          });
        } else {
          settle(result.done ? "return" : "normal", result.value);
        }
      } catch (err) {
        settle("throw", err);
      }
    }

    function settle(type, value) {
      switch (type) {
        case "return":
          front.resolve({
            value: value,
            done: true
          });
          break;

        case "throw":
          front.reject(value);
          break;

        default:
          front.resolve({
            value: value,
            done: false
          });
          break;
      }

      front = front.next;

      if (front) {
        resume(front.key, front.arg);
      } else {
        back = null;
      }
    }

    this._invoke = send;

    if (typeof gen.return !== "function") {
      this.return = undefined;
    }
  }

  if (typeof Symbol === "function" && Symbol.asyncIterator) {
    AsyncGenerator.prototype[Symbol.asyncIterator] = function () {
      return this;
    };
  }

  AsyncGenerator.prototype.next = function (arg) {
    return this._invoke("next", arg);
  };

  AsyncGenerator.prototype.throw = function (arg) {
    return this._invoke("throw", arg);
  };

  AsyncGenerator.prototype.return = function (arg) {
    return this._invoke("return", arg);
  };

  return {
    wrap: function (fn) {
      return function () {
        return new AsyncGenerator(fn.apply(this, arguments));
      };
    },
    await: function (value) {
      return new AwaitValue(value);
    }
  };
}();





var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();







var _extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];

    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
};

var get = function get(object, property, receiver) {
  if (object === null) object = Function.prototype;
  var desc = Object.getOwnPropertyDescriptor(object, property);

  if (desc === undefined) {
    var parent = Object.getPrototypeOf(object);

    if (parent === null) {
      return undefined;
    } else {
      return get(parent, property, receiver);
    }
  } else if ("value" in desc) {
    return desc.value;
  } else {
    var getter = desc.get;

    if (getter === undefined) {
      return undefined;
    }

    return getter.call(receiver);
  }
};

















var set = function set(object, property, value, receiver) {
  var desc = Object.getOwnPropertyDescriptor(object, property);

  if (desc === undefined) {
    var parent = Object.getPrototypeOf(object);

    if (parent !== null) {
      set(parent, property, value, receiver);
    }
  } else if ("value" in desc && desc.writable) {
    desc.value = value;
  } else {
    var setter = desc.set;

    if (setter !== undefined) {
      setter.call(receiver, value);
    }
  }

  return value;
};

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

		classCallCheck(this, Eqcol);

		if (typeof element === 'string') {
			this._element = document.querySelector(element);
		} else if (element.nodeType) {
			this._element = element;
		}

		this._options = _extends({}, DEFAULTS, index(this._element), options);

		// Give listeners enough time to attach
		setTimeout(function () {
			return _this.equalize();
		}, 0);
	}

	createClass(Eqcol, [{
		key: 'equalize',
		value: function equalize() {
			var _this2 = this;

			var $items = this._getItems();

			if (!$items.length) {
				return;
			}

			var preEqualize = new index$1(EVENT.before, {
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

			var postEqualize = new index$1(EVENT.after, {
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

})));
