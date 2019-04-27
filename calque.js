/* eslint-disable no-console */
/**
 * Calque
 * @author: Daniel Mascena <danielmascena@gmail.com>
 * repo: https://github.com/danielmascena/calque
 */

/*jshint esversion: 6 */

'use strict';

export const innerHTML = Symbol('innerHTML');
const _calque = '📑';
const Calque = {
	innerHTML,
	html,
};
const isEmptyObject = (obj) => Object.entries(obj).length === 0 && obj.constructor === Object;

function htmlEscape(str) {
	return str
		.replace(/&/g, '&amp;')
		.replace(/>/g, '&gt;')
		.replace(/</g, '&lt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&#39;')
		.replace(/`/g, '&#96;');
}

function hashCode(wUppercase) {
	let text = '',
		possible = (`abcdefghijklmnopqrstuvwxyz${wUppercase ?
			'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
			: ''}0123456789`);
	for (let i = 0; i < 15; i++)
		text += possible.charAt(Math.floor(Math.random() * possible.length));
	return text;
}

function HTMLtoJSON(template, Element) {
	let htmlMarkup;
	if (typeof template === 'string') {
		let docNode;
		if (window.DOMParser) {
			const parser = new DOMParser();
			docNode = parser.parseFromString(template, 'text/html');
		}
		if (Element != null && Element instanceof HTMLElement) {
			const {tagName, attributes} = Element,
				body = docNode.body,
				firstChild = body.firstChild,
				textContent = body.textContent,
				children = docNode.body.children;
			htmlMarkup = {
				tagName, 
				attributes, 
				textContent,
				firstChild: (firstChild.nodeType === 3 ? firstChild : document.createTextNode('')), 
				children
			};
		}
	} else if (typeof template === 'object') {
		htmlMarkup = template;
	}
	const toJSON = e => ({
		tagName: 
      e.tagName,
		textValue:
			(e.firstChild && e.firstChild.nodeValue),
		textContent: 
			e.textContent,
		attributes:
      Array.from(e.attributes, ({name, value}) => ({[name]: value})),
		children:
      Array.from(e.children, toJSON)
	});
	return htmlMarkup && toJSON(htmlMarkup);
}

export function html(literals, ...substs) {
	const raw = literals.raw;
  
	let result = '',
		elemEvents = [],
		strMatch,
		recoverContent = obj => {
			if (typeof obj === 'object') {
				if (obj === null || Object.getOwnPropertyNames(obj).length === 0) return;

				else if ('_calque' in obj) {
					obj.elemEvents.length && (elemEvents = [
						...elemEvents,
						...obj.elemEvents
					]);
					return obj.result;
				}
				return (Object.prototype.toString === obj.toString ?
					Object.keys(obj).reduce((acc, key) => acc + `${key}: ${obj[key]},
          `, '[Object toString] ') : obj);
			}
		};
	substs.forEach((subst, i) => {
      
		let lit = raw[i];
		const type = typeof subst;
		if (subst == null || 
          (type === 'object' && 
          Object.getOwnPropertyNames(subst).length === 0)) {
			subst = '';
		} else {
			if (Array.isArray(subst)) {
				let tmp = '';
				subst.forEach(obj => tmp += recoverContent(obj));
				subst = tmp || subst.join('');
			} else if (type === 'object') {
				/* HTML5 specification says:
          Then, the start tag may have a number of attributes, [...]. 
          Attributes must be separated from each other by one or more space characters.
        */
				subst = lit.slice(-8).match(/\s+style=["']/) ?
					Object.entries(subst).map((v) => v.join(':')).join(';')
					: recoverContent(subst);
			} else if (type === 'function' &&
            (strMatch = lit.slice(-15).match(/\son.*=["']$/))) {
				const quote = lit.charAt(lit.length-1);
				const charNumber = quote.charCodeAt();
				const eventType = strMatch[0].slice(3, -2);
				const calqueID = '_calque-id-' + hashCode();
				const calqueIDValue = hashCode(true);
				let handlerBody = String(subst);
				if (subst.name.startsWith('bound ') && handlerBody.startsWith(type) && handlerBody.includes('native code')) {
					// eslint-disable-next-line quotes
					const toggleQuote = charNumber === 34 ? `'` : `"`;   
					handlerBody = `${toggleQuote}${type} ${subst.name.substring(5)} ${handlerBody.substring(9)}${toggleQuote}`;
				}
				elemEvents.push({calqueID, calqueIDValue, eventHandler: subst, eventType, handlerBody});
				subst = `${handlerBody}${quote} ${calqueID}=${quote}${calqueIDValue}`;
			}
		} 
		if (lit.endsWith('!')) {
			subst = htmlEscape(subst);
			lit = lit.slice(0, -1);
		}
		result += lit;
		result += subst;
	}
	);
	result += raw[raw.length - 1];

	return {result, elemEvents, _calque};
}

