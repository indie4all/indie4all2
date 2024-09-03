/*! For license information please see 6484.js.LICENSE.txt */
(self.webpackChunkCDN=self.webpackChunkCDN||[]).push([[6484],{36484:function(e,t,s){e.exports=function(e,t,s,i){"use strict";const n="alert",r=".bs.alert",o=`close${r}`,c=`closed${r}`,l="fade",a="show";class Alert extends e{static get NAME(){return n}close(){if(t.trigger(this._element,o).defaultPrevented)return;this._element.classList.remove(a);const e=this._element.classList.contains(l);this._queueCallback((()=>this._destroyElement()),this._element,e)}_destroyElement(){this._element.remove(),t.trigger(this._element,c),this.dispose()}static jQueryInterface(e){return this.each((function(){const t=Alert.getOrCreateInstance(this);if("string"==typeof e){if(void 0===t[e]||e.startsWith("_")||"constructor"===e)throw new TypeError(`No method named "${e}"`);t[e](this)}}))}}return s.enableDismissTrigger(Alert,"close"),i.defineJQueryPlugin(Alert),Alert}(s(59011),s(77956),s(8248),s(44035))},8248:function(e,t,s){!function(e,t,s,i){"use strict";const enableDismissTrigger=(e,n="hide")=>{const r=`click.dismiss${e.EVENT_KEY}`,o=e.NAME;t.on(document,r,`[data-bs-dismiss="${o}"]`,(function(t){if(["A","AREA"].includes(this.tagName)&&t.preventDefault(),i.isDisabled(this))return;const r=s.getElementFromSelector(this)||this.closest(`.${o}`);e.getOrCreateInstance(r)[n]()}))};e.enableDismissTrigger=enableDismissTrigger,Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}(t,s(77956),s(85411),s(44035))}}]);