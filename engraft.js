/**
 * EngraftJS
 * @author: Daniel Mascena <danielmascena@gmail.com>
 */

/*jshint esversion: 6 */

'use strict';

export const innerHTML = Symbol('innerHTML');
const Engraft = {
  innerHTML,
  html,
};

function htmlEscape(str) {
  return str
   .replace(/&/g, '&amp;')
   .replace(/>/g, '&gt;')
   .replace(/</g, '&lt;')
   .replace(/"/g, '&quot;')
   .replace(/'/g, '&#39;')
   .replace(/`/g, '&#96;');
}

function hashCode(wUppercase) {
  let text = '',
    possible = (`abcdefghijklmnopqrstuvwxyz${wUppercase ?
      'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
      : ''}0123456789`);
  for (let i = 0; i < 15; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  return text;
}

export function html(templateObject, ...substs) {
  const raw = templateObject.raw;
  let result = '',
    elemEvents = [],
    strMatch,
    recoverContent = obj => {
      if (typeof obj === 'object') {
        if (obj === null || Object.getOwnPropertyNames(obj).length === 0) return;

        else if (obj._engraft) {
          obj.elemEvents.length && (elemEvents = [
            ...elemEvents,
            ...obj.elemEvents
          ]);
          return obj.result;
        }
        return (Object.prototype.toString === obj.toString ?
          Object.keys(obj).reduce((acc, key) => acc + `${key}: ${obj[key]},
          `, '[Object toString] ') : obj);
      }
    };
    substs.forEach((subst, i) => {
      let lit = raw[i];
      // (subst != null)
      if (subst !== null && subst !== undefined) {
        if (Array.isArray(subst)) {
          let tmp = '';
          subst.some(v => v._engraft) && subst.forEach(obj => tmp += recoverContent(obj));
          subst = tmp || subst.join('');
        }
        if (typeof subst === 'object') {
        /* HTML5 specification says:
          Then, the start tag may have a number of attributes, the syntax for which is described below. Attributes must be separated from each other by one or more space characters.
        */
          subst = lit.slice(-8).match(/\s+style=["']/) ?
            Object.entries(subst).map((v) => v.join(':')).join(';')
            : recoverContent(subst);
        }
        if (typeof subst === 'function' &&
            (strMatch = lit.slice(-15).match(/\son.*=["']$/))) {
          let eventType = strMatch[0].slice(3, -2);
          let _attrID = '_egf-fauxid-' + hashCode();
          let hashValue = hashCode(true);
          elemEvents.push({_attrID, hashValue, fn: subst, eventType});
          subst = `${String(subst)}" ${_attrID}="${hashValue}`;
        }
      }
      if (lit.endsWith('!')) {
        subst = htmlEscape(subst);
        lit = lit.slice(0, -1);
      }
      result += lit;
      result += (subst || '');
    }
  );
  result += raw[raw.length - 1];

  return {result, elemEvents, _engraft: '🎋'};
}

(function engraft() {
  window['🎋'] ||
   (window['🎋'] = !function() {
    Object.defineProperty(HTMLElement.prototype, innerHTML, {
      get() {
        return this.innerHTML;
      },
      set(arr) {
        let {result, elemEvents} = arr;
        this.innerHTML = result;
        for (let evt of elemEvents) {
          let attrID = evt._attrID;
          let elem = this.querySelector(`[${attrID}]`);
          let callback = evt.fn;
          if (!typeof callback === 'function') callback = Function(callback);
          callback.name || console.error('function must have a name');
          elem[evt.eventType] && elem.addEventListener(evt.eventType, callback);
          elem.removeAttribute(attrID);
        }
      },
      enumerable: true,
      configurable: true
    });
  }());
})();

export default Engraft;
