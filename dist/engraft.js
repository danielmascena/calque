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

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

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

var isEmptyObject = function isEmptyObject(obj) {
  return Object.entries(obj).length === 0 && obj.constructor === Object;
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

function HTMLtoJSON(template, Element) {
  var htmlMarkup;

  if (typeof template === 'string') {
    var docNode;

    if (window.DOMParser) {
      var parser = new DOMParser();
      docNode = parser.parseFromString(template, 'text/html');
    }
    /*else { 
        docNode = new ActiveXObject('Microsoft.XMLDOM');
        docNode.async = false;
        docNode.loadXML(htmlTmpl); 
    }*/


    if (Element != null && Element instanceof HTMLElement) {
      var tagName = Element.tagName,
          attributes = Element.attributes;
      var textContent = docNode.body.textContent;
      var children = docNode.body.children;
      htmlMarkup = {
        tagName: tagName,
        textContent: textContent,
        attributes: attributes,
        children: children
      };
    }
  } else if (_typeof(template) === 'object') {
    htmlMarkup = template;
  }

  var toJSON = function toJSON(e) {
    return {
      tagName: e.tagName,
      textContent: e.textContent,
      attributes: Object.fromEntries(Array.from(e.attributes, function (_ref) {
        var name = _ref.name,
            value = _ref.value;
        return [name, value];
      })),
      children: Array.from(e.children, toJSON)
    };
  };

  return htmlMarkup && toJSON(htmlMarkup);
}

function html(literals) {
  var raw = literals.raw;

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

    var type = _typeof(subst);

    if (subst == null || type === 'object' && Object.getOwnPropertyNames(subst).length === 0) {
      subst = '';
    } else {
      if (Array.isArray(subst)) {
        var tmp = '';
        subst.forEach(function (obj) {
          return tmp += recoverContent(obj);
        });
        subst = tmp || subst.join('');
      } else if (type === 'object') {
        /* HTML5 specification says:
          Then, the start tag may have a number of attributes, [...]. 
          Attributes must be separated from each other by one or more space characters.
        */
        subst = lit.slice(-8).match(/\s+style=["']/) ? Object.entries(subst).map(function (v) {
          return v.join(':');
        }).join(';') : recoverContent(subst);
      } else if (type === 'function' && (strMatch = lit.slice(-15).match(/\son.*=["']$/))) {
        var quote = lit.charAt(lit.length - 1);
        var charNumber = quote.charCodeAt();
        var eventType = strMatch[0].slice(3, -2);
        var engraftID = '_engraft-id-' + hashCode();
        var engraftIDValue = hashCode(true);
        var handlerBody = String(subst);

        if (subst.name.startsWith('bound ') && handlerBody.startsWith(type) && handlerBody.includes('native code')) {
          var toggleQuote = charNumber === 34 ? "'" : "\"";
          handlerBody = "".concat(toggleQuote).concat(type, " ").concat(subst.name.substring(5), " ").concat(handlerBody.substring(9)).concat(toggleQuote);
        }

        elemEvents.push({
          engraftID: engraftID,
          engraftIDValue: engraftIDValue,
          eventHandler: subst,
          eventType: eventType,
          handlerBody: handlerBody
        });
        subst = "".concat(handlerBody).concat(quote, " ").concat(engraftID, "=").concat(quote).concat(engraftIDValue);
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
    var _Object$definePropert;

    Object.defineProperties(HTMLElement.prototype, (_Object$definePropert = {}, _defineProperty(_Object$definePropert, innerHTML, {
      get: function get() {
        return this.innerHTML;
      },
      set: function set(arr) {
        var result = arr.result,
            elemEvents = arr.elemEvents;
        console.info('Element is in the DOM?: ' + this.isConnected);

        if (this.isConnected && !isEmptyObject(this.vdom)) {
          console.log('here we go');
          var nextMarkup = HTMLtoJSON(result, this);
          var previousMarkup = this.vdom;

          var searchDiffs = function searchDiffs(previousVDOM, nextVDOM) {
            var diffs = [],
                sameKeys = [],
                delPreviousKeys = [],
                delNextKeys = [];
            var copyNext = Object.assign({}, nextVDOM);

            var findDiff = function findDiff(elemPrev, elemNext) {
              var diff = {
                textContent: '',
                attributes: {},
                children: []
              };
              Object.is(elemPrev.textContent, elemNext.textContent) || (diff.textContent = elemNext.textContent);
              var previousKeys = Object.keys(elemPrev.attributes);
              var nextKeys = Object.keys(elemNext.attributes);
              var joinKeys = new Set([].concat(_toConsumableArray(previousKeys), _toConsumableArray(nextKeys)));
              var _iteratorNormalCompletion = true;
              var _didIteratorError = false;
              var _iteratorError = undefined;

              try {
                for (var _iterator = joinKeys[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                  var key = _step.value;

                  if (previousKeys.includes(key)) {
                    Object.is(elemPrev.attributes[key], elemNext.attributes[key]) || (diff.attributes[key] = elemNext.attributes[key]);
                  } else {
                    diff.attributes[key] = elemNext.attributes[key];
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

              return diff;
            };

            console.log('result diff: ', findDiff(previousVDOM, nextVDOM));
          };

          var nullify = function nullify() {}; //Node.contains()


          searchDiffs(previousMarkup, nextMarkup);
        } else {
          this.innerHTML = result;
          this.vdom = HTMLtoJSON(result, this);
          console.log(this.vdom);
          var _iteratorNormalCompletion2 = true;
          var _didIteratorError2 = false;
          var _iteratorError2 = undefined;

          try {
            for (var _iterator2 = elemEvents[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
              var event = _step2.value;
              var engraftID = event.engraftID,
                  engraftIDValue = event.engraftIDValue,
                  eventHandler = event.eventHandler,
                  eventType = event.eventType,
                  handlerBody = event.handlerBody;
              var elem = this.querySelector("[".concat(engraftID, "=\"").concat(engraftIDValue, "\"]"));

              if (elem != null && typeof eventHandler === 'function') {
                if (!eventHandler.name && handlerBody.startsWith('function')) {
                  debugger;
                  console.error(handlerBody, 'function expression must have a name');
                  throw new TypeError('function expression must have a name');
                }

                elem[eventType] && elem.addEventListener(eventType, eventHandler);
                elem.removeAttribute(engraftID);
              }
            }
          } catch (err) {
            _didIteratorError2 = true;
            _iteratorError2 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion2 && _iterator2.return != null) {
                _iterator2.return();
              }
            } finally {
              if (_didIteratorError2) {
                throw _iteratorError2;
              }
            }
          }
        }
      },
      enumerable: true,
      configurable: true
    }), _defineProperty(_Object$definePropert, "vdom", {
      value: {},
      writable: true
    }), _Object$definePropert));
  }());
})();

var _default = Engraft;
exports.default = _default;