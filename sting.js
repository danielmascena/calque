
export default function html(templateObject, ...substs) { 
let raw = templateObject.raw;
let result = '';
let list=[];
substs.forEach((subst, i) => { 
let lit = raw[i];
 if (Array.isArray(subst)) { 
 subst = subst.join('');
 }
 if (typeof subst === "object" && lit.slice(-7) === 'style="') {
 subst = JSON.stringify(subst).replace(/,/g,";");
}
if (typeof subst === "function" && lit.slice(-15).match(/[\w.]*\son.*=["']$/)) {
let hash = lit.hashCode();
list.push({id:hash, fn: subst});
subst="' ghostID='"+hash;
}
 if (lit.endsWith('!')) { 
 subst = htmlEscape(subst); 
 lit = lit.slice(0, -1);
 }
 result += lit; result += subst; 
 });
 result += raw[raw.length-1];
 console.log(list);
return [result, list];
}
function htmlEscape(str) { return str.replace(/&/g, '&amp;').replace(/>/g, '&gt;').replace(/</g, '&lt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;').replace(/`/g, '&#96;'); }
String.prototype.hashCode = function () { var text = ""; var possible = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"; for (var i = 0; i < 15; i++) text += possible.charAt(Math.floor(Math.random() * possible.length)); return text; } 