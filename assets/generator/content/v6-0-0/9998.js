(self.webpackChunkCDN=self.webpackChunkCDN||[]).push([[9998],{45935:(t,e,o)=>{var i=o(93633);function __default(t){return t&&(t.__esModule?t.default:t)}t.exports=(i.default||i).template({1:function(t,e,o,i,n){return"0"},3:function(t,e,o,i,n){return"-1"},compiler:[8,">= 4.3.0"],main:function(t,e,i,n,r){var s,c,l=null!=e?e:t.nullContext||{},a=t.hooks.helperMissing,d="function",h=t.escapeExpression,u=t.lookupProperty||function(t,e){if(Object.prototype.hasOwnProperty.call(t,e))return t[e]};return'<tr>\r\n  <td class="drop-placeholder drag-source" tabindex="-1">\r\n    <button id="drag-term-'+h(typeof(c=null!=(c=u(i,"id")||(null!=e?u(e,"id"):e))?c:a)===d?c.call(l,{name:"id",hash:{},data:r,loc:{start:{line:3,column:26},end:{line:3,column:32}}}):c)+"-"+h(typeof(c=null!=(c=u(i,"position")||(null!=e?u(e,"position"):e))?c:a)===d?c.call(l,{name:"position",hash:{},data:r,loc:{start:{line:3,column:33},end:{line:3,column:45}}}):c)+'" class="btn btn-primary drag-term w-100" type="button" \r\n      draggable="true" aria-grabbed="false"\r\n      tabindex="'+(null!=(s=__default(o(6088)).call(l,null!=e?u(e,"position"):e,0,{name:"ifeq",hash:{},fn:t.program(1,r,0),inverse:t.noop,data:r,loc:{start:{line:5,column:16},end:{line:5,column:46}}}))?s:"")+(null!=(s=__default(o(20884)).call(l,null!=e?u(e,"position"):e,0,{name:"ifneq",hash:{},fn:t.program(3,r,0),inverse:t.noop,data:r,loc:{start:{line:5,column:46},end:{line:5,column:79}}}))?s:"")+'">\r\n       '+h(typeof(c=null!=(c=u(i,"term")||(null!=e?u(e,"term"):e))?c:a)===d?c.call(l,{name:"term",hash:{},data:r,loc:{start:{line:6,column:7},end:{line:6,column:15}}}):c)+'\r\n    </button>\r\n  </td>\r\n  <td class="drop-placeholder drop-choice" tabindex="-1"></td>\r\n  <td tabindex="-1">'+h(typeof(c=null!=(c=u(i,"definition")||(null!=e?u(e,"definition"):e))?c:a)===d?c.call(l,{name:"definition",hash:{},data:r,loc:{start:{line:10,column:20},end:{line:10,column:34}}}):c)+"</td>\r\n</tr>"},useData:!0})},16492:(t,e,o)=>{"use strict";o.d(e,{x:()=>Widget});var i=o(7181),n=o(40561);function Widget(t){const e=i.Ay.get(n.default);return function(o){e.registerWidget(t.selector,o)}}},85631:(t,e,o)=>{"use strict";var i;o.d(e,{A:()=>DragDropElement}),function(t){t.ARROW_LEFT="ArrowLeft",t.ARROW_UP="ArrowUp",t.ARROW_RIGHT="ArrowRight",t.ARROW_DOWN="ArrowDown",t.END="End",t.ENTER="Enter",t.ESCAPE="Escape",t.HOME="Home",t.SPACE="Space"}(i||(i={}));var n=o(19412),__awaiter=function(t,e,o,i){return new(o||(o=Promise))((function(n,r){function fulfilled(t){try{step(i.next(t))}catch(t){r(t)}}function rejected(t){try{step(i.throw(t))}catch(t){r(t)}}function step(t){t.done?n(t.value):function adopt(t){return t instanceof o?t:new o((function(e){e(t)}))}(t.value).then(fulfilled,rejected)}step((i=i.apply(t,e||[])).next())}))};class DragDropElement extends n.A{constructor(t,e,o,i){super(i,e,t),this.i18n=t,this.utils=e,this.bootstrap=o,this.voiceControl=i,this.coordinates=[0,0]}dragItem(t){this.rows.forEach((t=>t.querySelectorAll("td").forEach(((t,e)=>{2!==e&&t.setAttribute("aria-dropeffect","move")})))),this.grabbed&&(this.grabbed.classList.remove("selected"),this.grabbed.closest("td").setAttribute("aria-selected","false"),this.grabbed.setAttribute("aria-grabbed","false")),this.grabbed=t,this.grabbed.classList.add("selected"),this.grabbed.setAttribute("aria-grabbed","true"),this.grabbed.closest("td").setAttribute("aria-selected","true"),t.closest(".drop-placeholder").setAttribute("tabindex","-1")}dropItem(t){this.grabbed&&(this.widget.querySelectorAll("td").forEach((t=>t.setAttribute("aria-selected","false"))),this.grabbed.querySelectorAll("svg").forEach((t=>t.remove())),""===t.innerHTML.trim()&&(t.setAttribute("tabindex",""),t.append(this.grabbed)),this.grabbed.classList.remove("selected"),this.grabbed.setAttribute("aria-grabbed","false"),this.grabbed.setAttribute("tabindex","0"),this.grabbed.focus(),this.grabbed=null,this.rows.forEach((t=>t.querySelectorAll("td").forEach(((t,e)=>t.setAttribute("aria-dropeffect",""))))))}onKeyDown(t){if(t.code===i.ARROW_LEFT||t.code===i.ARROW_UP||t.code===i.ARROW_RIGHT||t.code===i.ARROW_DOWN||t.code===i.HOME||t.code===i.END||t.code===i.SPACE||t.code===i.ENTER||t.code===i.ESCAPE)if(t.preventDefault(),t.code===i.SPACE||t.code===i.ENTER){const t=this.rows[this.coordinates[0]].querySelectorAll("td")[this.coordinates[1]];if(""===t.innerHTML.trim())this.dropItem(t);else{const e=t.querySelector(".drag-term");e&&this.dragItem(e)}}else if(t.code===i.ESCAPE){const t=this.rows[this.coordinates[0]].querySelectorAll("td")[this.coordinates[1]];""===t.innerHTML.trim()?t.blur():t.querySelector(".drag-term").blur()}else if(t.code===i.ARROW_LEFT||t.code===i.ARROW_UP||t.code===i.ARROW_RIGHT||t.code===i.ARROW_DOWN||t.code===i.HOME||t.code===i.END){t.code===i.ARROW_LEFT&&this.coordinates[1]>0&&(this.coordinates[1]-=1),t.code===i.ARROW_UP&&this.coordinates[0]>0&&(this.coordinates[0]-=1),t.code===i.ARROW_RIGHT&&this.coordinates[1]<this.rows[0].querySelectorAll("td").length-1&&(this.coordinates[1]+=1),t.code===i.ARROW_DOWN&&this.coordinates[0]<this.rows.length-1&&(this.coordinates[0]+=1),t.code===i.HOME&&(t.ctrlKey&&(this.coordinates[0]=0),this.coordinates[1]=0),t.code===i.END&&(t.ctrlKey&&(this.coordinates[0]=this.rows.length-1),this.coordinates[1]=this.rows[0].querySelectorAll("td").length-1);const e=this.rows[this.coordinates[0]].querySelectorAll("td")[this.coordinates[1]],o=e.querySelector(".drag-term")||e;this.widget.querySelectorAll("td, .drag-term").forEach((t=>t.setAttribute("tabindex","-1"))),o.setAttribute("tabindex","0"),o.focus()}}init(){const t=Object.create(null,{init:{get:()=>super.init}});return __awaiter(this,void 0,void 0,(function*(){yield t.init.call(this),yield o.e(1579).then(o.t.bind(o,21579,23)),this.widget.addEventListener("dragstart",(t=>{var e;if(t.target instanceof HTMLElement){const o=t.target.closest(".drag-term");o&&(t.stopPropagation(),null===(e=t.dataTransfer)||void 0===e||e.setData("text/plain",o.id),this.dragItem(o))}})),this.widget.addEventListener("dragover",(t=>{if(t.target instanceof HTMLElement){const e=t.target.closest(".drop-placeholder");e&&""===e.innerHTML.trim()&&t.preventDefault()}})),this.widget.addEventListener("drop",(t=>{var e;if(t.target instanceof HTMLElement){const o=t.target.closest(".drop-placeholder");o&&(this.grabbed=document.getElementById(null===(e=t.dataTransfer)||void 0===e?void 0:e.getData("text/plain")),this.grabbed&&this.dropItem(o))}})),this.widget.querySelector("table").addEventListener("keydown",(t=>{this.onKeyDown(t)})),this.widget.addEventListener("click",(t=>{if(t.target instanceof HTMLElement)if(t.target.classList.contains("btn-check-answer"))this.check();else if(t.target.classList.contains("btn-reset"))this.reset();else{const e=t.target.closest(".drag-term"),o=t.target.closest(".drop-placeholder");e?this.dragItem(e):o&&this.dropItem(o)}}))}))}voiceControlCheck(){this.check()}voiceControlGoto(t){this.coordinates=[this.utils.mod(Math.floor(t/3),this.rows.length),this.utils.mod(t,3)];const e=Array.from(this.widget.querySelectorAll("td")),o=e[this.utils.mod(t,e.length)],i=o.querySelector(".drag-term")||o;this.widget.querySelectorAll("td, .drag-term").forEach((t=>t.setAttribute("tabindex","-1"))),i.setAttribute("tabindex","0"),i.focus()}voiceControlNext(){const t=3*this.coordinates[0]+this.coordinates[1];this.voiceControlGoto(t+1)}voiceControlPrevious(){const t=3*this.coordinates[0]+this.coordinates[1];this.voiceControlGoto(t-1)}voiceControlSelect(){const t=this.rows[this.coordinates[0]].querySelectorAll("td")[this.coordinates[1]];if(""===t.innerHTML.trim())this.dropItem(t);else{const e=t.querySelector(".drag-term");e&&this.dragItem(e)}}voiceControlStart(){super.voiceControlStart(),this.voiceControlGoto(0)}voiceControlRepeat(){this.voiceControlMessageElem.innerHTML+=this.utils.alert("alert-info",this.i18n.value("tta-info-drag-drop"))}voiceControlReset(){this.reset()}}},19412:(t,e,o)=>{"use strict";o.d(e,{A:()=>Element});var i=o(16126),n=o(3605),__awaiter=function(t,e,o,i){return new(o||(o=Promise))((function(n,r){function fulfilled(t){try{step(i.next(t))}catch(t){r(t)}}function rejected(t){try{step(i.throw(t))}catch(t){r(t)}}function step(t){t.done?n(t.value):function adopt(t){return t instanceof o?t:new o((function(e){e(t)}))}(t.value).then(fulfilled,rejected)}step((i=i.apply(t,e||[])).next())}))};class Element{constructor(t,e,o){this.voiceControl=t,this.utils=e,this.i18n=o,this._activityNumber=0}init(){return __awaiter(this,void 0,void 0,(function*(){if(!this._widget)throw new Error("ElementHTML widget has not been set.");this.voiceControlMessageElem=this.widget.querySelector(".tta-message"),this.voiceControlButton=document.querySelector(`#speech-to-action-${this.id}`),this.voiceControlButton&&(this.voiceControlButton.addEventListener("click",(()=>{if(this.voiceControl.currentTarget!==this.id){for(;this.voiceControl.numTargets>1;)this.voiceControl.popTarget();return this._parent&&this.voiceControl.addTarget(this._parent.id),void this.voiceControl.addTarget(this.id)}this.voiceControl.popTarget(),this.voiceControlButton&&this.toggleVoiceControlButton(!1)})),this.voiceControl.voiceControlTargetChanged.subscribe((t=>{this.id===t.old&&this.toggleVoiceControlButton(!1),this.id===t.new&&this.toggleVoiceControlButton(!0)})),this.voiceControl.voiceControlActions.pipe((0,i.p)((t=>t.target===this.id))).subscribe((t=>{t instanceof n.m6?this.voiceControlStart():t instanceof n.$q?this.voiceControlFinish():t instanceof n.DZ?this.voiceControlNext():t instanceof n.vZ?this.voiceControlPrevious():t instanceof n.Fd?this.voiceControlGoto(t.position):t instanceof n.V3?this.voiceControlBack():t instanceof n.gZ?this.voiceControlSelect():t instanceof n.CG?this.voiceControlClose():t instanceof n.sT?this.voiceControlCheck():t instanceof n.XR?this.voiceControlCurrent():t instanceof n.B$?this.voiceControlDelete():t instanceof n._R?this.voiceControlMaximize():t instanceof n.EZ?this.voiceControlMinimize():t instanceof n.$V?this.voiceControlMove(t.position):t instanceof n.ow?this.voiceControlPause():t instanceof n.OR?this.voiceControlPlay():t instanceof n.pr?this.voiceControlRepeat():t instanceof n.lR?this.voiceControlReset():t instanceof n.m6?this.voiceControlStart():t instanceof n.o3?this.voiceControlStop():t instanceof n.HU?this.voiceControlWrite(t.text):t instanceof n.kw&&this.voiceControlUnknown()})))}))}get description(){return this.widget.dataset.desc||""}get id(){return this.widget.id}get type(){return this.widget.dataset.type||""}get widget(){return this._widget}set widget(t){this._widget=t}get parent(){return this._parent}set parent(t){this._parent=t}set activityNumber(t){this._activityNumber=t,this.voiceControlButton&&(this.voiceControlButton.innerHTML+=`<span class="element-number">${this.i18n.value("tta-activity-number")} ${t}</span>`)}toggleHighlight(t){this.widget.classList.toggle("speech-focused",t)}toggleVoiceControlButton(t){if(this.voiceControlButton){const e=this.voiceControlButton.querySelector("svg");e&&(e.classList.toggle("fa-head-side-cough",t),e.classList.toggle("fa-head-side-cough-slash",!t))}}showVoiceControlButton(){this.voiceControlButton&&(this.voiceControlButton.classList.add("show"),this.toggleVoiceControlButton(!1))}hideVoiceControlButton(){this.voiceControlButton&&this.voiceControlButton.classList.remove("show")}voiceControlStart(){this.toggleVoiceControlButton(!0)}voiceControlFinish(){this.voiceControl.popTarget(),this.toggleVoiceControlButton(!1)}voiceControlClose(){this.voiceControlUnknown()}voiceControlCheck(){this.voiceControlUnknown()}voiceControlCurrent(){this.voiceControlUnknown()}voiceControlDelete(){this.voiceControlUnknown()}voiceControlMaximize(){this.voiceControlUnknown()}voiceControlMinimize(){this.voiceControlUnknown()}voiceControlMove(t){this.voiceControlUnknown()}voiceControlPause(){this.voiceControlUnknown()}voiceControlPlay(){this.voiceControlUnknown()}voiceControlRepeat(){this.voiceControlUnknown()}voiceControlReset(){this.voiceControlUnknown()}voiceControlStop(){this.voiceControlUnknown()}voiceControlWrite(t){this.voiceControlUnknown()}voiceControlNext(){this.voiceControlUnknown()}voiceControlPrevious(){this.voiceControlUnknown()}voiceControlGoto(t){this.voiceControlUnknown()}voiceControlBack(){this.voiceControlUnknown()}voiceControlSelect(){this.voiceControlUnknown()}voiceControlUnknown(){this.voiceControlMessageElem.innerHTML+=this.utils.alert("alert-danger",this.i18n.value("tta-error-message"))}}},6088:(t,e,o)=>{"use strict";function __WEBPACK_DEFAULT_EXPORT__(t,e,o){if(t==e)return o.fn(this)}o.r(e),o.d(e,{default:()=>__WEBPACK_DEFAULT_EXPORT__})},20884:(t,e,o)=>{"use strict";function __WEBPACK_DEFAULT_EXPORT__(t,e,o){if(t!=e)return o.fn(this)}o.r(e),o.d(e,{default:()=>__WEBPACK_DEFAULT_EXPORT__})}}]);