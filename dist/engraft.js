"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.html = html;
exports.innerHTML = void 0;

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

/*
 * EngraftJS
 * @author: Daniel Mascena <danielmascena@gmail.com>
 */

/*jshint esversion: 6 */
var innerHTML = Symbol('innerHTML');
exports.innerHTML = innerHTML;

function htmlEscape(str) {
  return str.replace(/&/g, '&amp;').replace(/>/g, '&gt;').replace(/</g, '&lt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;').replace(/`/g, '&#96;');
}

function hashCode(wUppercase) {
  var text = '',
      possible = "abcdefghijklmnopqrstuvwxyz".concat(wUppercase ? "ABCDEFGHIJKLMNOPQRSTUVWXYZ" : "", "0123456789");

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
      if (obj === null || Object.getOwnPropertyNames(obj).length === 0) return;else if (obj._engraft) {
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
    var lit = raw[i]; // (subst != null)

    if (subst !== null && subst !== undefined) {
      if (Array.isArray(subst)) {
        var tmp = '';
        subst.some(function (v) {
          return v._engraft;
        }) && subst.forEach(function (obj) {
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

        var _attrID = "_egf-fauxid-" + hashCode();

        var hashValue = hashCode(true);
        elemEvents.push({
          _attrID: _attrID,
          hashValue: hashValue,
          fn: subst,
          eventType: eventType
        });
        subst = "".concat(String(subst), "\" ").concat(_attrID, "=\"").concat(hashValue);
      }
    }

    if (lit.endsWith('!')) {
      subst = htmlEscape(subst);
      lit = lit.slice(0, -1);
    }

    result += lit;
    result += subst || '';
  });
  result += raw[raw.length - 1];
  return {
    result: result,
    elemEvents: elemEvents,
    _engraft: '🎋'
  };
}

(function engraft() {
  window['🎋'] || (window['🎋'] = !function () {
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
            var evt = _step.value;
            var elem = this.querySelector("[".concat(evt._attrID, "]"));
            elem[evt.eventType] && elem.addEventListener(evt.eventType, evt.fn);
            elem.removeAttribute(evt._attrID);
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

html.innerHTML = innerHTML;