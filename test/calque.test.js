import {innerHTML, html} from '../calque';

test('testing for a returned object', () => {
	const c = html``;
	expect(c).not.toBeNull();
	expect(c).not.toBeUndefined();
});

test('verifing the non-empty returned object', () => {
	expect(Object.keys(html`<h1></h1>`)).toEqual(['result', 'elemEvents', '_calque']);
});

test('verify the string result', () => {
	expect(html`<h1>Hello ${['C','a','l','q','u','e'].join('')}</h1>`.result).toMatch(/Hello Calque/);
});

test('checking for the event bound', () => {
	expect(html`<h1 onclick="${()=>alert('Hi there!')}"">Heading One</h1>`.elemEvents.length).toBeGreaterThan(0);
});

test('checking for the presence of vdom property', () => {
	const p = document.createElement('p');
	expect(p.vdom).toBeUndefined();
	p[innerHTML] = html`some text <span>goes</span> here`;
	expect(p.vdom).toBeDefined();
})