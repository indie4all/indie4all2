"use strict";(self.webpackChunkCDN=self.webpackChunkCDN||[]).push([[7078],{16492:(t,e,o)=>{o.d(e,{x:()=>Widget});var i=o(7181),n=o(40561);function Widget(t){const e=i.Ay.get(n.default);return function(o){e.registerWidget(t.selector,o)}}},27078:(t,e,o)=>{o.r(e),o.d(e,{default:()=>h});var i=o(16492),n=o(75015),s=o(8157),r=o(44295),c=o(35999),l=o(70583),a=o(61709),__decorate=function(t,e,o,i){var n,s=arguments.length,r=s<3?e:null===i?i=Object.getOwnPropertyDescriptor(e,o):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(t,e,o,i);else for(var c=t.length-1;c>=0;c--)(n=t[c])&&(r=(s<3?n(r):s>3?n(e,o,r):n(e,o))||r);return s>3&&r&&Object.defineProperty(e,o,r),r},__metadata=function(t,e){if("object"==typeof Reflect&&"function"==typeof Reflect.metadata)return Reflect.metadata(t,e)},__awaiter=function(t,e,o,i){return new(o||(o=Promise))((function(n,s){function fulfilled(t){try{step(i.next(t))}catch(t){s(t)}}function rejected(t){try{step(i.throw(t))}catch(t){s(t)}}function step(t){t.done?n(t.value):function adopt(t){return t instanceof o?t:new o((function(e){e(t)}))}(t.value).then(fulfilled,rejected)}step((i=i.apply(t,e||[])).next())}))};let u=class CouplesContentElement extends s.A{constructor(t,e,o,i){super(t,e,i),this.i18n=t,this.utils=e,this.interaction=o,this.voiceControl=i,this.positions=[]}showFeedback(t,e){const o=this.widget.querySelector(".text-result");if(t.forEach((t=>{t.classList.add(e?"correct":"wrong"),t.classList.remove("active")})),o.classList.remove(e?"text-danger":"text-success"),o.classList.add(e?"text-success":"text-danger"),o.innerHTML="",setTimeout((()=>o.innerHTML=e?'<span aria-hidden="true">'+this.i18n.value("CorrectPair")+"</span>":this.i18n.value("WrongPair")),100),e){const e=this.widget.querySelector(".text-result"),o=Array.from(this.widget.querySelectorAll(".couple"));this.counter++,t[0].querySelector(".couple-state").innerHTML=this.i18n.value("couples-state-matched",{option:t[1].querySelector(".couple-prefix").textContent}),t[1].querySelector(".couple-state").innerHTML=this.i18n.value("couples-state-matched",{option:t[0].querySelector(".couple-prefix").textContent}),t.forEach((t=>{t.querySelector(".couple-button").setAttribute("aria-disabled","true"),t.querySelector(".couple-tag").innerHTML=this.counter.toString(),t.querySelector(".couple-feedback").setAttribute("aria-label",this.i18n.value("CorrectPair"))})),o.every((t=>t.classList.contains("correct")))&&(e.classList.remove("text-danger"),e.classList.add("text-success"),e.innerHTML="",this.interaction.emit(new n.yz({id:this.id,type:this.type,description:this.description})),setTimeout((()=>{e.innerHTML=this.i18n.value("AllPairsCorrect")}),100))}else setTimeout((()=>document.querySelectorAll(".wrong").forEach((t=>t.classList.remove("wrong")))),500),t.forEach((t=>t.querySelector(".couple-state").innerHTML=""))}check(){}reset(){this.interaction.emit(new n.nz({id:this.id,type:this.type,description:this.description})),this.widget.querySelectorAll(".couple").forEach((t=>{t.classList.remove("active","correct"),t.querySelector(".couple-button").setAttribute("aria-disabled","false"),t.querySelector(".couple-state").innerHTML="";const e=t.querySelector(".couple-feedback");e.removeAttribute("aria-label"),e.innerHTML=""}));const t=this.widget.querySelector(".text-result");t.classList.remove("text-danger","text-success"),t.innerHTML=""}onCoupleSelected(t){if(t.classList.contains("correct"))return;const e=t.classList.contains("active"),o=Array.from(this.widget.querySelectorAll(".couple.active")).find((e=>e!==t));if(t.classList.toggle("active",!e),t.querySelector(".couple-state").innerHTML=e?"":this.i18n.value("couples-state-selected"),o){const e=Array.from(this.widget.querySelectorAll(".couple")),i=this.positions[e.indexOf(t)]===this.positions[e.indexOf(o)];this.interaction.emit(new n.sV({id:this.id,type:this.type,description:this.description,score:i?1:0})),this.showFeedback([t,o],i)}}init(){const t=Object.create(null,{init:{get:()=>super.init}});return __awaiter(this,void 0,void 0,(function*(){yield t.init.call(this);const{default:e}=yield o.e(8310).then(o.t.bind(o,28310,23)),i=JSON.parse(this.utils.b64DecodeUnicode(this.widget.dataset.content)).map(((t,e)=>[t,Math.floor(e/2)]));this.utils.shuffle(i),this.positions=i.map((t=>t[1])),this.couples=i.map((t=>t[0]));const n=this.couples.map(((t,o)=>{const i=this.i18n.value("accessibility-option")+" "+(o+1)+" "+this.i18n.value("img"===t.type?"common-image":"common-text"),n={id:this.id,position:o,type:t.type,prefix:i};if("text"===t.type){const e=document.createElement("div");e.innerHTML=t.content;const o=e.firstChild;n.hasCode=o instanceof HTMLElement&&("code"===o.tagName||o.querySelector("code")),n.content=t.content}else"img"===t.type&&(n.src=t.src,n.alt=t.alt);return e(n)})).join("");this.widget.querySelector(".couples").innerHTML+=n,this.buttons=Array.from(this.widget.querySelectorAll(".couple-button"))}))}loadCouples(){const t=JSON.parse(this.utils.b64DecodeUnicode(this.widget.dataset.content)).map(((t,e)=>[t,Math.floor(e/2)]));return this.utils.shuffle(t),this.positions=t.map((t=>t[1])),t.map((t=>t[0]))}};u=__decorate([(0,i.x)({selector:".widget-couples"}),__metadata("design:paramtypes",[r.A,l.A,c.A,a.A])],u);const h=u},8157:(t,e,o)=>{o.d(e,{A:()=>CouplesElement});var i=o(19412),__awaiter=function(t,e,o,i){return new(o||(o=Promise))((function(n,s){function fulfilled(t){try{step(i.next(t))}catch(t){s(t)}}function rejected(t){try{step(i.throw(t))}catch(t){s(t)}}function step(t){t.done?n(t.value):function adopt(t){return t instanceof o?t:new o((function(e){e(t)}))}(t.value).then(fulfilled,rejected)}step((i=i.apply(t,e||[])).next())}))};class CouplesElement extends i.A{constructor(t,e,o){super(o,e,t),this.i18n=t,this.utils=e,this.voiceControl=o,this.currentPosition=0,this.counter=0,this.couples=[]}handleOptionKeydown(t){const e=t.target,o=t.key;if("Enter"===o||"Space"===o||"ArrowUp"===o||"ArrowDown"===o||"Escape"===o)if(t.preventDefault(),t.stopPropagation(),"Enter"===o||"Space"===o){const t=e.closest(".couple");this.onCoupleSelected(t)}else"Escape"===o?e.blur():"ArrowUp"!==o&&"ArrowDown"!==o||(this.currentPosition="ArrowUp"===o?this.utils.mod(this.currentPosition-1,this.buttons.length):this.utils.mod(this.currentPosition+1,this.buttons.length),this.buttons.forEach(((t,e)=>t.setAttribute("tabindex",e===this.currentPosition?"0":"-1"))),this.buttons[this.currentPosition].focus())}init(){const t=Object.create(null,{init:{get:()=>super.init}});return __awaiter(this,void 0,void 0,(function*(){yield t.init.call(this),this.widget.addEventListener("keydown",(t=>{t.target instanceof HTMLElement&&(t.target.classList.contains("btn-reset")?this.reset():t.target.closest(".couple")&&this.handleOptionKeydown(t))})),this.widget.addEventListener("click",(t=>{t.target instanceof HTMLElement&&(t.target.classList.contains("btn-reset")?this.reset():t.target.closest(".couple")&&this.onCoupleSelected(t.target.closest(".couple")))}))}))}voiceControlStart(){super.voiceControlStart(),this.voiceControlGoto(0)}voiceControlCheck(){this.check()}voiceControlGoto(t){this.currentPosition=this.utils.mod(t,this.buttons.length),this.buttons[this.currentPosition].focus()}voiceControlNext(){this.voiceControlGoto(this.currentPosition+1)}voiceControlPrevious(){this.voiceControlGoto(this.currentPosition-1)}voiceControlRepeat(){this.voiceControlMessageElem.innerHTML+=this.utils.alert("alert-info",this.i18n.value("tta-info-couples"))}voiceControlReset(){this.reset()}voiceControlSelect(){this.buttons[this.currentPosition].click()}}},19412:(t,e,o)=>{o.d(e,{A:()=>Element});var i=o(16126),n=o(3605),__awaiter=function(t,e,o,i){return new(o||(o=Promise))((function(n,s){function fulfilled(t){try{step(i.next(t))}catch(t){s(t)}}function rejected(t){try{step(i.throw(t))}catch(t){s(t)}}function step(t){t.done?n(t.value):function adopt(t){return t instanceof o?t:new o((function(e){e(t)}))}(t.value).then(fulfilled,rejected)}step((i=i.apply(t,e||[])).next())}))};class Element{constructor(t,e,o){this.voiceControl=t,this.utils=e,this.i18n=o,this._activityNumber=0}init(){return __awaiter(this,void 0,void 0,(function*(){if(!this._widget)throw new Error("ElementHTML widget has not been set.");this.voiceControlMessageElem=this.widget.querySelector(".tta-message"),this.voiceControlButton=document.querySelector(`#speech-to-action-${this.id}`),this.voiceControlButton&&(this.voiceControlButton.addEventListener("click",(()=>{if(this.voiceControl.currentTarget!==this.id){for(;this.voiceControl.numTargets>1;)this.voiceControl.popTarget();return this._parent&&this.voiceControl.addTarget(this._parent.id),void this.voiceControl.addTarget(this.id)}this.voiceControl.popTarget(),this.voiceControlButton&&this.toggleVoiceControlButton(!1)})),this.voiceControl.voiceControlTargetChanged.subscribe((t=>{this.id===t.old&&this.toggleVoiceControlButton(!1),this.id===t.new&&this.toggleVoiceControlButton(!0)})),this.voiceControl.voiceControlActions.pipe((0,i.p)((t=>t.target===this.id))).subscribe((t=>{t instanceof n.m6?this.voiceControlStart():t instanceof n.$q?this.voiceControlFinish():t instanceof n.DZ?this.voiceControlNext():t instanceof n.vZ?this.voiceControlPrevious():t instanceof n.Fd?this.voiceControlGoto(t.position):t instanceof n.V3?this.voiceControlBack():t instanceof n.gZ?this.voiceControlSelect():t instanceof n.CG?this.voiceControlClose():t instanceof n.sT?this.voiceControlCheck():t instanceof n.XR?this.voiceControlCurrent():t instanceof n.B$?this.voiceControlDelete():t instanceof n._R?this.voiceControlMaximize():t instanceof n.EZ?this.voiceControlMinimize():t instanceof n.$V?this.voiceControlMove(t.position):t instanceof n.ow?this.voiceControlPause():t instanceof n.OR?this.voiceControlPlay():t instanceof n.pr?this.voiceControlRepeat():t instanceof n.lR?this.voiceControlReset():t instanceof n.m6?this.voiceControlStart():t instanceof n.o3?this.voiceControlStop():t instanceof n.HU?this.voiceControlWrite(t.text):t instanceof n.kw&&this.voiceControlUnknown()})))}))}get description(){return this.widget.dataset.desc||""}get id(){return this.widget.id}get type(){return this.widget.dataset.type||""}get widget(){return this._widget}set widget(t){this._widget=t}get parent(){return this._parent}set parent(t){this._parent=t}set activityNumber(t){this._activityNumber=t,this.voiceControlButton&&(this.voiceControlButton.innerHTML+=`<span class="element-number">${this.i18n.value("tta-activity-number")} ${t}</span>`)}toggleHighlight(t){this.widget.classList.toggle("speech-focused",t)}toggleVoiceControlButton(t){if(this.voiceControlButton){const e=this.voiceControlButton.querySelector("svg");e&&(e.classList.toggle("fa-head-side-cough",t),e.classList.toggle("fa-head-side-cough-slash",!t))}}showVoiceControlButton(){this.voiceControlButton&&(this.voiceControlButton.classList.add("show"),this.toggleVoiceControlButton(!1))}hideVoiceControlButton(){this.voiceControlButton&&this.voiceControlButton.classList.remove("show")}voiceControlStart(){this.toggleVoiceControlButton(!0)}voiceControlFinish(){this.voiceControl.popTarget(),this.toggleVoiceControlButton(!1)}voiceControlClose(){this.voiceControlUnknown()}voiceControlCheck(){this.voiceControlUnknown()}voiceControlCurrent(){this.voiceControlUnknown()}voiceControlDelete(){this.voiceControlUnknown()}voiceControlMaximize(){this.voiceControlUnknown()}voiceControlMinimize(){this.voiceControlUnknown()}voiceControlMove(t){this.voiceControlUnknown()}voiceControlPause(){this.voiceControlUnknown()}voiceControlPlay(){this.voiceControlUnknown()}voiceControlRepeat(){this.voiceControlUnknown()}voiceControlReset(){this.voiceControlUnknown()}voiceControlStop(){this.voiceControlUnknown()}voiceControlWrite(t){this.voiceControlUnknown()}voiceControlNext(){this.voiceControlUnknown()}voiceControlPrevious(){this.voiceControlUnknown()}voiceControlGoto(t){this.voiceControlUnknown()}voiceControlBack(){this.voiceControlUnknown()}voiceControlSelect(){this.voiceControlUnknown()}voiceControlUnknown(){this.voiceControlMessageElem.innerHTML+=this.utils.alert("alert-danger",this.i18n.value("tta-error-message"))}}}}]);