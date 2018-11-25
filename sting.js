
export default function(){
	return function html(templateObject, ...substs) { 
const raw = templateObject.raw;
let result = ''; 
substs.forEach((subst, i) => { 
let lit = raw[i];
 if (Array.isArray(subst)) { 
 subst = subst.join('');
 }
 if (typeof subst === "object" && lit.slice(-7)=== 'style="') {
 subst = Object.entries(subst).map((v,i)=> v.join(":")).join(";");
}
 if (lit.endsWith('!')) { 
 subst = htmlEscape(subst); 
 lit = lit.slice(0, -1);
 }
 result += lit; result += subst; 
 });
 result += raw[raw.length-1];
return result;
}

function htmlEscape(str) { return str.replace(/&/g, '&amp;').replace(/>/g, '&gt;').replace(/</g, '&lt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;').replace(/`/g, '&#96;'); }
}