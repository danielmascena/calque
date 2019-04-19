![ogImage](calque-sm.png)



# calque.js 📑
/kalk/

🚧 Status: In Development 🛠️

![downloads-badge](https://flat.badgen.net/npm/dt/calque)
![version-badge](https://flat.badgen.net/npm/v/calque)
![license-badge](https://flat.badgen.net/npm/license/calque)


CalqueJS is a JavaScript utility library aimed at help building user interfaces for the Web Platform. The goal 🎯 is to offer a declarative way to writing client-side scripting using bits of HTML for creating elements using regular JavaScript and DOM API. This approach suits perfectly as an addon for reusable [Web Components] 🚾(https://www.webcomponents.org/). #usetheplatform

Just for curiosity, 🤔 _In linguistics, a [calque](https://en.wikipedia.org/wiki/Calque) /kælk/ or loan-translation is a borrowing of a compound word from another language where each component is translated into native words and then joined together._ This definition express the approach behind CalqueJS, which use a well-know declarative/markup language as HTML to provide high readability about the component itself. So, your HTML-based template is converted as component content with the correct binds, avoiding some boilerplate code to build a web document, as the follow example:

### DOM programming way
```javascript
class FancyButton extends HTMLElement {
  constructor() {
    super(); // always call super() first in the constructor.
    this.addEventListener('click', e => this.drawRipple(e.offsetX, e.offsetY));
  }
  connectedCallback() {
		this.render();
	}
  drawRipple(x, y) {
    let div = document.createElement('div');
    div.classList.add('ripple');
    this.appendChild(div);
    div.style.top = `${y - div.clientHeight/2}px`;
    div.style.left = `${x - div.clientWidth/2}px`;
    div.style.backgroundColor = 'currentColor';
    div.classList.add('run');
    div.addEventListener('transitionend', e => div.remove());
  }
}
customElements.define('fancy-button', FancyButton, {extends: 'button'});
```
###Build components with a light abstraction

```javascript
import { innerHTML, html } from './calque.mjs';
class FancyButtonWCalque extends HTMLButtonElement {
  constructor() {
    super(); // always call super() first in the constructor.
    this.addEventListener('click', e => this.drawRipple(e.offsetX, e.offsetY));
  }

  drawRipple(x, y) {
    let div = document.createElement('div');
    div.classList.add('ripple');
    this.appendChild(div);
    div.style.top = `${y - div.clientHeight/2}px`;
    div.style.left = `${x - div.clientWidth/2}px`;
    div.style.backgroundColor = 'currentColor';
    div.classList.add('run');
    div.addEventListener('transitionend', e => div.remove());
  }
}
customElements.define('fancy-button', FancyButtonWCalque, {extends: 'button'});
```

## Install via [npm](https://npmjs.com)

```sh
$ npm install --save calque
```


## Features

🔧This CalqueJS was meant to be a JSX-like alternative to simplify buid the UI at general with just ordinary JS, and plays perfectly with Web Components v1. The component pattern is one of the major benefit of WC which breaks the UI into distinct and small chunks of code representing the web application.


### Simplificate web interface implementation.

Nothing new or needed to learned, the mantra is 🙏: no 3rd party library APIs to interact, just some conveniences. Using CalqueJS is as easy as use template tags. This feature was added at ES6 as he Template literals, which are simply functions that allows to create domain-specific languages (DSLs). For more details about The [HTML templating](http://exploringjs.com/es6/ch_template-literals.html#sec_html-tag-function-implementation), access the book _ExploringJS_ by Dr. Axel Rauschmayer.

The motivation for CalqueJS was to provide a micro helper library to use with HTML elements. The grammar in CalqueJS is mostly the same as in HTML, but there are few subtle differences to watch out for. The differences from traditional HTML are listed below:

1. Adding Event Listeners smoothly: use function reference `onevent="myFunction"`, not function invocation `onevent="myFunction()"`. Note that in HTML, event listener names are written in all lowercase, such as onclick or onmouseover. In some libraries, however, like JSX or lit-html, event listener names are written in camelCase or with the prefix @, such as onClick or @click, respectively. The philosophy behind CalqueJS is to avoid at the most any divergence from common HTML syntax.
2. Passing inline CSS properties not only through strings, but by literal objects too: when using styling objects the [JSON](https://www.json.org/)-based format is mandatory, example: `style='{"border-radius": "7px", "color": "green"}'`. **OBS:** single properties names will work `{color: "blue"}` but are better to follow the standard rules.
3. Avoid use the **innerHTML** property directly. In JavaScript, you can use a variable value to access the respective property name, as `var f='foo',o={foo:'bar'}; o[f] //bar`, so instead of use `document.body.innerHTML` or `document.body["innerHTML"]` references, you must use the `innerHTML` Symbol from CalqueJS, calling `document.body[innerHTML]` together with the  `html` tagged template function provided by the library (_html_ method is primarily a convenience function, and it can be especially useful when manipulating callback events).
4. Follow the [best practices](https://google.github.io/styleguide/htmlcssguide.html#HTML_Quotation_Marks), we use double quotes for attributes values.


### A delightful and light VDOM-like approach

![ogImage](calquejs_video.gif)


#### Code Example

Uses [Serve](https://github.com/zeit/serve) as recommended Web Server, run:

```sh
$ npm i serve
```

### Custom Elements v1 using ES6


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
    const colProp = 'color';
    this[innerHTML] = html`
      <p id="shaula" onblur='${(e)=>console.log(e.target.textContent)}' class='par' name="λ" contenteditable>
        <slot name="user-text">&#x3bb; Sco</slot>
      </p>
      <h1 onclick='${this.showNodeName.bind(this)}' style="${{[colProp]: "red", "font-size": this.name.length+"em"}}">
        Hello, &lambda; ${this.getAttribute('name')}
      </h1>
    `;
  }
}

customElements.define('my-component', MyComponent);

```


### Or for Web Component using ES5

```js
import {innerHTML, html} from '../dist/calque.mjs';

function NeoTag() {
	console.log(this.constructor);
	this.count = 0;
	return Reflect.construct(HTMLElement, [], this.constructor);
}
NeoTag.prototype = Object.create(HTMLElement.prototype);
NeoTag.prototype.constructor = NeoTag;
Object.setPrototypeOf(NeoTag, HTMLElement);
NeoTag.prototype.handlerClick = function click(){
	console.log('clicked', this);
};
NeoTag.prototype.connectedCallback = function() {
	this.handlerClick = this.handlerClick.bind(this);
	this[innerHTML] = html`
        <p onclick="${this.handlerClick}">Neo Tag</p>
    `;
};

customElements.define('neo-tag', NeoTag);
document.body.appendChild(document.createElement('neo-tag'));
```


## And plain JavaScript DOM

```js
import Calque from '../dist/calque.mjs';

const mc = new MyComponent;
mc.setAttribute('name', 'Scorpii');
document.body.appendChild(mc);

var p = document.createElement('p');
p[Calque.innerHTML] = Calque.html`
  Lorem, ipsum dolor sit amet consectetur adipisicing elit. <span style="${{"color": "green"}}">
  Tincidunt</span> ornare massa eget egestas purus. Bibendum enim facilisis gravida neque convallis a. Vitae suscipit tellus mauris a diam maecenas. Ultricies leo integer malesuada nunc vel risus commodo viverra maecenas.
`;
document.body.appendChild(p);

```


### Roadmap
There's quite a few things to be done:
- Attributes updating
- Apply some code refactors (more functional programming style)
- Investigating Shadow DOM support

---

⚠️ Warning: ☢️ not optimized for production ☣️


### Some cool resources


https://github.com/w3c/webcomponents/

https://www.w3.org/wiki/WebComponents/

https://w3c.github.io/webcomponents/

https://developers.google.com/web/fundamentals/web-components/customelements

https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements
