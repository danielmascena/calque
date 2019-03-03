import { innerHTML, html } from '../dist/engraft.mjs';

export default class GenericElement extends HTMLElement {
  static get observedAttributes() {
    return ['name'];
  }
  constructor(...args) {
    super(...args);
    this.stars = ['Antares', 'Lesath', 'Graffias', 'Dschubba'];
  }
  attributeChangedCallback() {
    this.render();
  }
  connectedCallback() {
    this.render();
  }
  render() {
    let someObj = null;
    this[innerHTML] = html `
        <p id onblur="${ e => console.log(e.target.textContent)}" class="par"
          onclick="${e => alert(e.target.value)}"
          contenteditable>&#955; ♏ (see browser console for see the changes)
        </p>
        <h1 onclick="${ function() {
          alert('ok')}}" style="${ {'color': 'red', 'font-size': '5em'}}">
          Hello, &lambda; ${this.getAttribute('name')}
        </h1>
        <ul>
          ${this.stars.map(name => html `<li onclick="${ev => alert(name)}">${name}</li>`)}
        </ul>
        ${ (this.stars.length > 5)
            ? html `<p>The constellation is complete</p>`
            : html `<p>There is some missing stars</p>`}
        <p>
          ${ {libName: 'EngraftJS'} }
          ${ {toString: () => 'method override'} }
        </p>
        <span>${someObj}</span><i>${{}}</i><b>${undefined}</b>
    `;
  }
}

customElements.define('x-element', GenericElement);
