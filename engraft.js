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
const isEmptyObject = (obj) => Object.entries(obj).length === 0 && obj.constructor === Object;

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

function HTMLtoJSON(template, Element) {
  let htmlMarkup;
  if (typeof template === 'string') {
    let docNode;
    if (window.DOMParser) {
          const parser = new DOMParser();
          docNode = parser.parseFromString(template, 'text/html');
    } /*else { 
          docNode = new ActiveXObject('Microsoft.XMLDOM');
          docNode.async = false;
          docNode.loadXML(htmlTmpl); 
    }*/
    if (Element != null && Element instanceof HTMLElement) {
      let {tagName, attributes} = Element;
      let textContent = docNode.body.textContent;
      let children = docNode.body.children;
      htmlMarkup = {tagName, textContent, attributes, children};
    }
  } else if (typeof template === 'object') {
    htmlMarkup = template;
  }
  const toJSON = e => ({
    tagName: 
      e.tagName,
    textContent:
      e.textContent,
    attributes:
      Object.fromEntries(Array.from(e.attributes, ({name, value}) => [name, value])),
    children:
      Array.from(e.children, toJSON)
  });
  return htmlMarkup && toJSON(htmlMarkup);
}

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
          Then, the start tag may have a number of attributes, [...]. 
          Attributes must be separated from each other by one or more space characters.
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
          if (this.isConnected && !isEmptyObject(this.vdom)) {
            let nextMarkup = HTMLtoJSON(result, this);
            let previousMarkup = this.vdom;
            
            const searchDiffs = (previousVDOM, nextVDOM) => {
              let sameKeys = [], delPreviousKeys = [], delNextKeys = [];
              let copyNext = Object.assign({}, nextVDOM);
              
              const findDiff = (elemPrev, elemNext) => {
                let diff = {
                  textContent: '',
                  attributes: {},
                  children: []
                }
                Object.is(elemPrev.textContent, elemNext.textContent) 
                    || (diff.textContent = elemNext.textContent);
                const previousKeys = Object.keys(elemPrev.attributes);
                const nextKeys = Object.keys(elemNext.attributes);
                const joinKeys = new Set([...previousKeys, ...nextKeys]);
                for (let key of joinKeys) {
                  if (previousKeys.includes(key)) {
                    Object.is(elemPrev.attributes[key], elemNext.attributes[key]) 
                        || (diff.attributes[key] = elemNext.attributes[key]);
                  } else {
                    diff.attributes[key] = elemNext.attributes[key];
                  }
                }
                return diff;
              }
              const diff = findDiff(previousVDOM, nextVDOM);

              for (let key in diff) {
                let value = diff[key];
                if (typeof value === 'string' && value !== '') {
                  this[key] = value;
                }
              }
            }
            const nullify = () => {};
            //Node.contains()
            searchDiffs(previousMarkup, nextMarkup);
          } else {
            this.innerHTML = result;
            this.vdom = HTMLtoJSON(result, this);
            console.log(this.vdom);
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
