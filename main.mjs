/***********************************************************************************
    Example Code
    ************************************************************************************/

'use strict';

import {innerHTML, html} from './index.mjs';
import GenericElement from './generic.mjs';

export default function main() {

const sco = new GenericElement;
sco.setAttribute('name', 'Sco');
document.body.appendChild(sco);

let p = document.createElement('p');
p[innerHTML] = html `
        Lorem, ipsum dolor sit amet consectetur adipisicing elit. <span style="${ {
  "color" : "green"}}">
        Tincidunt</span> ornare massa eget egestas purus. Bibendum enim facilisis gravida neque convallis a.
        Vitae suscipit tellus mauris a diam maecenas. Ultricies leo integer malesuada nunc vel risus commodo
        viverra maecenas.
      `;
  document.body.appendChild(p);

}
