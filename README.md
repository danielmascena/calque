# spatha.js 🗡

🚧 Status: In Development 🛠️
***
SpathaJS is a simple and tiny utility library for building fast web interfaces, offering a _scutum_ 🛡 as abstraction for some DOM manipulations, build components without the initial obligation to interact with DOM API, like `document.createElement`, `element.addEventListener('event', callback)` and `element.style.color = 'yellow'`for example.

🔧 This micro-library was meant to be a JSX-like but as a tool for UI prototyping, avoiding the first battleground with evil stacks and bad configurations in some projects. Just use what is familiar, the loyal and trusted _cohortes praetorianae_ of Web Development, the eternal Web Standards: vanilla JavaScript, Web APIs, HTML5, CSS3 and the awesome Web Components v1 together.

As starting point, was used the [HTML templating implementation](http://exploringjs.com/es6/ch_template-literals.html#sec_html-tag-function-implementation) provided by Dr. Axel Rauschmayer at his book.

### Nothing new or needed to learned
The motivation for spathaJS was to provide a light way to use HTML elements inside JavaScript, no weird language extensions, crazy binds, black magic or Jedi tricks here. The only extra features inside and differences from traditional HTML are:

1. Adding Event Listeners easily: use function reference `onevent="myFunction"`, not function invocation `onevent="myFunction()"`.
2. Passing style through literal objects: use [JSON](https://www.json.org/)-based format `{"border-radius": "7px", "color": "green"}`. **OBS:** single properties names will work `{color: "blue"}` but are better to follow the standard rules.
3. Avoid use the **innerHTML** property directly (like `document.body.innerHTML` or `document.body["innerHTML"]`), instead, use the `innerHTML` reference (`document.body[innerHTML]`) and the  `html` tagged template function provided by the spathaJS library.

#### Code Example

```javascript
import { innerHTML, html } from './spatha.mjs';

class MyComponent extends HTMLElement {
  static get observedAttributes() { return ['name']; }
  constructor(...args) {
    super(...args);
  }
  attributeChangedCallback() { this.render(); }
  connectedCallback() { this.render(); }
  showNodeName() {
    alert(this.nodeName);
  }
  render() {
    this[innerHTML] = html`
    <p id onblur='${(e)=>console.log(e.target.textContent)}' class='par' contenteditable>
      <slot name="user-text">ad victoriam!!!!</slot>
    </p>
    <h1 onclick='${this.showNodeName}' style="${{"color": "red", "font-size": "5em"}}">Hello, ${this.getAttribute('name')}</h1>
    `;
  }
}

customElements.define('my-component', MyComponent);

const mc = new MyComponent;
mc.setAttribute('name', 'Maximus');
document.body.appendChild(mc);

var p = document.createElement('p');
p[innerHTML] = html`Lorem, ipsum dolor sit amet consectetur adipisicing elit. <span style="${{"color": "green"}}">Doloremque</span> odit corporis dolor, sapiente exercitationem, numquam expedita ipsam omnis earum dolores, a laboriosam suscipit quo non voluptatibus accusamus porro. Sequi, exercitationem.`;
document.body.appendChild(p);

```

---

⚠️ Warning: ☢️ not optimized for production ☣️
