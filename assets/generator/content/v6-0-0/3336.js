"use strict";(self.webpackChunkCDN=self.webpackChunkCDN||[]).push([[3336],{16492:(t,o,i)=>{i.d(o,{x:()=>Widget});var e=i(7181),n=i(40561);function Widget(t){const o=e.Ay.get(n.default);return function(i){o.registerWidget(t.selector,i)}}},13336:(t,o,i)=>{var e;i.r(o),i.d(o,{default:()=>d}),function(t){t[t.TABS=0]="TABS",t[t.CONTENT=1]="CONTENT"}(e||(e={}));var n=i(16492),s=i(75015),r=i(7979),c=i(46894),l=i(19412),h=i(35999),a=i(61709),u=i(70583),C=i(44295),__decorate=function(t,o,i,e){var n,s=arguments.length,r=s<3?o:null===e?e=Object.getOwnPropertyDescriptor(o,i):e;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(t,o,i,e);else for(var c=t.length-1;c>=0;c--)(n=t[c])&&(r=(s<3?n(r):s>3?n(o,i,r):n(o,i))||r);return s>3&&r&&Object.defineProperty(o,i,r),r},__metadata=function(t,o){if("object"==typeof Reflect&&"function"==typeof Reflect.metadata)return Reflect.metadata(t,o)},__awaiter=function(t,o,i,e){return new(i||(i=Promise))((function(n,s){function fulfilled(t){try{step(e.next(t))}catch(t){s(t)}}function rejected(t){try{step(e.throw(t))}catch(t){s(t)}}function step(t){t.done?n(t.value):function adopt(t){return t instanceof i?t:new i((function(o){o(t)}))}(t.value).then(fulfilled,rejected)}step((e=e.apply(t,o||[])).next())}))};let v=class AccordionElement extends((0,c.A)(l.A)){constructor(t,o,i,n,s){super(i,n,s),this.bootstrap=t,this.interaction=o,this.voiceControl=i,this.utils=n,this.i18n=s,this.currentPosition=0,this.mode=e.TABS,this.currentChildrenPosition=0}init(){const t=Object.create(null,{init:{get:()=>super.init}});return __awaiter(this,void 0,void 0,(function*(){yield t.init.call(this),this.collapseModule=yield this.bootstrap.loadCollapseModule(),this.tabs=Array.from(this.widget.querySelectorAll(".btn-accordion")),this.tabs.forEach(((t,o)=>t.addEventListener("click",(()=>{this.interaction.emit(new s.Pm({id:this.id,type:this.type,description:this.description,tab:o}))})))),this.regions=Array.from(this.widget.querySelectorAll(".accordion-region")),this.regions.forEach((t=>{t.addEventListener("shown.bs.collapse",(t=>{if(t.target instanceof HTMLElement){const o=t.target.clientHeight;t.target.querySelector(".tabtop").classList.toggle("show",o>1e3)}}))}))}))}voiceControlBack(){this.mode===e.CONTENT&&(this.mode=e.TABS,this.tabs[this.currentPosition].focus(),this.tabs[this.currentPosition].scrollIntoView(!0),this.currentChildren.forEach((t=>t.toggleHighlight(!1))))}voiceControlFinish(){this.mode===e.TABS?super.voiceControlFinish():this.voiceControlBack()}voiceControlGoto(t){if(this.mode===e.CONTENT)return this.currentChildren.forEach((t=>t.toggleHighlight(!1))),this.currentChildrenPosition=this.utils.mod(t,this.currentChildren.length),void this.currentChildren[this.currentChildrenPosition].toggleHighlight(!0);this.currentPosition=this.utils.mod(t,this.tabs.length),this.tabs[this.currentPosition].focus(),this.collapseModule.getOrCreateInstance(this.tabs[this.currentPosition]).show()}voiceControlNext(){this.voiceControlGoto((this.mode==e.TABS?this.currentPosition:this.currentChildrenPosition)+1)}voiceControlPrevious(){this.voiceControlGoto((this.mode==e.TABS?this.currentPosition:this.currentChildrenPosition)-1)}voiceControlRepeat(){this.voiceControlMessageElem.innerHTML+=this.utils.alert("alert-info",this.i18n.value("tta-info-accordion-"+(this.mode===e.TABS?"tabs":"region")))}voiceControlSelect(){if(this.mode===e.TABS){const t=this.tabs[this.currentPosition];t.classList.contains("collapsed")&&t.click();const o=this.regions[this.currentPosition];return this.currentChildren=this.children.filter((t=>o.contains(t.widget))),this.currentChildrenPosition=0,o.focus(),this.mode=e.CONTENT,void this.currentChildren[this.currentChildrenPosition].toggleHighlight(!0)}this.voiceControl.addTarget(this.currentChildren[this.currentChildrenPosition].id)}voiceControlStart(){super.voiceControlStart(),this.mode=e.TABS,this.tabs[this.currentPosition].focus()}};v=__decorate([(0,n.x)({selector:".widget-accordion"}),__metadata("design:paramtypes",[r.A,h.A,a.A,u.A,C.A])],v);const d=v},19412:(t,o,i)=>{i.d(o,{A:()=>Element});var e=i(16126),n=i(3605),__awaiter=function(t,o,i,e){return new(i||(i=Promise))((function(n,s){function fulfilled(t){try{step(e.next(t))}catch(t){s(t)}}function rejected(t){try{step(e.throw(t))}catch(t){s(t)}}function step(t){t.done?n(t.value):function adopt(t){return t instanceof i?t:new i((function(o){o(t)}))}(t.value).then(fulfilled,rejected)}step((e=e.apply(t,o||[])).next())}))};class Element{constructor(t,o,i){this.voiceControl=t,this.utils=o,this.i18n=i,this._activityNumber=0}init(){return __awaiter(this,void 0,void 0,(function*(){if(!this._widget)throw new Error("ElementHTML widget has not been set.");this.voiceControlMessageElem=this.widget.querySelector(".tta-message"),this.voiceControlButton=document.querySelector(`#speech-to-action-${this.id}`),this.voiceControlButton&&(this.voiceControlButton.addEventListener("click",(()=>{if(this.voiceControl.currentTarget!==this.id){for(;this.voiceControl.numTargets>1;)this.voiceControl.popTarget();return this._parent&&this.voiceControl.addTarget(this._parent.id),void this.voiceControl.addTarget(this.id)}this.voiceControl.popTarget(),this.voiceControlButton&&this.toggleVoiceControlButton(!1)})),this.voiceControl.voiceControlTargetChanged.subscribe((t=>{this.id===t.old&&this.toggleVoiceControlButton(!1),this.id===t.new&&this.toggleVoiceControlButton(!0)})),this.voiceControl.voiceControlActions.pipe((0,e.p)((t=>t.target===this.id))).subscribe((t=>{t instanceof n.m6?this.voiceControlStart():t instanceof n.$q?this.voiceControlFinish():t instanceof n.DZ?this.voiceControlNext():t instanceof n.vZ?this.voiceControlPrevious():t instanceof n.Fd?this.voiceControlGoto(t.position):t instanceof n.V3?this.voiceControlBack():t instanceof n.gZ?this.voiceControlSelect():t instanceof n.CG?this.voiceControlClose():t instanceof n.sT?this.voiceControlCheck():t instanceof n.XR?this.voiceControlCurrent():t instanceof n.B$?this.voiceControlDelete():t instanceof n._R?this.voiceControlMaximize():t instanceof n.EZ?this.voiceControlMinimize():t instanceof n.$V?this.voiceControlMove(t.position):t instanceof n.ow?this.voiceControlPause():t instanceof n.OR?this.voiceControlPlay():t instanceof n.pr?this.voiceControlRepeat():t instanceof n.lR?this.voiceControlReset():t instanceof n.m6?this.voiceControlStart():t instanceof n.o3?this.voiceControlStop():t instanceof n.HU?this.voiceControlWrite(t.text):t instanceof n.kw&&this.voiceControlUnknown()})))}))}get description(){return this.widget.dataset.desc||""}get id(){return this.widget.id}get type(){return this.widget.dataset.type||""}get widget(){return this._widget}set widget(t){this._widget=t}get parent(){return this._parent}set parent(t){this._parent=t}set activityNumber(t){this._activityNumber=t,this.voiceControlButton&&(this.voiceControlButton.innerHTML+=`<span class="element-number">${this.i18n.value("tta-activity-number")} ${t}</span>`)}toggleHighlight(t){this.widget.classList.toggle("speech-focused",t)}toggleVoiceControlButton(t){if(this.voiceControlButton){const o=this.voiceControlButton.querySelector("svg");o&&(o.classList.toggle("fa-head-side-cough",t),o.classList.toggle("fa-head-side-cough-slash",!t))}}showVoiceControlButton(){this.voiceControlButton&&(this.voiceControlButton.classList.add("show"),this.toggleVoiceControlButton(!1))}hideVoiceControlButton(){this.voiceControlButton&&this.voiceControlButton.classList.remove("show")}voiceControlStart(){this.toggleVoiceControlButton(!0)}voiceControlFinish(){this.voiceControl.popTarget(),this.toggleVoiceControlButton(!1)}voiceControlClose(){this.voiceControlUnknown()}voiceControlCheck(){this.voiceControlUnknown()}voiceControlCurrent(){this.voiceControlUnknown()}voiceControlDelete(){this.voiceControlUnknown()}voiceControlMaximize(){this.voiceControlUnknown()}voiceControlMinimize(){this.voiceControlUnknown()}voiceControlMove(t){this.voiceControlUnknown()}voiceControlPause(){this.voiceControlUnknown()}voiceControlPlay(){this.voiceControlUnknown()}voiceControlRepeat(){this.voiceControlUnknown()}voiceControlReset(){this.voiceControlUnknown()}voiceControlStop(){this.voiceControlUnknown()}voiceControlWrite(t){this.voiceControlUnknown()}voiceControlNext(){this.voiceControlUnknown()}voiceControlPrevious(){this.voiceControlUnknown()}voiceControlGoto(t){this.voiceControlUnknown()}voiceControlBack(){this.voiceControlUnknown()}voiceControlSelect(){this.voiceControlUnknown()}voiceControlUnknown(){this.voiceControlMessageElem.innerHTML+=this.utils.alert("alert-danger",this.i18n.value("tta-error-message"))}}}}]);