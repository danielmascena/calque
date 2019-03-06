/**
 * EngraftJS
 * @author: Daniel Mascena <danielmascena@gmail.com>
 */

/*jshint esversion: 6 */
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.html = html;
exports.default = exports.innerHTML = void 0;

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var innerHTML = Symbol('innerHTML');
exports.innerHTML = innerHTML;
var _engraft = '🎋';
var Engraft = {
  innerHTML: innerHTML,
  html: html
};

function htmlEscape(str) {
  return str.replace(/&/g, '&amp;').replace(/>/g, '&gt;').replace(/</g, '&lt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;').replace(/`/g, '&#96;');
}

function hashCode(wUppercase) {
  var text = '',
      possible = "abcdefghijklmnopqrstuvwxyz".concat(wUppercase ? 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' : '', "0123456789");

  for (var i = 0; i < 15; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }

  return text;
}

function html(templateObject) {
  var raw = templateObject.raw;

  var result = '',
      elemEvents = [],
      strMatch,
      recoverContent = function recoverContent(obj) {
    if (_typeof(obj) === 'object') {
      if (obj === null || Object.getOwnPropertyNames(obj).length === 0) return;else if ('_engraft' in obj) {
        obj.elemEvents.length && (elemEvents = [].concat(_toConsumableArray(elemEvents), _toConsumableArray(obj.elemEvents)));
        return obj.result;
      }
      return Object.prototype.toString === obj.toString ? Object.keys(obj).reduce(function (acc, key) {
        return acc + "".concat(key, ": ").concat(obj[key], ",\n          ");
      }, '[Object toString] ') : obj;
    }
  };

  for (var _len = arguments.length, substs = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    substs[_key - 1] = arguments[_key];
  }

  substs.forEach(function (subst, i) {
    var lit = raw[i];

    if (subst == null) {
      subst = '';
    } else {
      if (Array.isArray(subst)) {
        var tmp = '';
        subst.forEach(function (obj) {
          return tmp += recoverContent(obj);
        });
        subst = tmp || subst.join('');
      }

      if (_typeof(subst) === 'object') {
        /* HTML5 specification says:
          Then, the start tag may have a number of attributes, the syntax for which is described below. Attributes must be separated from each other by one or more space characters.
        */
        subst = lit.slice(-8).match(/\s+style=["']/) ? Object.entries(subst).map(function (v) {
          return v.join(':');
        }).join(';') : recoverContent(subst);
      }

      if (typeof subst === 'function' && (strMatch = lit.slice(-15).match(/\son.*=["']$/))) {
        var eventType = strMatch[0].slice(3, -2);
        var engraftID = '_engraft-id-' + hashCode();
        var engraftIDValue = hashCode(true);
        var handlerBody = String(subst);
        elemEvents.push({
          engraftID: engraftID,
          engraftIDValue: engraftIDValue,
          eventHandler: subst,
          eventType: eventType,
          handlerBody: handlerBody
        });
        subst = "\" ".concat(engraftID, "=\"").concat(engraftIDValue);
      }
    }

    if (lit.endsWith('!')) {
      subst = htmlEscape(subst);
      lit = lit.slice(0, -1);
    }

    result += lit;
    result += subst;
  });
  result += raw[raw.length - 1];
  return {
    result: result,
    elemEvents: elemEvents,
    _engraft: _engraft
  };
}

(function engraft() {
  _engraft in window || (window[_engraft] = !function () {
    Object.defineProperty(HTMLElement.prototype, innerHTML, {
      get: function get() {
        return this.innerHTML;
      },
      set: function set(arr) {
        var result = arr.result,
            elemEvents = arr.elemEvents;
        this.innerHTML = result;
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = elemEvents[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var event = _step.value;
            var engraftID = event.engraftID,
                engraftIDValue = event.engraftIDValue,
                eventHandler = event.eventHandler,
                eventType = event.eventType,
                handlerBody = event.handlerBody; //let isStr;

            var elem = this.querySelector("[".concat(engraftID, "=\"").concat(engraftIDValue, "\"]"));

            if (elem != null && typeof eventHandler === 'function') {
              /*
              if (isStr && engraftHandler.length > 0) {
                engraftHandler = Function(handlerBody);
              }
              */
              if (!eventHandler.name && handlerBody.startsWith('function')) {
                console.error(handlerBody, 'function expression must have a name');
              }

              elem[eventType] && elem.addEventListener(eventType, eventHandler);
              elem.removeAttribute(engraftID);
            }
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator.return != null) {
              _iterator.return();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }
      },
      enumerable: true,
      configurable: true
    });
  }());
})();

var _default = Engraft;
exports.default = _default;