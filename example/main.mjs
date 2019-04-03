/*
    Example Code
*/

'use strict';

import Engraft, {html, innerHTML} from '../dist/engraft.mjs';
import GenericElement from './generic.mjs';

export default function() {

  const sco = new GenericElement;
  sco.setAttribute('name', 'Sco');
  //sco.setAttribute('data-list', '6,7,8');
  document.body.appendChild(sco);

  let p = document.createElement('p'), color = 'green';
  p[Engraft.innerHTML] = Engraft.html `
      Lorem, ipsum dolor sit amet consectetur adipisicing elit.
      <span style="color: ${color}">
      Tincidunt</span> ornare massa eget egestas purus. Bibendum enim facilisis gravida
      neque convallis a. Vitae suscipit tellus mauris a diam maecenas. Ultricies leo
      integer malesuada nunc vel risus commodo viverra maecenas.
  `;
  document.body.appendChild(p);

  var fragment = document.createDocumentFragment();
  var div = document.createElement('div');
  div[innerHTML] = html`
      <h3>More info 
      <a href="https://developer.mozilla.org/en-US/docs/Web/API/Document/createDocumentFragment" target="_blank">here</a></h3>
  `;
  fragment.appendChild(div);
  document.body.appendChild(fragment);

}
