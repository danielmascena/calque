# barbell.js 🏋️

🚧 Status: In Development 🛠️

***

BarbellJS is a simple and tiny utility library for building fast web interfaces using regular JavaScript, offering a _"piece of equipment"_ as abstraction for some DOM manipulations.  It's similar to writing bits of HTML, but inside of a JavaScript file. Build components with events binding at the own template, avoiding the DOM manipulation step, like `document.createElement("tag")`, `element.addEventListener('event', callback)` and `element.style.property = "value";` for example.

🔧 This micro-library was meant to be a JSX-like but as a tool for UI prototyping with ordinary JS, avoiding the first battleground with evil stacks and bad configurations in some projects. Just use what is familiar, the loyal and trusted _Olympic weightlifting_ of Web Development, the eternal Web Standards: vanilla JavaScript, Web APIs, HTML5, CSS3 and the awesome Web Components v1 together.

The [HTML templating implementation](http://exploringjs.com/es6/ch_template-literals.html#sec_html-tag-function-implementation) provided by Dr. Axel Rauschmayer at his book was used as starting point.

### Nothing new or needed to learned

The motivation for spathaJS was to provide a light way to use HTML elements inside JavaScript, no weird language extensions, crazy binds, black magic or Jedi tricks here. Grammar in SpathaJS is mostly the same as in HTML, but there are subtle differences to watch out for. The differences from traditional HTML are listed below:

1. Adding Event Listeners smoothly: use function reference `onevent="myFunction"`, not function invocation `onevent="myFunction()"`. Note that in HTML, event listener names are written in all lowercase, such as onclick or onmouseover. In some libraries, however, like JSX or lit-html, event listener names are written in camelCase or with the prefix @, such as onClick or @click, respectively. The philosophy behind Barbell JS is to avoid at the most any divergence from common HTML syntax.
2. Passing inline CSS properties not only through strings, but by literal objects too: when using styling objects the [JSON](https://www.json.org/)-based format is mandatory, example: `style='{"border-radius": "7px", "color": "green"}'`. **OBS:** single properties names will work `{color: "blue"}` but are better to follow the standard rules.
3. Avoid use the **innerHTML** property directly (like `document.body.innerHTML` or `document.body["innerHTML"]`), instead, use the `innerHTML` reference (`document.body[innerHTML]`) and the  `html` tagged template function provided by the spathaJS library.

#### Code Example

```javascript

import { innerHTML, html } from './barbell.mjs';

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
        <slot name="user-text">Mr. Olympia!!!</slot>
      </p>
      <h1 onclick='${this.showNodeName}' style="${{"color": "red", "font-size": "5em"}}">
        Hello, ${this.getAttribute('name')}
      </h1>
    `;
  }
}

customElements.define('my-component', MyComponent);

const mc = new MyComponent;
mc.setAttribute('name', 'Arnold');
document.body.appendChild(mc);

var p = document.createElement('p');
p[innerHTML] = html`
  Lorem, ipsum dolor sit amet consectetur adipisicing elit. <span style="${{"color": "green"}}">
  Tincidunt</span> ornare massa eget egestas purus. Bibendum enim facilisis gravida neque convallis a. 
  Vitae suscipit tellus mauris a diam maecenas. Ultricies leo integer malesuada nunc vel risus commodo 
  viverra maecenas.
`;
document.body.appendChild(p);

```

---

⚠️ Warning: ☢️ not optimized for production ☣️
