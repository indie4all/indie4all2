(self.webpackChunkCDN=self.webpackChunkCDN||[]).push([[6957],{11987:(t,e,o)=>{var i=o(93633);t.exports=(i.default||i).template({compiler:[8,">= 4.3.0"],main:function(t,e,o,i,n){var s,l=null!=e?e:t.nullContext||{},c=t.hooks.helperMissing,r="function",a=t.escapeExpression,h=t.lookupProperty||function(t,e){if(Object.prototype.hasOwnProperty.call(t,e))return t[e]};return'<input id="piece-'+a(typeof(s=null!=(s=h(o,"id")||(null!=e?h(e,"id"):e))?s:c)===r?s.call(l,{name:"id",hash:{},data:n,loc:{start:{line:1,column:17},end:{line:1,column:23}}}):s)+"-"+a(typeof(s=null!=(s=h(o,"pos")||(null!=e?h(e,"pos"):e))?s:c)===r?s.call(l,{name:"pos",hash:{},data:n,loc:{start:{line:1,column:24},end:{line:1,column:31}}}):s)+'" \r\n  class="piece img-responsive" type="image" alt="'+a(typeof(s=null!=(s=h(o,"alt")||(null!=e?h(e,"alt"):e))?s:c)===r?s.call(l,{name:"alt",hash:{},data:n,loc:{start:{line:2,column:49},end:{line:2,column:56}}}):s)+'" \r\n  aria-disabled="false" data-alt="'+a(typeof(s=null!=(s=h(o,"alt")||(null!=e?h(e,"alt"):e))?s:c)===r?s.call(l,{name:"alt",hash:{},data:n,loc:{start:{line:3,column:34},end:{line:3,column:41}}}):s)+'" data-img="'+a(typeof(s=null!=(s=h(o,"altImg")||(null!=e?h(e,"altImg"):e))?s:c)===r?s.call(l,{name:"altImg",hash:{},data:n,loc:{start:{line:3,column:53},end:{line:3,column:63}}}):s)+'" src="'+a(typeof(s=null!=(s=h(o,"url")||(null!=e?h(e,"url"):e))?s:c)===r?s.call(l,{name:"url",hash:{},data:n,loc:{start:{line:3,column:70},end:{line:3,column:77}}}):s)+'" />'},useData:!0})},16492:(t,e,o)=>{"use strict";o.d(e,{x:()=>Widget});var i=o(7181),n=o(40561);function Widget(t){const e=i.Ay.get(n.default);return function(o){e.registerWidget(t.selector,o)}}},6957:(t,e,o)=>{"use strict";o.r(e),o.d(e,{default:()=>v});var i=o(16492),n=o(75015),s=o(44295),l=o(11987),c=o.n(l),r=o(19412),a=o(70583),h=o(35999),u=o(61709),__decorate=function(t,e,o,i){var n,s=arguments.length,l=s<3?e:null===i?i=Object.getOwnPropertyDescriptor(e,o):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)l=Reflect.decorate(t,e,o,i);else for(var c=t.length-1;c>=0;c--)(n=t[c])&&(l=(s<3?n(l):s>3?n(e,o,l):n(e,o))||l);return s>3&&l&&Object.defineProperty(e,o,l),l},__metadata=function(t,e){if("object"==typeof Reflect&&"function"==typeof Reflect.metadata)return Reflect.metadata(t,e)},__awaiter=function(t,e,o,i){return new(o||(o=Promise))((function(n,s){function fulfilled(t){try{step(i.next(t))}catch(t){s(t)}}function rejected(t){try{step(i.throw(t))}catch(t){s(t)}}function step(t){t.done?n(t.value):function adopt(t){return t instanceof o?t:new o((function(e){e(t)}))}(t.value).then(fulfilled,rejected)}step((i=i.apply(t,e||[])).next())}))};let d=class AnimationElement extends r.A{constructor(t,e,o,i){super(i,e,t),this.i18n=t,this.utils=e,this.interaction=o,this.voiceControl=i}clipRect(t,e,o){const i=this.i18n.value("animation-show-element",{pos:o+1}),n=getComputedStyle(this.widget.querySelector("[id^=heading-]")),s=n["font-family"],l=n.color,r=t.getImageData(e.x,e.y,e.w,e.h),a=document.createElement("canvas");a.width=e.w,a.height=e.h;return a.getContext("2d").putImageData(r,0,0),t.beginPath(),t.font="bold 35px "+s,t.fillStyle="white",t.strokeStyle=l,t.lineWidth=4,t.fillRect(e.x,e.y,e.w,e.h),t.rect(e.x+4,e.y+4,e.w-8,e.h-8),t.stroke(),t.textAlign="center",t.textBaseline="middle",t.fillStyle=l,t.fillText((o+1).toString(),e.x+e.w/2,e.y+2+e.h/2),t.closePath(),c()({alt:i,altImg:e.altImg,id:this.id,pos:o,url:a.toDataURL()})}onImageLoaded(t){this.widget.querySelector(".interactive-layer").setAttribute("viewBox",`0 0 ${t.width} ${t.height}`),this.canvas=document.createElement("canvas"),this.canvas.width=t.width,this.canvas.height=t.height;const e=this.canvas.getContext("2d",{willReadFrequently:!0});e.fillStyle="white",e.fillRect(0,0,this.canvas.width,this.canvas.height),e.drawImage(t,0,0),e.fillStyle="#fff";const o=this.rects.map(((t,o)=>this.clipRect(e,t,o)));this.widget.querySelectorAll(".piece-wrapper").forEach(((t,e)=>t.innerHTML+=o[e])),this.background.src=this.canvas.toDataURL("image/jpeg"),this.pieces=Array.from(this.widget.querySelectorAll(".piece")),this.widget.addEventListener("click",(t=>{if(t.target instanceof HTMLElement){const o=t.target.closest(".piece");if(o){if(o.classList.contains("show"))return;const t=this.pieces.indexOf(o),i=this.rects[t];e.fillStyle="white",e.fillRect(i.x,i.y,i.w,i.h),this.background.setAttribute("src",this.canvas.toDataURL("image/jpeg")),o.alt=o.dataset.img,o.setAttribute("aria-disabled","true"),o.classList.add("show"),this.pieces.every((t=>t.classList.contains("show")))&&this.interaction.emit(new n.yz({id:this.id,type:this.type,description:this.description}))}}}))}init(){const t=Object.create(null,{init:{get:()=>super.init}});return __awaiter(this,void 0,void 0,(function*(){yield t.init.call(this),this.background=this.widget.querySelector(".puzzle-background"),this.rects=Array.from(JSON.parse(this.utils.b64DecodeUnicode(this.widget.dataset.content)));const e=new Image;e.addEventListener("load",(t=>this.onImageLoaded(e))),e.src=this.background.dataset.src,e.crossOrigin="anonymous",this.widget.addEventListener("click",(t=>{t.target instanceof HTMLElement&&t.target.classList.contains("btn-reset")&&this.reset()}))}))}reset(){this.pieces.map((t=>{t.classList.remove("show"),t.alt=t.dataset.alt,t.setAttribute("aria-disabled","false")})),this.rects.map(((t,e)=>this.clipRect(this.canvas.getContext("2d"),t,e))),this.background.setAttribute("src",this.canvas.toDataURL("image/jpeg"))}voiceControlStart(){super.voiceControlStart(),this.voiceControlGoto(0)}voiceControlGoto(t){this.pieces[this.utils.mod(t,this.pieces.length)].focus()}voiceControlNext(){const t=this.pieces.indexOf(this.widget.querySelector(".piece:focus"));this.voiceControlGoto(t+1)}voiceControlPrevious(){const t=this.pieces.indexOf(this.widget.querySelector(".piece:focus"));this.voiceControlGoto(t-1)}voiceControlRepeat(){this.voiceControlMessageElem.innerHTML+=this.utils.alert("alert-info",this.i18n.value("tta-info-animation"))}voiceControlReset(){this.reset()}voiceControlSelect(){this.widget.querySelector(".piece:focus").click()}};d=__decorate([(0,i.x)({selector:".widget-animation"}),__metadata("design:paramtypes",[s.A,a.A,h.A,u.A])],d);const v=d},19412:(t,e,o)=>{"use strict";o.d(e,{A:()=>Element});var i=o(16126),n=o(3605),__awaiter=function(t,e,o,i){return new(o||(o=Promise))((function(n,s){function fulfilled(t){try{step(i.next(t))}catch(t){s(t)}}function rejected(t){try{step(i.throw(t))}catch(t){s(t)}}function step(t){t.done?n(t.value):function adopt(t){return t instanceof o?t:new o((function(e){e(t)}))}(t.value).then(fulfilled,rejected)}step((i=i.apply(t,e||[])).next())}))};class Element{constructor(t,e,o){this.voiceControl=t,this.utils=e,this.i18n=o,this._activityNumber=0}init(){return __awaiter(this,void 0,void 0,(function*(){if(!this._widget)throw new Error("ElementHTML widget has not been set.");this.voiceControlMessageElem=this.widget.querySelector(".tta-message"),this.voiceControlButton=document.querySelector(`#speech-to-action-${this.id}`),this.voiceControlButton&&(this.voiceControlButton.addEventListener("click",(()=>{if(this.voiceControl.currentTarget!==this.id){for(;this.voiceControl.numTargets>1;)this.voiceControl.popTarget();return this._parent&&this.voiceControl.addTarget(this._parent.id),void this.voiceControl.addTarget(this.id)}this.voiceControl.popTarget(),this.voiceControlButton&&this.toggleVoiceControlButton(!1)})),this.voiceControl.voiceControlTargetChanged.subscribe((t=>{this.id===t.old&&this.toggleVoiceControlButton(!1),this.id===t.new&&this.toggleVoiceControlButton(!0)})),this.voiceControl.voiceControlActions.pipe((0,i.p)((t=>t.target===this.id))).subscribe((t=>{t instanceof n.m6?this.voiceControlStart():t instanceof n.$q?this.voiceControlFinish():t instanceof n.DZ?this.voiceControlNext():t instanceof n.vZ?this.voiceControlPrevious():t instanceof n.Fd?this.voiceControlGoto(t.position):t instanceof n.V3?this.voiceControlBack():t instanceof n.gZ?this.voiceControlSelect():t instanceof n.CG?this.voiceControlClose():t instanceof n.sT?this.voiceControlCheck():t instanceof n.XR?this.voiceControlCurrent():t instanceof n.B$?this.voiceControlDelete():t instanceof n._R?this.voiceControlMaximize():t instanceof n.EZ?this.voiceControlMinimize():t instanceof n.$V?this.voiceControlMove(t.position):t instanceof n.ow?this.voiceControlPause():t instanceof n.OR?this.voiceControlPlay():t instanceof n.pr?this.voiceControlRepeat():t instanceof n.lR?this.voiceControlReset():t instanceof n.m6?this.voiceControlStart():t instanceof n.o3?this.voiceControlStop():t instanceof n.HU?this.voiceControlWrite(t.text):t instanceof n.kw&&this.voiceControlUnknown()})))}))}get description(){return this.widget.dataset.desc||""}get id(){return this.widget.id}get type(){return this.widget.dataset.type||""}get widget(){return this._widget}set widget(t){this._widget=t}get parent(){return this._parent}set parent(t){this._parent=t}set activityNumber(t){this._activityNumber=t,this.voiceControlButton&&(this.voiceControlButton.innerHTML+=`<span class="element-number">${this.i18n.value("tta-activity-number")} ${t}</span>`)}toggleHighlight(t){this.widget.classList.toggle("speech-focused",t)}toggleVoiceControlButton(t){if(this.voiceControlButton){const e=this.voiceControlButton.querySelector("svg");e&&(e.classList.toggle("fa-head-side-cough",t),e.classList.toggle("fa-head-side-cough-slash",!t))}}showVoiceControlButton(){this.voiceControlButton&&(this.voiceControlButton.classList.add("show"),this.toggleVoiceControlButton(!1))}hideVoiceControlButton(){this.voiceControlButton&&this.voiceControlButton.classList.remove("show")}voiceControlStart(){this.toggleVoiceControlButton(!0)}voiceControlFinish(){this.voiceControl.popTarget(),this.toggleVoiceControlButton(!1)}voiceControlClose(){this.voiceControlUnknown()}voiceControlCheck(){this.voiceControlUnknown()}voiceControlCurrent(){this.voiceControlUnknown()}voiceControlDelete(){this.voiceControlUnknown()}voiceControlMaximize(){this.voiceControlUnknown()}voiceControlMinimize(){this.voiceControlUnknown()}voiceControlMove(t){this.voiceControlUnknown()}voiceControlPause(){this.voiceControlUnknown()}voiceControlPlay(){this.voiceControlUnknown()}voiceControlRepeat(){this.voiceControlUnknown()}voiceControlReset(){this.voiceControlUnknown()}voiceControlStop(){this.voiceControlUnknown()}voiceControlWrite(t){this.voiceControlUnknown()}voiceControlNext(){this.voiceControlUnknown()}voiceControlPrevious(){this.voiceControlUnknown()}voiceControlGoto(t){this.voiceControlUnknown()}voiceControlBack(){this.voiceControlUnknown()}voiceControlSelect(){this.voiceControlUnknown()}voiceControlUnknown(){this.voiceControlMessageElem.innerHTML+=this.utils.alert("alert-danger",this.i18n.value("tta-error-message"))}}}}]);