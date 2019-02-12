/***********************************************************************************
 label.js
 @author: danielmascena
************************************************************************************/

'use strict';

const innerHTML = Symbol('innerHTML');

function htmlEscape(str) {
  return str.replace(/&/g, '&amp;').replace(/>/g, '&gt;').replace(/</g, '&lt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;').replace(/`/g, '&#96;');
}

function hashCode(wUppercase) {
  let text = "",
    possible = `abcdefghijklmnopqrstuvwxyz${wUppercase
      ? "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
      : ""}0123456789`;
  for (let i = 0; i < 15; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  return text;
}

function html(templateObject, ...substs) {
  const raw = templateObject.raw;
  let result = '',
    elemEvents = [],
    strMatch,
    recoverContent = obj => {
      if (obj.__label) {
        obj.elemEvents.length && (elemEvents = [
          ...elemEvents,
          ...obj.elemEvents
        ]);
        return obj.result;
      }
      return (Object.prototype.toString === obj.toString)
        ? Object.keys(obj).reduce((acc, key) => acc + `${key}: ${obj[key]}, `, '[Object toString] ')
        : obj;
    };
  substs.forEach((subst, i) => {
    let lit = raw[i];
    if (Array.isArray(subst)) {
      let tmp = '';
      subst.some(v => v.__label) && subst.forEach(obj => {
        tmp += recoverContent(obj);
      });
      subst = tmp || subst.join('');
    }
    if (typeof subst === "object") {
      subst = (lit.slice(-7) === 'style="')
        ? Object.entries(subst).map((v) => v.join(":")).join(";")
        : recoverContent(subst);
    }
    if (typeof subst === "function" && (strMatch = lit.slice(-15).match(/\son.*=["']$/))) {
      let eventType = strMatch[0].slice(3, -2);
      let _attrID = '_lbl-fauxid-' + hashCode();
      let hashValue = hashCode(true);
      elemEvents.push({_attrID, hashValue, fn: subst, eventType});
      subst = `' ${_attrID}='"${hashValue}`;
    }
    if (lit.endsWith('!')) {
      subst = htmlEscape(subst);
      lit = lit.slice(0, -1);
    }
    result += lit;
    result += subst;
  });
  result += raw[raw.length - 1];

  return {result, elemEvents, __label: "🏷️"};
}(function label() {
  window["🏷️"] || (window["🏷️"] = !function() {
    Object.defineProperty(HTMLElement.prototype, innerHTML, {
      get() {
        return this.innerHTML;
      },
      set(arr) {
        let {result, elemEvents} = arr;
        this.innerHTML = result;
        for (let evt of elemEvents) {
          let elem = this.querySelector(`[${evt._attrID}]`);
          elem[evt.eventType] && elem.addEventListener(evt.eventType, evt.fn);
        }
      },
      enumerable: true,
      configurable: true
    });
  }());
})();

export {
  innerHTML,
  html
};
