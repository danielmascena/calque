[![calque.png](https://i.postimg.cc/BbrSv6qm/calque.png)](https://postimg.cc/K35Sqm3T)


# CalqueJS 📑
*No dependencies, frameworks, or transpilation needed* \o/ [#usetheplatform](https://webplatform.github.io/) 

![downloads-badge](https://flat.badgen.net/npm/dt/calque)
![version-badge](https://flat.badgen.net/npm/v/calque)
![license-badge](https://flat.badgen.net/npm/license/calque)


Calque is a tiny helper library (_only ~7KB_) for the native web platform, aimed to help to build interfaces easily. The goal is to offer a declarative way to code UI components by writing bits of [HTML](https://html.spec.whatwg.org/multipage/), rather the traditional client-side scripting, and also providing a simple layer as Virtual DOM to update the view 🖼️ changes.

It is all based on Web Standards, 💪powered by [JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript) language, [DOM](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model) & [browser](https://developer.mozilla.org/en-US/docs/Web/API/Window) APIs. The library calques, or transcript, the HTML-like template inner data into respective properties on the target [ELEMENT_NODE](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement) type object. This approach aims to aid coding [Web Components](https://www.webcomponents.org/) 🖤💙💛, especially as an add-on for **Custom Elements** (which are awesome). They play a key role at [micro frontends](https://micro-frontends.org) and make possible to reuse code on web platform.

> Just for curiosity, 🤔 _In linguistics, a [calque](https://en.wikipedia.org/wiki/Calque) /kælk/ or loan-translation is a borrowing of a compound word from another language where each component is translated into native words and then joined together_. 

This definition sums up the idea behind Calque, it intends to maximize the readability using the web markup _lingua franca_, at the same time, it enhances the component by bootstrapping his content and avoids some mandatory JS-DOM boilerplate codes.



## Install via:

[NPM](https://npmjs.com) (Terminal)
```sh
$ npm install --save calque
```


## Build components with a light abstraction

### Custom Elements v1 using ES6


```javascript
import { innerHTML, html } from '../dist/calque.mjs';

window.customElements.define('my-component', class extends HTMLElement {
  static get observedAttributes() { return ['name', 'data-list'];}
  constructor(...args) {
    super(...args);
    this.showNodeName = this.showNodeName.bind(this);
  }
  attributeChangedCallback() { this.render(); }
  connectedCallback() { this.render(); }
  showNodeName() {
    alert(this.nodeName);
    this.setAttribute('name', 'Neo name');
  }
  render() {
    const colorProp = 'color';
    const name = this.getAttribute('name');
    this[innerHTML] = html`
      <p onblur="${(e)=>console.log(e.target.textContent)}" 
        contenteditable>
        Temporary text
      </p>
      <h3 onclick="${this.showNodeName}" 
        style="${{[colorProp]: "red","font-size": name.length+"em"}}">
        Hello, &lambda; ${name}
      </h3>
      <aside>
        <ul>${this.hasAttribute('data-list') 
          && this.getAttribute('data-list').split(',').map(num => html`<li>${num}</li>`)}</ul>
        <button onclick="${(function removeItem() {
            if (this.hasAttribute('data-list')) {
              let list = this.getAttribute('data-list');
              let lastIndex = list.lastIndexOf(',');
              this.setAttribute('data-list', list.slice(0, lastIndex));
            } else {
              console.warn('No data-list attribute found');
            }
          }).bind(this)}">-</button>
      </aside>
    `;
  }
});
```


### Or for Web Component using ES5

```js
import {innerHTML, html} from '../calque.mjs';

function NeoTag() {
	console.log(this.constructor);
	this.count = 0;
	return Reflect.construct(HTMLElement, [], this.constructor);
}
NeoTag.prototype = Object.create(HTMLElement.prototype);
NeoTag.prototype.constructor = NeoTag;
Object.setPrototypeOf(NeoTag, HTMLElement);
NeoTag.prototype.handlerClick = function click(){console.log('clicked', this);};
NeoTag.prototype.connectedCallback = function() {
	this[innerHTML] = html`<p onclick="${this.handlerClick.bind(this)}">Neo Tag</p>`;
};
customElements.define('neo-tag', NeoTag);
document.body.appendChild(document.createElement('neo-tag'));
```

### A delightful VDOM-like approach

Calque updates the DOM nodes after the changes on component attributes to reflect the new values.

![ogImage](https://i.postimg.cc/vBHVjpv6/calquejs-video.gif)

[Live Demo](https://next.plnkr.co/edit/XTq7fqxyQawTeQuwdsZi?preview)


⚠️ **Warning**: The component built using Calque it's intended to be concise and reflect the template content, with that said, the component DOM tree shouldn't be modified via DOM API (removing or adding new nodes).


## Features

🔧The motivation for this library comes basically inspired for what [JSX](https://reactjs.org/docs/introducing-jsx.html) represents for [React](https://reactjs.org/), I must say that it's very boring to use React without JSX, because it simplifies the coding of a React component using a common HTML grammar.

With the advent of Web Components, it's now possible to achieve some features provide by frameworks and libraries, but using the timeless advantage of the native web. The component pattern is one of the major benefits of reusable Web Components, which enables to break the UI into distinct and small chunks of code providing a modular and reusable component to be used in many different contexts.


### Simplify web interface implementation.

Nothing new or needed to learn, the mantra is 🙏 - _no 3rd party library API to interact, just some conveniences_. **Using Calque is as easy as using template tags**. This feature was added at ES6 as he Templates literals, which are simply functions that allow creating domain-specific languages (DSLs). For more details about The [HTML templating](http://exploringjs.com/es6/ch_template-literals.html#sec_html-tag-function-implementation), access the book _ExploringJS_ by Dr. Axel Rauschmayer.


### Some subtle differences and gotchas

When using the library, pay attention to this details mentioned below:

1. Adding Event Listeners smoothly: use function reference `onevent="myFunction"`, not function invocation `onevent="myFunction()"`. Note that in HTML, event listener names are written only in lowercase, such as onclick, onmouseover, etc. In some libraries, however, like JSX or lit-html, event listener names are written in camelCase or with the prefix @, such as onClick or @click, respectively. The philosophy behind Calque is to avoid at the most any divergence from common HTML syntax.
2. Passing inline CSS properties not only through strings but by literal objects too: when using styling objects, the [JSON](https://www.json.org/)-based format is mandatory. for example, you can pass a JSON object for the style attribute as`{[myProp]: "7px", "border-color": myValue}`. **OBS:** single properties names will work `{color: "blue"}` but are better to follow the standard rules.
3. Avoid use the **innerHTML** property directly. In JavaScript, you can use a variable value to access the respective property name (`var f='foo',o={foo:'bar'}; o[f] // outputs "bar"`), so instead of use `document.body.innerHTML` or `document.body["innerHTML"]`, you **must** import and use the `innerHTML` variable from CalqueJS, and them call `document.body[innerHTML]` together with the  `html` tagged template function provided (_html_ method is primarily a convenience function, and it can be especially useful when manipulating callback events).
4. Follow the [best practices](https://google.github.io/styleguide/htmlcssguide.html#HTML_Quotation_Marks), we use double quotes for attributes values.


#### Code Example

Use [Serve](https://github.com/zeit/serve) as recommended Web Server, run:

```sh
$ npm i serve
```

### Roadmap 🎯
There are quite a few things to be done:
- Attributes (not observed) updating
- Apply some code refactors (more functional programming style)
- Investigating Shadow DOM support

---

## License

Code licensed under the [MIT License](LICENSE).


🚧 Status: In Development 🛠️

☑️ Suitable for web UI prototyping 👌

☢️ **use at your own risk** ☣️

🏁 If you considering to use Calque, feel free to share your feedback, thanks a lot 😁

### Some cool resources


https://github.com/w3c/webcomponents/

https://developers.google.com/web/fundamentals/web-components/customelements

https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements

https://blog.usejournal.com/web-components-will-replace-your-frontend-framework-3b17a580831c

https://www.youtube.com/watch?v=dTW7eJsIHDg
