# calque.js 📑
/kalk/

🚧 Status: In Development 🛠️

First thing first, what is a [calque](https://en.wikipedia.org/wiki/Calque): _In linguistics, a calque /kælk/ or loan-translation is a borrowing of a compound word from another language where each component is translated into native words and then joined together._


With that said, the CalqueJS is a JavaScript micro-library aimed at help building user interfaces for the Web Platform. Thus, not intend to be more one to do that, but present itself as a simple and tiny helper utility library for creating HTML elements using regular JavaScript, especially, as an addon for Web Components 🚾. The power of CalqueJS is to offer a declarative way to writing client-side scripting using bits of HTML, but inside of a JavaScript file. Build components with a light abstraction for some DOM manipulations like events binding at the own template element.

## Install via [npm](https://npmjs.com)

```sh
$ npm install --save calque
```

## Features

🔧 This micro-library was meant to be a JSX-like but as a tool for UI prototyping with ordinary JS, and plays very well with the Web Components v1, which one of the major benefit - its component pattern, therefore, the UIs are split into distinct pieces in the application. Breaking the interface into small chunks of code through Web Components bring all the benefits of then. Just use what is familiar, the loyal, trusted and eternal Web Standards: [Web APIs](https://developer.mozilla.org/en-US/docs/Web/API), HTML5, CSS3, standard JavaScript (aka vanilla JS) and the awesome Web Components all together. #usetheplatform

For more details about The [HTML templating](http://exploringjs.com/es6/ch_template-literals.html#sec_html-tag-function-implementation), access the book _ExploringJS_, author: Dr. Axel Rauschmayer.

### Nothing new or needed to learned, just some conveniences

Template tags are simply functions, which allows to create domain-specific languages (DSLs), an important feature of the Template literals added at the ECMAscript 6 version.

The motivation for CalqueJS was to provide a light way to use HTML elements inside JavaScript, together with Web Components, allow the componentization of user interfaces--splitting them up into small chunks of related HTML and JavaScript. Grammar in CalqueJS is mostly the same as in HTML, but there are subtle differences to watch out for. The differences from traditional HTML are listed below:

1. Adding Event Listeners smoothly: use function reference `onevent="myFunction"`, not function invocation `onevent="myFunction()"`. Note that in HTML, event listener names are written in all lowercase, such as onclick or onmouseover. In some libraries, however, like JSX or lit-html, event listener names are written in camelCase or with the prefix @, such as onClick or @click, respectively. The philosophy behind CalqueJS is to avoid at the most any divergence from common HTML syntax.
2. Passing inline CSS properties not only through strings, but by literal objects too: when using styling objects the [JSON](https://www.json.org/)-based format is mandatory, example: `style='{"border-radius": "7px", "color": "green"}'`. **OBS:** single properties names will work `{color: "blue"}` but are better to follow the standard rules.
3. Avoid use the **innerHTML** property directly (like `document.body.innerHTML` or `document.body["innerHTML"]`), instead, use the `innerHTML` Symbol reference (`document.body[innerHTML]`) and the  `html` tagged template function provided by the CalqueJS library.
4. Follow the [best practices](https://google.github.io/styleguide/htmlcssguide.html#HTML_Quotation_Marks), we use double quotes for attributes values.

_html_ method is primarily a convenience function, and it can be especially useful when manipulating callback events.

#### Code Example

Uses [Serve](https://github.com/zeit/serve) as recommended Web Server, run:

```sh
$ npm i serve
```

### For Web Components

```javascript

import { innerHTML, html } from './calque.mjs';

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

```

## And plain JavaScript DOM app

```js
const mc = new MyComponent;
mc.setAttribute('name', 'Scorpii');
document.body.appendChild(mc);

var p = document.createElement('p');
p[innerHTML] = html`
  Lorem, ipsum dolor sit amet consectetur adipisicing elit. <span style="${{"color": "green"}}">
  Tincidunt</span> ornare massa eget egestas purus. Bibendum enim facilisis gravida neque convallis a. Vitae suscipit tellus mauris a diam maecenas. Ultricies leo integer malesuada nunc vel risus commodo viverra maecenas.
`;
document.body.appendChild(p);

```

---

⚠️ Warning: ☢️ not optimized for production ☣️

https://www.w3.org/TR/custom-elements/

https://www.w3.org/wiki/WebComponents/

https://github.com/w3c/webcomponents/
