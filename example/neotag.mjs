import {innerHTML, html} from '../dist/engraft.mjs';

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