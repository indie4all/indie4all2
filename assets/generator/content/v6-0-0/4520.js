"use strict";(self.webpackChunkCDN=self.webpackChunkCDN||[]).push([[4520],{16492:(t,e,i)=>{i.d(e,{x:()=>Widget});var o=i(7181),n=i(40561);function Widget(t){const e=o.Ay.get(n.default);return function(i){e.registerWidget(t.selector,i)}}},4633:(t,e,i)=>{function isCheckableElement(t){return"check"in t&&"reset"in t}i.d(e,{n:()=>isCheckableElement})},19412:(t,e,i)=>{i.d(e,{A:()=>Element});var o=i(16126),n=i(3605),__awaiter=function(t,e,i,o){return new(i||(i=Promise))((function(n,s){function fulfilled(t){try{step(o.next(t))}catch(t){s(t)}}function rejected(t){try{step(o.throw(t))}catch(t){s(t)}}function step(t){t.done?n(t.value):function adopt(t){return t instanceof i?t:new i((function(e){e(t)}))}(t.value).then(fulfilled,rejected)}step((o=o.apply(t,e||[])).next())}))};class Element{constructor(t,e,i){this.voiceControl=t,this.utils=e,this.i18n=i,this._activityNumber=0}init(){return __awaiter(this,void 0,void 0,(function*(){if(!this._widget)throw new Error("ElementHTML widget has not been set.");this.voiceControlMessageElem=this.widget.querySelector(".tta-message"),this.voiceControlButton=document.querySelector(`#speech-to-action-${this.id}`),this.voiceControlButton&&(this.voiceControlButton.addEventListener("click",(()=>{if(this.voiceControl.currentTarget!==this.id){for(;this.voiceControl.numTargets>1;)this.voiceControl.popTarget();return this._parent&&this.voiceControl.addTarget(this._parent.id),void this.voiceControl.addTarget(this.id)}this.voiceControl.popTarget(),this.voiceControlButton&&this.toggleVoiceControlButton(!1)})),this.voiceControl.voiceControlTargetChanged.subscribe((t=>{this.id===t.old&&this.toggleVoiceControlButton(!1),this.id===t.new&&this.toggleVoiceControlButton(!0)})),this.voiceControl.voiceControlActions.pipe((0,o.p)((t=>t.target===this.id))).subscribe((t=>{t instanceof n.m6?this.voiceControlStart():t instanceof n.$q?this.voiceControlFinish():t instanceof n.DZ?this.voiceControlNext():t instanceof n.vZ?this.voiceControlPrevious():t instanceof n.Fd?this.voiceControlGoto(t.position):t instanceof n.V3?this.voiceControlBack():t instanceof n.gZ?this.voiceControlSelect():t instanceof n.CG?this.voiceControlClose():t instanceof n.sT?this.voiceControlCheck():t instanceof n.XR?this.voiceControlCurrent():t instanceof n.B$?this.voiceControlDelete():t instanceof n._R?this.voiceControlMaximize():t instanceof n.EZ?this.voiceControlMinimize():t instanceof n.$V?this.voiceControlMove(t.position):t instanceof n.ow?this.voiceControlPause():t instanceof n.OR?this.voiceControlPlay():t instanceof n.pr?this.voiceControlRepeat():t instanceof n.lR?this.voiceControlReset():t instanceof n.m6?this.voiceControlStart():t instanceof n.o3?this.voiceControlStop():t instanceof n.HU?this.voiceControlWrite(t.text):t instanceof n.kw&&this.voiceControlUnknown()})))}))}get description(){return this.widget.dataset.desc||""}get id(){return this.widget.id}get type(){return this.widget.dataset.type||""}get widget(){return this._widget}set widget(t){this._widget=t}get parent(){return this._parent}set parent(t){this._parent=t}set activityNumber(t){this._activityNumber=t,this.voiceControlButton&&(this.voiceControlButton.innerHTML+=`<span class="element-number">${this.i18n.value("tta-activity-number")} ${t}</span>`)}toggleHighlight(t){this.widget.classList.toggle("speech-focused",t)}toggleVoiceControlButton(t){if(this.voiceControlButton){const e=this.voiceControlButton.querySelector("svg");e&&(e.classList.toggle("fa-head-side-cough",t),e.classList.toggle("fa-head-side-cough-slash",!t))}}showVoiceControlButton(){this.voiceControlButton&&(this.voiceControlButton.classList.add("show"),this.toggleVoiceControlButton(!1))}hideVoiceControlButton(){this.voiceControlButton&&this.voiceControlButton.classList.remove("show")}voiceControlStart(){this.toggleVoiceControlButton(!0)}voiceControlFinish(){this.voiceControl.popTarget(),this.toggleVoiceControlButton(!1)}voiceControlClose(){this.voiceControlUnknown()}voiceControlCheck(){this.voiceControlUnknown()}voiceControlCurrent(){this.voiceControlUnknown()}voiceControlDelete(){this.voiceControlUnknown()}voiceControlMaximize(){this.voiceControlUnknown()}voiceControlMinimize(){this.voiceControlUnknown()}voiceControlMove(t){this.voiceControlUnknown()}voiceControlPause(){this.voiceControlUnknown()}voiceControlPlay(){this.voiceControlUnknown()}voiceControlRepeat(){this.voiceControlUnknown()}voiceControlReset(){this.voiceControlUnknown()}voiceControlStop(){this.voiceControlUnknown()}voiceControlWrite(t){this.voiceControlUnknown()}voiceControlNext(){this.voiceControlUnknown()}voiceControlPrevious(){this.voiceControlUnknown()}voiceControlGoto(t){this.voiceControlUnknown()}voiceControlBack(){this.voiceControlUnknown()}voiceControlSelect(){this.voiceControlUnknown()}voiceControlUnknown(){this.voiceControlMessageElem.innerHTML+=this.utils.alert("alert-danger",this.i18n.value("tta-error-message"))}}},4520:(t,e,i)=>{i.r(e),i.d(e,{default:()=>v});var o=i(16492),n=i(75015),s=i(16126),r=i(4633),l=i(44295),c=i(35999),a=i(27171),h=i(70583),u=i(61709),__decorate=function(t,e,i,o){var n,s=arguments.length,r=s<3?e:null===o?o=Object.getOwnPropertyDescriptor(e,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(t,e,i,o);else for(var l=t.length-1;l>=0;l--)(n=t[l])&&(r=(s<3?n(r):s>3?n(e,i,r):n(e,i))||r);return s>3&&r&&Object.defineProperty(e,i,r),r},__metadata=function(t,e){if("object"==typeof Reflect&&"function"==typeof Reflect.metadata)return Reflect.metadata(t,e)},__awaiter=function(t,e,i,o){return new(i||(i=Promise))((function(n,s){function fulfilled(t){try{step(o.next(t))}catch(t){s(t)}}function rejected(t){try{step(o.throw(t))}catch(t){s(t)}}function step(t){t.done?n(t.value):function adopt(t){return t instanceof i?t:new i((function(e){e(t)}))}(t.value).then(fulfilled,rejected)}step((o=o.apply(t,e||[])).next())}))};let d=class RouletteContentElement extends a.A{constructor(t,e,i,o){super(o,e,t),this.i18n=t,this.utils=e,this.interaction=i,this.voiceControl=o,this.timerStarted=!1,this.totalCorrect=0,this.totalScore=0}feedback(){const t=this.i18n.value("roulette-finished")+" - "+this.i18n.value("TextNumberCorrect",{num:this.totalCorrect});this.widget.querySelector(".roulette-info").textContent=t}getQuestions(){return this.categories.flatMap(((t,e)=>Array.from(t.querySelectorAll(".roulette-question")).map(((t,i)=>({category:e,question:i}))))).sort((()=>Math.random()-.5)).slice(0,this.config.lifes)}initTimer(){if(!this.config.time)return;const t=new Date(Date.now()+1e3*this.config.time).getTime(),e=this.widget.querySelector(".roulette-timer"),updateTimer=()=>{const i=Date.now();if(i>t){clearInterval(this.intervalUpdateTimer),this.intervalUpdateTimer=null,e.innerHTML=this.i18n.value("roulette-timer",{time:"<time>00:00:00</time>",interpolation:{escapeValue:!1}});let t=this.i18n.value("roulette-finished")+" - "+this.i18n.value("TextNumberCorrect",{num:this.totalCorrect});this.widget.querySelector(".roulette-question").classList.remove("show"),this.elementsToHideWhenQuestion.forEach((t=>t.classList.remove("d-none"))),this.widget.querySelector(".roulette-info").textContent=t,this.widget.classList.add("finished");const i=this.widget.querySelector(".roulette-spin");i.disabled=!0,i.focus();return void(this.widget.querySelector(".btn-check-answer").disabled=!0)}const o=new Date(t-i).toISOString().substring(11,19);e.innerHTML=this.i18n.value("roulette-timer",{time:`<time>${o}</time>`,interpolation:{escapeValue:!1}})},warn=()=>{const e=Date.now();if(e>t)return clearInterval(this.intervalWarnUser),void(this.intervalWarnUser=null);const i=new Date(t-e).toISOString().substring(11,19);this.widget.querySelector(".roulette-timer-alert").innerHTML=this.i18n.value("roulette-timer",{time:`<time>${i}</time>`,interpolation:{escapeValue:!1}}),setTimeout((()=>this.widget.querySelector(".roulette-timer-alert").innerHTML=""),500)};this.intervalUpdateTimer=setInterval(updateTimer,1e3),this.intervalWarnUser=setInterval(warn,3e4),updateTimer(),warn(),e.classList.remove("d-none")}reset(){this.interaction.emit(new n.nz({id:this.id,type:this.type,description:this.description})),this._questions=this.getQuestions(),this.totalCorrect=0,this.totalScore=0,this.timerStarted=!1,this.children.forEach((t=>{(0,r.n)(t)&&t.reset()}));const t=this.widget.querySelector(".roulette-question.show");null==t||t.classList.remove("show"),this.widget.querySelector(".roulette-info").textContent="",this.widget.classList.remove("finished"),this.spinner.disabled=!1,this.spinner.focus(),this.lifes.forEach((t=>{t.classList.remove("fa-regular"),t.classList.add("fa-solid")})),this.lifesContainer.setAttribute("aria-label",this.i18n.value("roulette-lifes",{num:this.config.lifes})),this.circle.style.setProperty("--final","0deg"),this.widget.querySelector(".roulette-timer").classList.add("d-none"),this.intervalUpdateTimer&&(clearInterval(this.intervalUpdateTimer),this.intervalUpdateTimer=null),this.intervalWarnUser&&(clearInterval(this.intervalWarnUser),this.intervalWarnUser=null),this.elementsToHideWhenQuestion.forEach((t=>t.classList.remove("d-none")))}spin(){if(this.spinner.disabled=!0,!this.questions.length)return this.widget.classList.add("finished"),this.interaction.emit(new n.yz({id:this.id,type:this.type,description:this.description})),void this.feedback();const t=360/this.categories.length;this.timerStarted||(this.initTimer(),this.timerStarted=!0);const e=this.questions.pop();this.currentQuestion=this.categories[e.category].querySelectorAll(".roulette-question")[e.question];const i=this.lifes.find((t=>!t.classList.contains("fa-regular")));i.classList.add("fa-regular"),i.classList.remove("fa-solid"),this.lifesContainer.setAttribute("aria-label",this.i18n.value("roulette-lifes",{num:this.questions.length})),this.widget.querySelector(".roulette-info").textContent=this.i18n.value("roulette-spinning"),this.widget.querySelector(".roulette-question").classList.remove("show"),this.circle.style.animation="none",this.circle.offsetHeight,this.circle.style.animation=null;const o=(.8*Math.random()+.1)*t,s=7200+Math.round(e.category*t+o);this.circle.style.setProperty("--final",s+"deg"),this.circle.style.animation="rotateAndStop 5s ease-out forwards",this.circle.offsetHeight,this.circle.addEventListener("animationend",(()=>{this.spinner.disabled=!1,this.currentQuestion.classList.add("show"),this.currentQuestion.focus(),this.circle.style.setProperty("--final","0deg"),this.widget.querySelector(".roulette-info").textContent=this.i18n.value("roulette-category",{category:this.categories[e.category].dataset.name}),this.elementsToHideWhenQuestion.forEach((t=>t.classList.add("d-none")))}),{once:!0})}init(){const t=Object.create(null,{init:{get:()=>super.init}});return __awaiter(this,void 0,void 0,(function*(){yield t.init.call(this),this.config=JSON.parse(this.utils.b64DecodeUnicode(this.widget.dataset.content)),this._questions=this.getQuestions(),this.lifesContainer.setAttribute("aria-label",this.i18n.value("roulette-lifes",{num:this.config.lifes})),this.lifes.forEach(((t,e)=>t.classList.toggle("d-none",e>=this.questions.length))),this.widget.addEventListener("click",(t=>{t.target instanceof HTMLElement&&(t.target.closest(".roulette-spin")?this.spin():t.target.classList.contains("btn-roulette-reset")&&this.reset())})),this.interaction.getInteractions(n.yz).pipe((0,s.p)((t=>this.children.map((t=>t.id)).includes(t.id)))).subscribe((t=>{setTimeout((()=>{this.totalCorrect++,this.elementsToHideWhenQuestion.forEach((t=>t.classList.remove("d-none"))),this.spinner.focus(),this.currentQuestion.classList.remove("show")}),3e3),this.voiceControl.currentTarget===t.id&&this.voiceControl.popTarget()}))}))}};d=__decorate([(0,o.x)({selector:".widget-roulette"}),__metadata("design:paramtypes",[l.A,h.A,c.A,u.A])],d);const v=d},27171:(t,e,i)=>{i.d(e,{A:()=>RouletteElement});var o=i(46894),n=i(19412),__awaiter=function(t,e,i,o){return new(i||(i=Promise))((function(n,s){function fulfilled(t){try{step(o.next(t))}catch(t){s(t)}}function rejected(t){try{step(o.throw(t))}catch(t){s(t)}}function step(t){t.done?n(t.value):function adopt(t){return t instanceof i?t:new i((function(e){e(t)}))}(t.value).then(fulfilled,rejected)}step((o=o.apply(t,e||[])).next())}))};class RouletteElement extends((0,o.A)(n.A)){constructor(t,e,i){super(t,e,i),this.voiceControl=t,this.utils=e,this.i18n=i}get questions(){return this._questions}init(){const t=Object.create(null,{init:{get:()=>super.init}});return __awaiter(this,void 0,void 0,(function*(){yield t.init.call(this),this.spinner=this.widget.querySelector(".roulette-spin"),this.elementsToHideWhenQuestion=Array.from(this.widget.querySelectorAll(".container-roulette,.roulette-lifes,.roulette-heading")),this.categories=Array.from(this.widget.querySelectorAll(".roulette-category")),this.lifesContainer=this.widget.querySelector(".roulette-lifes"),this.circle=this.widget.querySelector(".roulette-circle"),this.lifes=Array.from(this.widget.querySelectorAll(".fa-heart")),this.widget.querySelector(".roulette-spinner-"+this.categories.length).classList.remove("d-none")}))}check(){}voiceControlRepeat(){this.voiceControlMessageElem.innerHTML+=this.utils.alert("alert-info",this.i18n.value("tta-info-containertest"))}voiceControlReset(){this.reset()}voiceControlSelect(){if(this.widget.querySelector(".roulette-spin").click(),this.currentQuestion){const t=this.children.find((t=>this.currentQuestion.contains(t.widget)));this.voiceControl.addTarget(t.id)}}}}}]);