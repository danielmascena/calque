# LabelJS

🚧 Status: In Development 🛠️

*** 98% Web Components
    2% label.js

label.js is a JavaScript micro-library aimed at help building web user interfaces. A simple and tiny utility library for creating UIs using regular JavaScript, as an extra part of the toolkit for everyday web development using the Web Platform. The power of this lone star at the client-side scripting, is similar to writing bits of HTML, but inside of a JavaScript file. Build components with a light abstraction for some DOM manipulations like events binding at the own template element, avoiding `document.createElement("tag")` and `element.addEventListener('event', callback)` for example.

Paraphrasing the [homologous](https://en.wikipedia.org/wiki/Label) _label.js is a piece of code affixed to a component, on which is written markup (printed information or symbols) about the element. Information printed directly on a component can also be considered labeling._

🔧 This micro-library was meant to be a JSX-like but as a tool for UI prototyping with ordinary JS, and plays very well with the Web Components v1, which one of the major benefit - its component pattern, therefore, the UIs are split into distinct pieces in the application. Breaking the interface into small chunks of code through Web Components bring all the benefits of then. Just use what is familiar, the loyal and trusted _brightest stars in the nighttime sky_ of Web Development, the eternal Web Standards: [Web APIs](https://developer.mozilla.org/en-US/docs/Web/API), HTML5, CSS3, standard JavaScript (aka vanilla JS) and the awesome Web Components all together. #usetheplatform

The [HTML templating implementation](http://exploringjs.com/es6/ch_template-literals.html#sec_html-tag-function-implementation) provided by Dr. Axel Rauschmayer at his book was used as starting point.

### Nothing new or needed to learned

The motivation for label.js was to provide a light way to use HTML elements inside JavaScript, together with Web Components, allow the componentization of user interfaces--splitting them up into small chunks of related HTML and JavaScript. Grammar in label.js is mostly the same as in HTML, but there are subtle differences to watch out for. The differences from traditional HTML are listed below:

1. Adding Event Listeners smoothly: use function reference `onevent="myFunction"`, not function invocation `onevent="myFunction()"`. Note that in HTML, event listener names are written in all lowercase, such as onclick or onmouseover. In some libraries, however, like JSX or lit-html, event listener names are written in camelCase or with the prefix @, such as onClick or @click, respectively. The philosophy behind ShaulaJS is to avoid at the most any divergence from common HTML syntax.
2. Passing inline CSS properties not only through strings, but by literal objects too: when using styling objects the [JSON](https://www.json.org/)-based format is mandatory, example: `style='{"border-radius": "7px", "color": "green"}'`. **OBS:** single properties names will work `{color: "blue"}` but are better to follow the standard rules.
3. Avoid use the **innerHTML** property directly (like `document.body.innerHTML` or `document.body["innerHTML"]`), instead, use the `innerHTML` Symbol reference (`document.body[innerHTML]`) and the  `html` tagged template function provided by the label.js library.

#### Code Example

Uses [Serve](https://github.com/zeit/serve) as recommended Web Server, run `npm i serve`, then `serve`

```javascript

import { innerHTML, html } from './label.mjs';

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
      <p id="shaula" onblur='${(e)=>console.log(e.target.textContent)}' class='par' name="λ" contenteditable>
        <slot name="user-text">&#x3bb; Sco</slot>
      </p>
      <h1 onclick='${this.showNodeName}' style="${{"color": "red", "font-size": "5em"}}">
        Hello, &lambda; ${this.getAttribute('name')}
      </h1>
    `;
  }
}

customElements.define('my-component', MyComponent);

const mc = new MyComponent;
mc.setAttribute('name', 'Scorpii');
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
