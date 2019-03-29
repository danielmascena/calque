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

const Elem = e => ({
  toJSON: () => ({
    tagName: 
      e.tagName,
    textContent:
      e.textContent,
    attributes:
      Array.from(e.attributes, ({name, value}) => [name, value]),
    children:
      Array.from(e.children, Elem)
  })
});

const html2json = e =>
  JSON.stringify(Elem(e), null, 2);


export function html(literals, ...substs) {
  const raw = literals.raw;
  
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
      const type = typeof subst;
      if (subst == null || 
          (type === 'object' && 
          Object.getOwnPropertyNames(subst).length === 0)) {
        subst = '';
      } else {
        if (Array.isArray(subst)) {
          let tmp = '';
          subst.forEach(obj => tmp += recoverContent(obj));
          subst = tmp || subst.join('');
        } else if (type === 'object') {
        /* HTML5 specification says:
          Then, the start tag may have a number of attributes, the syntax for which is described below. Attributes must be separated from each other by one or more space characters.
        */
          subst = lit.slice(-8).match(/\s+style=["']/) ?
            Object.entries(subst).map((v) => v.join(':')).join(';')
            : recoverContent(subst);
        } else if (type === 'function' &&
            (strMatch = lit.slice(-15).match(/\son.*=["']$/))) {
          const quote = lit.charAt(lit.length-1);
          const charNumber = quote.charCodeAt();
          const eventType = strMatch[0].slice(3, -2);
          const engraftID = '_engraft-id-' + hashCode();
          const engraftIDValue = hashCode(true);
          let handlerBody = String(subst);
          if (subst.name.startsWith('bound ') && handlerBody.startsWith(type) && handlerBody.includes('native code')) {
            const toggleQuote = charNumber === 34 ? `'` : `"`;   
            handlerBody = `${toggleQuote}${type} ${subst.name.substring(5)} ${handlerBody.substring(9)}${toggleQuote}`;
          }
          elemEvents.push({engraftID, engraftIDValue, eventHandler: subst, eventType, handlerBody});
          subst = `${handlerBody}${quote} ${engraftID}=${quote}${engraftIDValue}`;
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
    Object.defineProperties(HTMLElement.prototype, {
      [innerHTML]: {
        get() {
          return this.innerHTML;
        },
        set(arr) {
          let {result, elemEvents} = arr;
          console.info('Element is in the DOM?: ' + this.isConnected);

          if (this.isConnected) {
            // Object.is();
          } else {
            this.innerHTML = result;
            
            for (let event of elemEvents) {
              let {engraftID, engraftIDValue, eventHandler, eventType, handlerBody} = event;
              let elem = this.querySelector(`[${engraftID}="${engraftIDValue}"]`);

              if (elem != null && 
                  typeof eventHandler === 'function') {
                if (!eventHandler.name && handlerBody.startsWith('function')) {
                  debugger;
                  console.error(handlerBody, 'function expression must have a name');
                  throw new TypeError('function expression must have a name');
                }
                elem[eventType] && elem.addEventListener(eventType, eventHandler);
                elem.removeAttribute(engraftID);
              }
            }
            this.vdom = JSON.parse(html2json(this));
            console.log(this.vdom);
            const parser = new DOMParser();
            console.log(parser.parseFromString(result, 'text/html'));
          }
        },
        enumerable: true,
        configurable: true
      },
      vdom: {
        value: {},
        writable: true
      }
    });
  }());
}());

export default Engraft;
