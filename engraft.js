/**
 * EngraftJS
 * @author: Daniel Mascena <danielmascena@gmail.com>
 */

/*jshint esversion: 6 */

'use strict';

export const innerHTML = Symbol('innerHTML');
const _engraft = '🎋';
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

        else if ('_engraft' in obj) {
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
      if (subst == null || (typeof subst === 'object' && Object.getOwnPropertyNames(subst).length === 0)) {
        subst = '';
      } else {
        if (Array.isArray(subst)) {
          let tmp = '';
          subst.forEach(obj => tmp += recoverContent(obj));
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
          const eventType = strMatch[0].slice(3, -2);
          const engraftID = '_engraft-id-' + hashCode();
          const engraftIDValue = hashCode(true);
          let handlerBody = String(subst);
          if (subst.name.startsWith('bound') && handlerBody.startsWith('function')) {
            handlerBody = 'function' + subst.name.substring(5) + handlerBody.substring(8);
          }
          elemEvents.push({engraftID, engraftIDValue, eventHandler: subst, eventType, handlerBody});
          subst = `${handlerBody}" ${engraftID}="${engraftIDValue}`;
        }
      } 
      if (lit.endsWith('!')) {
        subst = htmlEscape(subst);
        lit = lit.slice(0, -1);
      }
      result += lit;
      result += subst;
    }
  );
  result += raw[raw.length - 1];

  return {result, elemEvents, _engraft};
}

(function engraft() {
  _engraft in window ||
   (window[_engraft] = !function() {
    Object.defineProperty(HTMLElement.prototype, innerHTML, {
      get() {
        return this.innerHTML;
      },
      set(arr) {
        let {result, elemEvents} = arr;
        this.innerHTML = result;
        for (let event of elemEvents) {
          let {engraftID, engraftIDValue, eventHandler, eventType, handlerBody} = event;
          //let isStr;
          let elem = this.querySelector(`[${engraftID}="${engraftIDValue}"]`);

          if (elem != null && 
              typeof eventHandler === 'function') {
            /*
            if (isStr && engraftHandler.length > 0) {
              engraftHandler = Function(handlerBody);
            }
            */
            if (!eventHandler.name && handlerBody.startsWith('function')) {
              console.error(handlerBody, 'function expression must have a name');
              throw new TypeError('function expression must have a name');
            }
            elem[eventType] && elem.addEventListener(eventType, eventHandler);
            elem.removeAttribute(engraftID);
          }
        }
      },
      enumerable: true,
      configurable: true
    });
  }());
}());

export default Engraft;
