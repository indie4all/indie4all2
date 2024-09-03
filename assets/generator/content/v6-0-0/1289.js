"use strict";(self.webpackChunkCDN=self.webpackChunkCDN||[]).push([[1289],{16492:(t,e,i)=>{i.d(e,{x:()=>Widget});var o=i(7181),n=i(40561);function Widget(t){const e=o.Ay.get(n.default);return function(i){e.registerWidget(t.selector,i)}}},19412:(t,e,i)=>{i.d(e,{A:()=>Element});var o=i(16126),n=i(3605),__awaiter=function(t,e,i,o){return new(i||(i=Promise))((function(n,s){function fulfilled(t){try{step(o.next(t))}catch(t){s(t)}}function rejected(t){try{step(o.throw(t))}catch(t){s(t)}}function step(t){t.done?n(t.value):function adopt(t){return t instanceof i?t:new i((function(e){e(t)}))}(t.value).then(fulfilled,rejected)}step((o=o.apply(t,e||[])).next())}))};class Element{constructor(t,e,i){this.voiceControl=t,this.utils=e,this.i18n=i,this._activityNumber=0}init(){return __awaiter(this,void 0,void 0,(function*(){if(!this._widget)throw new Error("ElementHTML widget has not been set.");this.voiceControlMessageElem=this.widget.querySelector(".tta-message"),this.voiceControlButton=document.querySelector(`#speech-to-action-${this.id}`),this.voiceControlButton&&(this.voiceControlButton.addEventListener("click",(()=>{if(this.voiceControl.currentTarget!==this.id){for(;this.voiceControl.numTargets>1;)this.voiceControl.popTarget();return this._parent&&this.voiceControl.addTarget(this._parent.id),void this.voiceControl.addTarget(this.id)}this.voiceControl.popTarget(),this.voiceControlButton&&this.toggleVoiceControlButton(!1)})),this.voiceControl.voiceControlTargetChanged.subscribe((t=>{this.id===t.old&&this.toggleVoiceControlButton(!1),this.id===t.new&&this.toggleVoiceControlButton(!0)})),this.voiceControl.voiceControlActions.pipe((0,o.p)((t=>t.target===this.id))).subscribe((t=>{t instanceof n.m6?this.voiceControlStart():t instanceof n.$q?this.voiceControlFinish():t instanceof n.DZ?this.voiceControlNext():t instanceof n.vZ?this.voiceControlPrevious():t instanceof n.Fd?this.voiceControlGoto(t.position):t instanceof n.V3?this.voiceControlBack():t instanceof n.gZ?this.voiceControlSelect():t instanceof n.CG?this.voiceControlClose():t instanceof n.sT?this.voiceControlCheck():t instanceof n.XR?this.voiceControlCurrent():t instanceof n.B$?this.voiceControlDelete():t instanceof n._R?this.voiceControlMaximize():t instanceof n.EZ?this.voiceControlMinimize():t instanceof n.$V?this.voiceControlMove(t.position):t instanceof n.ow?this.voiceControlPause():t instanceof n.OR?this.voiceControlPlay():t instanceof n.pr?this.voiceControlRepeat():t instanceof n.lR?this.voiceControlReset():t instanceof n.m6?this.voiceControlStart():t instanceof n.o3?this.voiceControlStop():t instanceof n.HU?this.voiceControlWrite(t.text):t instanceof n.kw&&this.voiceControlUnknown()})))}))}get description(){return this.widget.dataset.desc||""}get id(){return this.widget.id}get type(){return this.widget.dataset.type||""}get widget(){return this._widget}set widget(t){this._widget=t}get parent(){return this._parent}set parent(t){this._parent=t}set activityNumber(t){this._activityNumber=t,this.voiceControlButton&&(this.voiceControlButton.innerHTML+=`<span class="element-number">${this.i18n.value("tta-activity-number")} ${t}</span>`)}toggleHighlight(t){this.widget.classList.toggle("speech-focused",t)}toggleVoiceControlButton(t){if(this.voiceControlButton){const e=this.voiceControlButton.querySelector("svg");e&&(e.classList.toggle("fa-head-side-cough",t),e.classList.toggle("fa-head-side-cough-slash",!t))}}showVoiceControlButton(){this.voiceControlButton&&(this.voiceControlButton.classList.add("show"),this.toggleVoiceControlButton(!1))}hideVoiceControlButton(){this.voiceControlButton&&this.voiceControlButton.classList.remove("show")}voiceControlStart(){this.toggleVoiceControlButton(!0)}voiceControlFinish(){this.voiceControl.popTarget(),this.toggleVoiceControlButton(!1)}voiceControlClose(){this.voiceControlUnknown()}voiceControlCheck(){this.voiceControlUnknown()}voiceControlCurrent(){this.voiceControlUnknown()}voiceControlDelete(){this.voiceControlUnknown()}voiceControlMaximize(){this.voiceControlUnknown()}voiceControlMinimize(){this.voiceControlUnknown()}voiceControlMove(t){this.voiceControlUnknown()}voiceControlPause(){this.voiceControlUnknown()}voiceControlPlay(){this.voiceControlUnknown()}voiceControlRepeat(){this.voiceControlUnknown()}voiceControlReset(){this.voiceControlUnknown()}voiceControlStop(){this.voiceControlUnknown()}voiceControlWrite(t){this.voiceControlUnknown()}voiceControlNext(){this.voiceControlUnknown()}voiceControlPrevious(){this.voiceControlUnknown()}voiceControlGoto(t){this.voiceControlUnknown()}voiceControlBack(){this.voiceControlUnknown()}voiceControlSelect(){this.voiceControlUnknown()}voiceControlUnknown(){this.voiceControlMessageElem.innerHTML+=this.utils.alert("alert-danger",this.i18n.value("tta-error-message"))}}},31289:(t,e,i)=>{i.r(e),i.d(e,{default:()=>u});var o=i(16492),n=i(75015),s=i(19412),r=i(44295),c=i(35999),l=i(70583),h=i(61709),__decorate=function(t,e,i,o){var n,s=arguments.length,r=s<3?e:null===o?o=Object.getOwnPropertyDescriptor(e,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(t,e,i,o);else for(var c=t.length-1;c>=0;c--)(n=t[c])&&(r=(s<3?n(r):s>3?n(e,i,r):n(e,i))||r);return s>3&&r&&Object.defineProperty(e,i,r),r},__metadata=function(t,e){if("object"==typeof Reflect&&"function"==typeof Reflect.metadata)return Reflect.metadata(t,e)},__awaiter=function(t,e,i,o){return new(i||(i=Promise))((function(n,s){function fulfilled(t){try{step(o.next(t))}catch(t){s(t)}}function rejected(t){try{step(o.throw(t))}catch(t){s(t)}}function step(t){t.done?n(t.value):function adopt(t){return t instanceof i?t:new i((function(e){e(t)}))}(t.value).then(fulfilled,rejected)}step((o=o.apply(t,e||[])).next())}))};let a=class HangmanElement extends s.A{constructor(t,e,i,o){super(o,e,t),this.i18n=t,this.utils=e,this.interaction=i,this.voiceControl=o}check(){if(0==this.currentAttempts)return;let t=this.inputLetter.value.charAt(0).toUpperCase();if(this.inputLetter.value="",0==t.trim().length)return;if(this.currentLetters.has(t))return;this.currentLetters.add(t);let e=this.solution.split("").map(((t,e)=>({chr:t,pos:e}))).filter((e=>e.chr===t)).map((t=>t.pos));if(e.forEach((e=>this.widget.querySelector(".letter-"+(e+1)).textContent=t)),!e.length){this.widget.querySelector(".hangman-remaining-attempts").innerHTML=(this.currentAttempts-1).toString(),this.currentAttempts-=1,0===this.currentAttempts&&(this.widget.querySelector(".hangman-letter").setAttribute("disabled","disabled"),this.widget.querySelector(".btn-check-answer").setAttribute("disabled","disabled"),setTimeout((()=>{this.widget.querySelector(".text-result").textContent=this.i18n.value("TextIncorrectAnswer")}),150))}const i=document.createElement("i");i.setAttribute("aria-hidden","true"),i.classList.add("status","fas",e.length?"fa-check":"fa-times");const o=document.createElement("div");o.setAttribute("aria-live","polite"),o.classList.add("typed-letter",e.length?"text-success":"text-danger"),o.textContent=t,o.appendChild(i),setTimeout((()=>{const t=document.createElement("span");t.classList.add("visually-hidden"),t.textContent=e.length?this.i18n.value("hangman-correct-letter"):this.i18n.value("hangman-wrong-letter"),o.prepend(t)}),50),this.inputLetter.before(o),this.utils.isSuperset(this.currentLetters,this.solutionLetters)&&(this.widget.querySelector(".text-result").textContent=this.i18n.value("TextCorrectAnswer"),this.interaction.emit(new n.sV({id:this.id,type:this.type,description:this.description,score:1})),this.interaction.emit(new n.yz({id:this.id,type:this.type,description:this.description})))}init(){const t=Object.create(null,{init:{get:()=>super.init}});return __awaiter(this,void 0,void 0,(function*(){yield t.init.call(this),this.inputLetter=this.widget.querySelector(".hangman-letter");let{attempts:e,solution:i}=JSON.parse(this.utils.b64DecodeUnicode(this.widget.dataset.content));this.currentAttempts=this.attempts=e,this.solution=i.toUpperCase(),this.solutionLetters=new Set(i.split("").filter((t=>" "!==t))),this.currentLetters=new Set,this.widget.addEventListener("submit",(t=>{t.preventDefault(),this.check()})),this.widget.addEventListener("click",(t=>{t.target.classList.contains("btn-reset")&&this.reset()}))}))}reset(){this.interaction.emit(new n.nz({id:this.id,type:this.type,description:this.description}));this.widget.querySelector(".hangman-remaining-attempts").innerHTML=this.attempts.toString(),this.currentAttempts=this.attempts,this.currentLetters=new Set,this.widget.querySelector(".hangman-letter").removeAttribute("disabled"),this.widget.querySelector(".btn-check-answer").removeAttribute("disabled"),this.widget.querySelectorAll(".typed-letter").forEach((t=>t.remove())),this.widget.querySelectorAll(".letter").forEach(((t,e)=>{" "!==this.solution[e]&&(t.innerHTML=`\n                    <span class="visually-hidden">${this.i18n.value("hangman-blank")}</span>\n                    <span class="shown" aria-hidden="true">_</span>`)})),this.widget.querySelector(".text-result").textContent="",this.widget.querySelector(".hangman-letter").value=""}voiceControlRepeat(){this.voiceControlMessageElem.innerHTML+=this.utils.alert("alert-info",this.i18n.value("tta-info-hangman"))}voiceControlReset(){this.reset()}voiceControlWrite(t){this.inputLetter.value=t[0],this.check()}};a=__decorate([(0,o.x)({selector:".widget-hangman"}),__metadata("design:paramtypes",[r.A,l.A,c.A,h.A])],a);const u=a}}]);