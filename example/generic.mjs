
import { innerHTML, html } from '../dist/engraft.mjs';

export default class GenericElement extends HTMLElement {
  static get observedAttributes() {
    return ['name', 'data-list'];
  }
  constructor(...args) {
    super(...args);
    this.num = 7;
    this.text = 'changed';
    this.stars = ['Antares', 'Lesath', 'Graffias', 'Dschubba'];
  }
  attributeChangedCallback() {
    this.render();
  }
  connectedCallback() {
    this.render();
  }
  clickHandler(){
    this.setAttribute('name', 'Lacuna');
    alert(this.num++);
  }
  changeHandler(){
    console.log(this.text);
  }
  render() {
    console.log(this.getAttribute('name'), this.getAttribute('data-list'));
    let someObj = null, 
      size = 12, 
      style = {'color': 'red', 'line-height': this.num, 'font-size': `${size*3}px`};

    console.log('list', this.getAttribute('data-list'));
    this[innerHTML] = html`
        <div id onblur="${ e => console.log(e.target.textContent) }" style="${ {"background-color": "lightblue"} }"
          onclick="${this.clickHandler.bind(this)}" contenteditable>
          &#955; ♏ (see browser console for see the changes)
          <ol>
            ${this.hasAttribute('data-list') 
              && this.getAttribute('data-list').split(',').map(num => html`<li>${num}</li>`)}
          </ol>
          <button onclick="${ (function addItem(e) {
              let previousVal = +e.target.previousElementSibling.lastElementChild.textContent;
              let oldVal = this.getAttribute('data-list');
              this.setAttribute('data-list', oldVal+','+(++previousVal));
              console.log(previousVal, oldVal);
            }).bind(this)
          }">+</button>
        </div>
        <h1 onclick="${ (function mustHaveAName() {alert('I\'m '+this);}).bind(this) }" style="${style}">
          Hello, &lambda; ${this.getAttribute('name')}
        </h1>
        <ul>
          ${this.stars.map((name, i) => html`<li style="font-size: ${size*i}px" onclick="alert('${name}')">${name}</li>`)}
        </ul>
        ${ (this.stars.length > 5)
            ? html`<p>The constellation is complete</p>`
            : html`<p>There is some missing stars</p>`}
        <p onclick="${() => alert(this.num)}">
          ${ new function(lib){this.libName = lib;}('EngraftJS') }
          ${ {toString: () => 'method override'} }
        </p>
        <input onfocus="${() => this.changeHandler.call(this)}" />
        <span>${someObj}</span><i>${{}}</i><b>${undefined}</b><em>${[]}</em>
    `;
  }
}

customElements.define('x-element', GenericElement);
