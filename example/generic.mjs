/* eslint-disable no-console */

import { innerHTML, html } from '../dist/calque.mjs';

export default class GenericElement extends HTMLElement {
	static get observedAttributes() {
		return ['text', 'data-list'];
	}
	constructor(...args) {
		super(...args);
		this.num = 7;
		this.text = 'hitted';
		this.stars = ['Antares', 'Lesath', 'Graffias', 'Dschubba'];
	}
	attributeChangedCallback(attrName, oldValue, newValue) {
		this.render();
	}
	connectedCallback() {
		this.render();
	}
	clickHandler(event){
		event.preventDefault();
		console.log(this.num++);
		this.setAttribute('text', 'clique (pt)');
	}
	changeHandler(){
		console.log(this.text);
	}
	render() {
		let someObj = null, 
			size = this.num, 
			style = {'color': '#8474A1', 'line-height': this.num, 'font-size': `${size*3}px`};
		this[innerHTML] = html`
				<h2 onclick="${ (function mustHaveAName() {alert('I\'m '+this);}).bind(this) }">Who am I?</h2>
        <div id style="${ {'background-color': '#D4D7DB'} }">
          I'm a DIV parent
          <ul>
            ${this.hasAttribute('data-list') 
							&& this.getAttribute('data-list').split(',').map(num => html`<li>${num}</li>`)}
          </ul>
          <button onclick="${ 
	(function addItem(event) {
		if (this.hasAttribute('data-list')) {
			const ulElem = event.target.previousElementSibling;
			let len = ulElem.children && ulElem.children.length;
			let previousVal = len ? +ulElem.lastElementChild.textContent : 0;
			event.stopPropagation();
			let oldVal = this.getAttribute('data-list');
			let strPreVal = oldVal !== '' ? oldVal + ',' : '';
			this.setAttribute('data-list', strPreVal.concat(++previousVal));
			console.log(previousVal, oldVal);
		} else {
			console.warn('No data-list attribute found');
		}
	}).bind(this)
}">+</button>
          <button onclick="${
	(function removeItem() {
		if (this.hasAttribute('data-list')) {
			let list = this.getAttribute('data-list');
			let lastIndex = list.lastIndexOf(',');
			this.setAttribute('data-list', list.slice(0, lastIndex));
		} else {
			console.warn('No data-list attribute found');
		}
	}).bind(this) 
}">-</button>
<button onclick="${
	(function removeAll() {
		this.hasAttribute('data-list') && this.setAttribute('data-list', '');
	}).bind(this)
}">Remove All</button>
        </div>
        <h3 onclick="${ this.clickHandler.bind(this) }" style="${style}">
          A calque example: 📑 <a href="#" title="Click" aria-label="Click" style="font-size: ${size*3}px">${this.getAttribute('text')}</a>
        </h3>
        <ol>
          ${this.stars.map((name, i) => html`<li style="font-size: ${size*i}px" onclick="alert('${name}')">${name}</li>`)}
        </ol>
        ${ (this.stars.length > 5)
		? html`<p>The constellation is complete</p>`
		: html`<p onblur="${ e => console.log(e.target.textContent) }" contenteditable>
				There is some missing stars (see browser console for see the changes)</p>`}
        <p onclick="${() => alert(this.num)}">
          ${ new function(lib){this.libName = lib;}('CalqueJS') }
          ${ {toString: () => 'method override'} }
        </p>
        <input onfocus="${() => this.changeHandler.call(this)}" />
        <span>${someObj}</span><i>${{}}</i><b>${undefined}</b><em>${[]}</em>
    `;
	}
}

window.customElements.define('x-element', GenericElement);