(function calque() {
	_calque in window || (window[_calque] = !function() {
		Object.defineProperty(HTMLElement.prototype, innerHTML, {
			get() {
				return this.innerHTML;
			},
			set(arr) {
				this.vdom || Object.defineProperty(this, 'vdom', {
					value: {},
					writable: true
				});
				let {result, elemEvents} = arr;
				console.info('Element is in the DOM?: ' + this.isConnected);

				if (this.isConnected && !isEmptyObject(this.vdom) && document.contains(this)) {
					let nextMarkup = HTMLtoJSON(result, this);
					let previousMarkup = this.vdom;
					
					const searchDiffs = (previousVDOM, nextVDOM) => {
						
						const findDiff = (elemPrev, elemNext, index) => {
							const isEmptyPrev = Object.is(typeof elemPrev, 'undefined'),
								isEmptyNext = Object.is(typeof elemNext, 'undefined');
							const elemPrevCopy = Object.assign({}, elemPrev),
								elemNextCopy = Object.assign({}, elemNext);
							let diff = {
								newContent: '',
								oldContent: '',
								children: [],
								index
							};
							if (isEmptyPrev && isEmptyNext) {
								console.log('nothing to change');
								return;
							} else if (elemPrevCopy.textContent !== elemNextCopy.textContent) {
								diff.tagName = elemNextCopy.tagName;
								const contentPrev = elemPrevCopy.textValue;
								const contentNext = elemNextCopy.textValue;
								if (contentPrev && !contentNext) {
									// remove
									diff.oldContent = contentPrev;
									diff.newContent = contentNext;
									diff.index = index;
								} else if (isEmptyPrev && !isEmptyNext) {
									// add
									diff.oldContent = '';
									diff.newContent = contentNext;
									diff.tagName = elemNextCopy.tagName;
									diff.index = index + 1;
								} else {
									// compare
									if (contentPrev !== contentNext) {
										diff.newContent = contentNext;
										diff.oldContent = contentPrev;
										diff.tagName = elemNextCopy.tagName;
									} else {
										diff.textContent = elemNextCopy.textContent;
									}
								}
								const chPr = elemPrevCopy.children || [];
								const chNx = elemNextCopy.children || [];
								const length = Math.max(chPr.length, chNx.length);
								if (length > 0) {
									for (let i = 0; i < length; i++) {
										const returnedDiff = findDiff(chPr[i], chNx[i], i);
										if ((returnedDiff.newContent || returnedDiff.oldContent) 
												|| (elemPrevCopy.textContent !== elemNextCopy.textContent 
												&& returnedDiff.children.length > 0)) {
											diff.children.push(returnedDiff);
										}
									}
								}
								/*
								const previousKeys = Object.keys(elemPrev.attributes);
								const nextKeys = Object.keys(elemNext.attributes);
								const joinKeys = new Set([...previousKeys, ...nextKeys]);
								for (let key of joinKeys) {
									if (previousKeys.includes(key)) {
										Object.is(elemPrev.attributes[key], elemNext.attributes[key]) 
										|| (diff.attributes[key] = elemNext.attributes[key]);
									} else {
										diff.attributes[key] = elemNext.attributes[key];
									}
								}
								Element.attributes 
								*/
							}
							return diff;
						};
						const diffs = findDiff(previousVDOM, nextVDOM, -1);
									
						const applyDiffs = (diffElem, htmlElem) => {
							
							let isEmptyDiff = Object.is(typeof diffElem, 'undefined'),
								isEmptyHtmlEl = Object.is(typeof htmlElem, 'undefined');
							
							if (isEmptyDiff && isEmptyHtmlEl) {
								console.log('no diffs to apply');
								return;
							} else {
								const diffChildren = diffElem.children,
									htmlLen = htmlElem.children.length;
								if (diffChildren.length > 0 && (diffElem.textContent !== htmlElem.textContent)) {
									for (let i = (diffChildren.length - 1); i >= 0; i--) {
										const elDf = diffChildren[i];
										const elHT = (elDf.index < htmlLen) ? htmlElem.children[elDf.index] : htmlElem;
										applyDiffs(elDf, elHT);
									}
								}
								if (diffElem.newContent !== htmlElem.firstChild.nodeValue) {

									if (diffElem.newContent) {
										if (diffElem.oldContent) {
											//parentNode.replaceChild(newChild, oldChild);
											htmlElem.firstChild.nodeValue = diffElem.newContent;
											console.log('content updating');
										} else {
											const newElem = document.createElement(diffElem.tagName);
											const textNode = document.createTextNode(diffElem.newContent);
											newElem.appendChild(textNode);
											htmlElem.appendChild(newElem);
										}
									}
									else if (diffElem.oldContent) {
										htmlElem.remove();
									}
								}
							}
						};
						applyDiffs(diffs, this);
					};
					//const nullify = () => {};
					searchDiffs(previousMarkup, nextMarkup);
					this.vdom = nextMarkup;
				} else {
					this.innerHTML = result;
					this.vdom = HTMLtoJSON(result, this);
					console.log(this.vdom);
					for (let event of elemEvents) {
						let {calqueID, calqueIDValue, eventHandler, eventType, handlerBody} = event;
						let elem = this.querySelector(`[${calqueID}="${calqueIDValue}"]`);

						if (elem != null && 
								typeof eventHandler === 'function') {
							if (!eventHandler.name && handlerBody.startsWith('function')) {
								// eslint-disable-next-line no-debugger
								debugger;
								console.error(handlerBody, 'function expression must have a name');
								throw new TypeError('function expression must have a name');
							}
							elem[eventType] && elem.addEventListener(eventType, eventHandler);
							elem.removeAttribute(calqueID);
						}
					}
				}
			},
			enumerable: true,
			configurable: true
		});
	}());
}());

export default Calque;
