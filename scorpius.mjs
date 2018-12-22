    
    import { innerHTML, html } from './shaula.mjs';
    
    export class ScorpiusElement extends HTMLElement {
          static get observedAttributes() { return ['name']; }
          constructor(...args) {
            super(...args);
            this.stars = ['Antares', 'Lesath', 'Graffias'];
          }
          attributeChangedCallback() { this.render(); }
          connectedCallback() { this.render(); }
          render() {
            this[innerHTML] = html`
              <p id onblur='${(e)=>console.log(e.target.textContent)}' class='par' contenteditable>&#955; ♏ (see browser console for see the changes)</p>
              <h1 onclick='${function(){alert('ok')}}' style="${{"color": "red", "font-size": "5em"}}">Hello, &lambda; ${this.getAttribute('name')}</h1>
              <ul>
              ${this.stars.map(name => html`<li onclick='${ev=>alert(name)}'>${name}</li>`)}
              </ul>
            `;
          }
        }
        customElements.define('sco-const', ScorpiusElement);