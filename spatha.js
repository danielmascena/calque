(function spatha() {
	window["🗡"] || (window["🗡"] = !function(){        
    Object.defineProperty(HTMLElement.prototype, '_innerHTML', {
      get(){ return this.innerHTML;}, 
      set(arr){
        let [result, elemEvents] = arr;
        this.innerHTML = result;
        for (evt of elemEvents) {
        let elem = this.querySelector(`[${evt._attrID}]`);    
        elem[evt.eventType] && elem.addEventListener(evt.eventType, evt.fn);
      }
      }, 
      enumerable: true, 
      configurable: true
    });    
  }());  
})();

function htmlEscape(str) { return str.replace(/&/g, '&amp;').replace(/>/g, '&gt;').replace(/</g, '&lt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;').replace(/`/g, '&#96;'); }

String.prototype.hashCode = function (wUppercase) { 
  let text = "", 
      possible = `abcdefghijklmnopqrstuvwxyz${wUppercase ? "ABCDEFGHIJKLMNOPQRSTUVWXYZ" : ""}0123456789`; 
  for (let i = 0; i < 15; i++) text += possible.charAt(Math.floor(Math.random() * possible.length)); 
  return text; 
}

export default function html(templateObject, ...substs) {
  const raw = templateObject.raw;
  let result = '', elemEvents=[], strMatch;
  substs.forEach((subst, i) => {
    let lit = raw[i];
    if (Array.isArray(subst)) { 
      subst = subst.join('');
    }
    if (typeof subst === "object" && lit.slice(-7) === 'style="') {          
      subst = Object.entries(subst).map((v,i)=> v.join(":")).join(";");
    }
    if (typeof subst === "function" && (strMatch = lit.slice(-15).match(/\son.*=["']$/))) {
      let eventType = strMatch[0].slice(3, -2);  
      let _attrID = '_spt-fauxid-'+lit.hashCode();
      let hashValue = _attrID.hashCode(true);
      elemEvents.push({_attrID, hashValue, fn: subst, eventType});
      subst=`' ${_attrID}='"${hashValue}`;
    }
    if (lit.endsWith('!')) { 
      subst = htmlEscape(subst); 
      lit = lit.slice(0, -1);
    }
    result += lit;
    result += subst; 
  });
  result += raw[raw.length-1];

  return [result, elemEvents];
}

let innerHTML = Symbol("innerHTML")