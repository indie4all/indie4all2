"use strict";(self.webpackChunkCDN=self.webpackChunkCDN||[]).push([[546],{16492:(t,e,o)=>{o.d(e,{x:()=>Widget});var i=o(7181),n=o(40561);function Widget(t){const e=i.Ay.get(n.default);return function(o){e.registerWidget(t.selector,o)}}},19412:(t,e,o)=>{o.d(e,{A:()=>Element});var i=o(16126),n=o(3605),__awaiter=function(t,e,o,i){return new(o||(o=Promise))((function(n,s){function fulfilled(t){try{step(i.next(t))}catch(t){s(t)}}function rejected(t){try{step(i.throw(t))}catch(t){s(t)}}function step(t){t.done?n(t.value):function adopt(t){return t instanceof o?t:new o((function(e){e(t)}))}(t.value).then(fulfilled,rejected)}step((i=i.apply(t,e||[])).next())}))};class Element{constructor(t,e,o){this.voiceControl=t,this.utils=e,this.i18n=o,this._activityNumber=0}init(){return __awaiter(this,void 0,void 0,(function*(){if(!this._widget)throw new Error("ElementHTML widget has not been set.");this.voiceControlMessageElem=this.widget.querySelector(".tta-message"),this.voiceControlButton=document.querySelector(`#speech-to-action-${this.id}`),this.voiceControlButton&&(this.voiceControlButton.addEventListener("click",(()=>{if(this.voiceControl.currentTarget!==this.id){for(;this.voiceControl.numTargets>1;)this.voiceControl.popTarget();return this._parent&&this.voiceControl.addTarget(this._parent.id),void this.voiceControl.addTarget(this.id)}this.voiceControl.popTarget(),this.voiceControlButton&&this.toggleVoiceControlButton(!1)})),this.voiceControl.voiceControlTargetChanged.subscribe((t=>{this.id===t.old&&this.toggleVoiceControlButton(!1),this.id===t.new&&this.toggleVoiceControlButton(!0)})),this.voiceControl.voiceControlActions.pipe((0,i.p)((t=>t.target===this.id))).subscribe((t=>{t instanceof n.m6?this.voiceControlStart():t instanceof n.$q?this.voiceControlFinish():t instanceof n.DZ?this.voiceControlNext():t instanceof n.vZ?this.voiceControlPrevious():t instanceof n.Fd?this.voiceControlGoto(t.position):t instanceof n.V3?this.voiceControlBack():t instanceof n.gZ?this.voiceControlSelect():t instanceof n.CG?this.voiceControlClose():t instanceof n.sT?this.voiceControlCheck():t instanceof n.XR?this.voiceControlCurrent():t instanceof n.B$?this.voiceControlDelete():t instanceof n._R?this.voiceControlMaximize():t instanceof n.EZ?this.voiceControlMinimize():t instanceof n.$V?this.voiceControlMove(t.position):t instanceof n.ow?this.voiceControlPause():t instanceof n.OR?this.voiceControlPlay():t instanceof n.pr?this.voiceControlRepeat():t instanceof n.lR?this.voiceControlReset():t instanceof n.m6?this.voiceControlStart():t instanceof n.o3?this.voiceControlStop():t instanceof n.HU?this.voiceControlWrite(t.text):t instanceof n.kw&&this.voiceControlUnknown()})))}))}get description(){return this.widget.dataset.desc||""}get id(){return this.widget.id}get type(){return this.widget.dataset.type||""}get widget(){return this._widget}set widget(t){this._widget=t}get parent(){return this._parent}set parent(t){this._parent=t}set activityNumber(t){this._activityNumber=t,this.voiceControlButton&&(this.voiceControlButton.innerHTML+=`<span class="element-number">${this.i18n.value("tta-activity-number")} ${t}</span>`)}toggleHighlight(t){this.widget.classList.toggle("speech-focused",t)}toggleVoiceControlButton(t){if(this.voiceControlButton){const e=this.voiceControlButton.querySelector("svg");e&&(e.classList.toggle("fa-head-side-cough",t),e.classList.toggle("fa-head-side-cough-slash",!t))}}showVoiceControlButton(){this.voiceControlButton&&(this.voiceControlButton.classList.add("show"),this.toggleVoiceControlButton(!1))}hideVoiceControlButton(){this.voiceControlButton&&this.voiceControlButton.classList.remove("show")}voiceControlStart(){this.toggleVoiceControlButton(!0)}voiceControlFinish(){this.voiceControl.popTarget(),this.toggleVoiceControlButton(!1)}voiceControlClose(){this.voiceControlUnknown()}voiceControlCheck(){this.voiceControlUnknown()}voiceControlCurrent(){this.voiceControlUnknown()}voiceControlDelete(){this.voiceControlUnknown()}voiceControlMaximize(){this.voiceControlUnknown()}voiceControlMinimize(){this.voiceControlUnknown()}voiceControlMove(t){this.voiceControlUnknown()}voiceControlPause(){this.voiceControlUnknown()}voiceControlPlay(){this.voiceControlUnknown()}voiceControlRepeat(){this.voiceControlUnknown()}voiceControlReset(){this.voiceControlUnknown()}voiceControlStop(){this.voiceControlUnknown()}voiceControlWrite(t){this.voiceControlUnknown()}voiceControlNext(){this.voiceControlUnknown()}voiceControlPrevious(){this.voiceControlUnknown()}voiceControlGoto(t){this.voiceControlUnknown()}voiceControlBack(){this.voiceControlUnknown()}voiceControlSelect(){this.voiceControlUnknown()}voiceControlUnknown(){this.voiceControlMessageElem.innerHTML+=this.utils.alert("alert-danger",this.i18n.value("tta-error-message"))}}},50546:(t,e,o)=>{o.r(e),o.d(e,{default:()=>u});var i=o(16492),n=o(75015),s=o(44295),c=o(35999),r=o(56305),l=o(70583),h=o(61709),__decorate=function(t,e,o,i){var n,s=arguments.length,c=s<3?e:null===i?i=Object.getOwnPropertyDescriptor(e,o):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)c=Reflect.decorate(t,e,o,i);else for(var r=t.length-1;r>=0;r--)(n=t[r])&&(c=(s<3?n(c):s>3?n(e,o,c):n(e,o))||c);return s>3&&c&&Object.defineProperty(e,o,c),c},__metadata=function(t,e){if("object"==typeof Reflect&&"function"==typeof Reflect.metadata)return Reflect.metadata(t,e)},__awaiter=function(t,e,o,i){return new(o||(o=Promise))((function(n,s){function fulfilled(t){try{step(i.next(t))}catch(t){s(t)}}function rejected(t){try{step(i.throw(t))}catch(t){s(t)}}function step(t){t.done?n(t.value):function adopt(t){return t instanceof o?t:new o((function(e){e(t)}))}(t.value).then(fulfilled,rejected)}step((i=i.apply(t,e||[])).next())}))};let a=class TrueFalseContentElement extends r.A{constructor(t,e,o,i){super(i,e,t),this.i18n=t,this.utils=e,this.interaction=o,this.voiceControl=i}toggleCheckbox(t){const e=t.closest(".question"),o=t.checked,i=e.querySelector(".iconresult");i.setAttribute("aria-label",""),i.innerHTML="";const n=e.querySelector(".form-check-label");n.classList.toggle("text-danger",!o),n.classList.toggle("text-success",o),n.innerHTML=o?this.i18n.value("TextTrue"):this.i18n.value("TextFalse"),e.querySelector(".feedback-positive").classList.add("hidden"),e.querySelector(".feedback-negative").classList.add("hidden")}showFeedback(t){const e=this.inputs.filter((function(e,o){return t[o]===e.checked})).length;this.inputs.forEach(((e,o)=>{const i=e.closest(".question"),n=t[o]===e.checked;e.setAttribute("aria-describedby",(n?"feedback-positive-":"feedback-negative-")+e.name);const s=i.querySelector(".iconresult");s.setAttribute("aria-label",n?this.i18n.value("TextCorrectAnswer"):this.i18n.value("TextIncorrectAnswer")),s.innerHTML=n?'<i class="fas fa-2x fa-check"></i>':'<i class="fas fa-2x fa-times"></i>';const c=i.querySelector(".feedback-positive"),r=i.querySelector(".feedback-negative");c.classList.toggle("hidden",!n||""===c.innerHTML),r.classList.toggle("hidden",n||""===r.innerHTML)})),this.widget.querySelector(".text-result").innerHTML=e+" "+this.i18n.value("TextCorrectAnswers")}check(){const t=JSON.parse(this.utils.b64DecodeUnicode(this.widget.dataset.content));this.showFeedback(t);const e=this.inputs.reduce(((e,o,i)=>e+(o.checked===t[i]?1:0)),0)/t.length;this.interaction.emit(new n.sV({id:this.id,type:this.type,description:this.description,score:e})),1===e&&this.interaction.emit(new n.yz({id:this.id,type:this.type,description:this.description}))}reset(){this.interaction.emit(new n.nz({id:this.id,type:this.type,description:this.description})),this.inputs.forEach((t=>{t.checked=!1,t.removeAttribute("aria-describedby")})),this.widget.querySelectorAll(".feedback-negative, .feedback-positive").forEach((t=>t.classList.add("hidden"))),this.widget.querySelectorAll(".iconresult").forEach((t=>{t.removeAttribute("aria-label"),t.innerHTML=""})),this.widget.querySelector(".text-result").innerHTML="",this.inputs.forEach((t=>{t.checked=!1,this.toggleCheckbox(t)}))}init(){const t=Object.create(null,{init:{get:()=>super.init}});return __awaiter(this,void 0,void 0,(function*(){yield t.init.call(this),this.widget.addEventListener("change",(t=>{t.target instanceof HTMLInputElement&&this.inputs.includes(t.target)&&this.toggleCheckbox(t.target)}))}))}};a=__decorate([(0,i.x)({selector:".widget-truefalse"}),__metadata("design:paramtypes",[s.A,l.A,c.A,h.A])],a);const u=a},56305:(t,e,o)=>{o.d(e,{A:()=>TrueFalseElement});var i=o(19412),__awaiter=function(t,e,o,i){return new(o||(o=Promise))((function(n,s){function fulfilled(t){try{step(i.next(t))}catch(t){s(t)}}function rejected(t){try{step(i.throw(t))}catch(t){s(t)}}function step(t){t.done?n(t.value):function adopt(t){return t instanceof o?t:new o((function(e){e(t)}))}(t.value).then(fulfilled,rejected)}step((i=i.apply(t,e||[])).next())}))};class TrueFalseElement extends i.A{constructor(t,e,o){super(t,e,o),this.voiceControl=t,this.utils=e,this.i18n=o,this.currentInput=0}init(){const t=Object.create(null,{init:{get:()=>super.init}});return __awaiter(this,void 0,void 0,(function*(){yield t.init.call(this),this.widget.addEventListener("click",(t=>{const e=t.target;e.classList.contains("btn-reset")&&this.reset(),e.classList.contains("btn-check-answer")&&this.check()})),this.inputs=Array.from(this.widget.querySelectorAll("input[type=checkbox]"))}))}voiceControlStart(){super.voiceControlStart(),this.voiceControlGoto(0)}voiceControlCheck(){this.check()}voiceControlGoto(t){this.currentInput=this.utils.mod(t,this.inputs.length),this.inputs[this.currentInput].focus()}voiceControlNext(){this.voiceControlGoto(this.currentInput+1)}voiceControlPrevious(){this.voiceControlGoto(this.currentInput-1)}voiceControlRepeat(){this.voiceControlMessageElem.innerHTML+=this.utils.alert("alert-info",this.i18n.value("tta-info-truefalse"))}voiceControlReset(){this.reset()}voiceControlSelect(){this.inputs[this.currentInput].click()}}}}]);