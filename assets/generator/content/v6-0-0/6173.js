"use strict";(self.webpackChunkCDN=self.webpackChunkCDN||[]).push([[6173],{16492:(t,o,e)=>{e.d(o,{x:()=>Widget});var i=e(7181),n=e(40561);function Widget(t){const o=i.Ay.get(n.default);return function(e){o.registerWidget(t.selector,e)}}},86173:(t,o,e)=>{e.r(o),e.d(o,{default:()=>u});var i=e(16492),n=e(75015),s=e(19412),r=e(44295),c=e(35999),l=e(70583),a=e(61709),__decorate=function(t,o,e,i){var n,s=arguments.length,r=s<3?o:null===i?i=Object.getOwnPropertyDescriptor(o,e):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(t,o,e,i);else for(var c=t.length-1;c>=0;c--)(n=t[c])&&(r=(s<3?n(r):s>3?n(o,e,r):n(o,e))||r);return s>3&&r&&Object.defineProperty(o,e,r),r},__metadata=function(t,o){if("object"==typeof Reflect&&"function"==typeof Reflect.metadata)return Reflect.metadata(t,o)},__awaiter=function(t,o,e,i){return new(e||(e=Promise))((function(n,s){function fulfilled(t){try{step(i.next(t))}catch(t){s(t)}}function rejected(t){try{step(i.throw(t))}catch(t){s(t)}}function step(t){t.done?n(t.value):function adopt(t){return t instanceof e?t:new e((function(o){o(t)}))}(t.value).then(fulfilled,rejected)}step((i=i.apply(t,o||[])).next())}))};let h=class AudioTermElement extends s.A{constructor(t,o,e,i){super(e,i,t),this.i18n=t,this.interaction=o,this.voiceControl=e,this.utils=i,this.playing=!1}writeActiveTextTrack(){const t=this.textTracks[0].activeCues;if(t.length>0){let o="";for(let e=0;e<t.length;e++)o+=t[e].text+"<br><br>";this.widget.querySelector(".audio-widget-content").innerHTML=o.replace(/\n/g,"<br>")}}init(){const t=Object.create(null,{init:{get:()=>super.init}});return __awaiter(this,void 0,void 0,(function*(){yield t.init.call(this),this.button=this.widget.querySelector(".btn-audio"),this.button.querySelector(".audio-state").innerHTML=this.i18n.value("audio-play"),this.button.addEventListener("click",(()=>{this.playing?this.pause():this.play()})),this.audio=this.widget.querySelector(".audio-term-audio"),this.audio.addEventListener("ended",(()=>this.stop())),this.textTracks=this.audio.textTracks,this.textTracks&&this.textTracks.addEventListener("oncuechange",(()=>this.writeActiveTextTrack()))}))}pause(){const t=this.button.querySelector("svg");this.button.querySelector(".audio-state").innerHTML=this.i18n.value("audio-play"),t.classList.remove("fa-pause"),t.classList.add("fa-play"),this.audio.pause(),this.playing=!1,this.interaction.emit(new n.fy({id:this.id,type:this.type,description:this.description}))}play(){const t=this.button.querySelector("svg"),o=this.widget.querySelector(".audio-definition");t.classList.remove("fa-play"),t.classList.add("fa-pause"),this.button.querySelector(".audio-state").innerHTML=this.i18n.value("audio-pause"),o.classList.remove("hidden"),this.audio.play(),this.playing=!0,this.interaction.emit(new n.pK({id:this.id,type:this.type,description:this.description}))}stop(){this.pause(),this.audio.currentTime=0,this.widget.querySelector(".audio-widget-content").innerHTML="",this.interaction.emit(new n.ro({id:this.id,type:this.type,description:this.description}))}voiceControlPlay(){this.play()}voiceControlPause(){this.pause()}voiceControlRepeat(){this.voiceControlMessageElem.innerHTML+=this.utils.alert("alert-info",this.i18n.value("tta-info-audioterm"))}voiceControlSelect(){this.button.click()}voiceControlStop(){this.stop()}};h=__decorate([(0,i.x)({selector:".widget-audio"}),__metadata("design:paramtypes",[r.A,c.A,a.A,l.A])],h);const u=h},19412:(t,o,e)=>{e.d(o,{A:()=>Element});var i=e(16126),n=e(3605),__awaiter=function(t,o,e,i){return new(e||(e=Promise))((function(n,s){function fulfilled(t){try{step(i.next(t))}catch(t){s(t)}}function rejected(t){try{step(i.throw(t))}catch(t){s(t)}}function step(t){t.done?n(t.value):function adopt(t){return t instanceof e?t:new e((function(o){o(t)}))}(t.value).then(fulfilled,rejected)}step((i=i.apply(t,o||[])).next())}))};class Element{constructor(t,o,e){this.voiceControl=t,this.utils=o,this.i18n=e,this._activityNumber=0}init(){return __awaiter(this,void 0,void 0,(function*(){if(!this._widget)throw new Error("ElementHTML widget has not been set.");this.voiceControlMessageElem=this.widget.querySelector(".tta-message"),this.voiceControlButton=document.querySelector(`#speech-to-action-${this.id}`),this.voiceControlButton&&(this.voiceControlButton.addEventListener("click",(()=>{if(this.voiceControl.currentTarget!==this.id){for(;this.voiceControl.numTargets>1;)this.voiceControl.popTarget();return this._parent&&this.voiceControl.addTarget(this._parent.id),void this.voiceControl.addTarget(this.id)}this.voiceControl.popTarget(),this.voiceControlButton&&this.toggleVoiceControlButton(!1)})),this.voiceControl.voiceControlTargetChanged.subscribe((t=>{this.id===t.old&&this.toggleVoiceControlButton(!1),this.id===t.new&&this.toggleVoiceControlButton(!0)})),this.voiceControl.voiceControlActions.pipe((0,i.p)((t=>t.target===this.id))).subscribe((t=>{t instanceof n.m6?this.voiceControlStart():t instanceof n.$q?this.voiceControlFinish():t instanceof n.DZ?this.voiceControlNext():t instanceof n.vZ?this.voiceControlPrevious():t instanceof n.Fd?this.voiceControlGoto(t.position):t instanceof n.V3?this.voiceControlBack():t instanceof n.gZ?this.voiceControlSelect():t instanceof n.CG?this.voiceControlClose():t instanceof n.sT?this.voiceControlCheck():t instanceof n.XR?this.voiceControlCurrent():t instanceof n.B$?this.voiceControlDelete():t instanceof n._R?this.voiceControlMaximize():t instanceof n.EZ?this.voiceControlMinimize():t instanceof n.$V?this.voiceControlMove(t.position):t instanceof n.ow?this.voiceControlPause():t instanceof n.OR?this.voiceControlPlay():t instanceof n.pr?this.voiceControlRepeat():t instanceof n.lR?this.voiceControlReset():t instanceof n.m6?this.voiceControlStart():t instanceof n.o3?this.voiceControlStop():t instanceof n.HU?this.voiceControlWrite(t.text):t instanceof n.kw&&this.voiceControlUnknown()})))}))}get description(){return this.widget.dataset.desc||""}get id(){return this.widget.id}get type(){return this.widget.dataset.type||""}get widget(){return this._widget}set widget(t){this._widget=t}get parent(){return this._parent}set parent(t){this._parent=t}set activityNumber(t){this._activityNumber=t,this.voiceControlButton&&(this.voiceControlButton.innerHTML+=`<span class="element-number">${this.i18n.value("tta-activity-number")} ${t}</span>`)}toggleHighlight(t){this.widget.classList.toggle("speech-focused",t)}toggleVoiceControlButton(t){if(this.voiceControlButton){const o=this.voiceControlButton.querySelector("svg");o&&(o.classList.toggle("fa-head-side-cough",t),o.classList.toggle("fa-head-side-cough-slash",!t))}}showVoiceControlButton(){this.voiceControlButton&&(this.voiceControlButton.classList.add("show"),this.toggleVoiceControlButton(!1))}hideVoiceControlButton(){this.voiceControlButton&&this.voiceControlButton.classList.remove("show")}voiceControlStart(){this.toggleVoiceControlButton(!0)}voiceControlFinish(){this.voiceControl.popTarget(),this.toggleVoiceControlButton(!1)}voiceControlClose(){this.voiceControlUnknown()}voiceControlCheck(){this.voiceControlUnknown()}voiceControlCurrent(){this.voiceControlUnknown()}voiceControlDelete(){this.voiceControlUnknown()}voiceControlMaximize(){this.voiceControlUnknown()}voiceControlMinimize(){this.voiceControlUnknown()}voiceControlMove(t){this.voiceControlUnknown()}voiceControlPause(){this.voiceControlUnknown()}voiceControlPlay(){this.voiceControlUnknown()}voiceControlRepeat(){this.voiceControlUnknown()}voiceControlReset(){this.voiceControlUnknown()}voiceControlStop(){this.voiceControlUnknown()}voiceControlWrite(t){this.voiceControlUnknown()}voiceControlNext(){this.voiceControlUnknown()}voiceControlPrevious(){this.voiceControlUnknown()}voiceControlGoto(t){this.voiceControlUnknown()}voiceControlBack(){this.voiceControlUnknown()}voiceControlSelect(){this.voiceControlUnknown()}voiceControlUnknown(){this.voiceControlMessageElem.innerHTML+=this.utils.alert("alert-danger",this.i18n.value("tta-error-message"))}}}}]);