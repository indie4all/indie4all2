"use strict";(self.webpackChunkCDN=self.webpackChunkCDN||[]).push([[9634,7523],{98057:(t,e,s)=>{s.r(e),s.d(e,{default:()=>y});var i=s(16492),n=s(75015),r=s(73938),o=s(16126),c=s(97523),a=s(44295),d=s(35999),u=s(28147),h=s(57835),l=s(5513),f=s.n(l);class SentenceOrderItemGamificationElement extends h.A{init(t){super.init(t),this.data=JSON.parse(this.utils.b64DecodeUnicode(this.sentence.dataset.content));const e=this.sentence.querySelector(".source-words"),s=this.data.words.map(((t,e)=>f()({id:this.id,pos:e,word:t})));this.utils.shuffle(this.data.words),e.querySelectorAll("td").forEach(((t,e)=>t.innerHTML=s[e]))}check(){}reset(){this.coordinates=[0,0],this.sentence.querySelectorAll(".drag-word-item").forEach((t=>{t.setAttribute("tabindex",""===t.textContent?"-1":""),t.classList.remove("focused")}));const t=Array.from(this.sentence.querySelectorAll(".word-item"));t.forEach(((t,e)=>t.setAttribute("tabindex",0===e?"0":"-1"))),this.sentence.querySelectorAll(".source-words").forEach((e=>{e.querySelectorAll("td").forEach(((e,s)=>e.append(t[s])))}))}get score(){const t=Array.from(this.sentence.querySelectorAll(".target-words .word-item")).map((t=>t.textContent.trim()));return this.data.solutions.some((e=>e.split(/\s+/).every(((e,s)=>e===t[s]))))?1:0}}var p=s(70583),m=s(61709),__decorate=function(t,e,s,i){var n,r=arguments.length,o=r<3?e:null===i?i=Object.getOwnPropertyDescriptor(e,s):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)o=Reflect.decorate(t,e,s,i);else for(var c=t.length-1;c>=0;c--)(n=t[c])&&(o=(r<3?n(o):r>3?n(e,s,o):n(e,s))||o);return r>3&&o&&Object.defineProperty(e,s,o),o},__metadata=function(t,e){if("object"==typeof Reflect&&"function"==typeof Reflect.metadata)return Reflect.metadata(t,e)},__awaiter=function(t,e,s,i){return new(s||(s=Promise))((function(n,r){function fulfilled(t){try{step(i.next(t))}catch(t){r(t)}}function rejected(t){try{step(i.throw(t))}catch(t){r(t)}}function step(t){t.done?n(t.value):function adopt(t){return t instanceof s?t:new s((function(e){e(t)}))}(t.value).then(fulfilled,rejected)}step((i=i.apply(t,e||[])).next())}))};let g=class SentenceOrderGamificationElement extends u.A{constructor(t,e,s,i,n){super(s,e,t),this.i18n=t,this.utils=e,this.voiceControl=s,this.interaction=i,this.gamification=n}init(){const t=Object.create(null,{init:{get:()=>super.init}});return __awaiter(this,void 0,void 0,(function*(){yield t.init.call(this),this.sentences=Array.from(this.widget.querySelectorAll(".widget-sentence-order-item")).map((t=>{const e=new SentenceOrderItemGamificationElement(this.i18n,this.utils);return e.init(t),e})),this.gamification.gamificationEvents.pipe((0,o.p)((t=>t instanceof r.an))).subscribe((t=>{const e=this.widget.querySelector(".btn-check-answer");e.checkVisibility&&(e.disabled=!0)}))}))}check(){const t=this.sentences.map((t=>t.score)),e=t.reduce(((t,e)=>t+e),0)/t.length;this.interaction.emit(new n.sV({id:this.id,type:this.type,description:this.description,score:e})),1===e&&this.interaction.emit(new n.yz({id:this.id,type:this.type,description:this.description}));this.widget.querySelector(".btn-check-answer").disabled=!0}reset(){this.sentences.forEach((t=>t.reset()))}};g=__decorate([(0,i.x)({selector:".widget-sentence-order"}),__metadata("design:paramtypes",[a.A,p.A,m.A,d.A,c.default])],g);const y=g},97523:(t,e,s)=>{s.r(e),s.d(e,{default:()=>d});var i=s(65360),n=s(96107),r=s(94442),o=s(37115),c=s(35999),__decorate=function(t,e,s,i){var n,r=arguments.length,o=r<3?e:null===i?i=Object.getOwnPropertyDescriptor(e,s):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)o=Reflect.decorate(t,e,s,i);else for(var c=t.length-1;c>=0;c--)(n=t[c])&&(o=(r<3?n(o):r>3?n(e,s,o):n(e,s))||o);return r>3&&o&&Object.defineProperty(e,s,o),o},__metadata=function(t,e){if("object"==typeof Reflect&&"function"==typeof Reflect.metadata)return Reflect.metadata(t,e)},__awaiter=function(t,e,s,i){return new(s||(s=Promise))((function(n,r){function fulfilled(t){try{step(i.next(t))}catch(t){r(t)}}function rejected(t){try{step(i.throw(t))}catch(t){r(t)}}function step(t){t.done?n(t.value):function adopt(t){return t instanceof s?t:new s((function(e){e(t)}))}(t.value).then(fulfilled,rejected)}step((i=i.apply(t,e||[])).next())}))};let a=class GamificationService{constructor(t){this.interaction=t,this._code="test",this._scoresHistory=[],this.gamificationSubject=new n.B,this.gamificationEvents$=this.gamificationSubject.asObservable(),this.studentsChangedSubject=new r.m(1),this.studentsChanged$=this.studentsChangedSubject.asObservable()}get gamificationEvents(){return this.gamificationEvents$}get finalScores(){const t=this.scoresHistory[this.step],e=this.students.map((e=>{const s=t.find((t=>t.id===e.id)),i=this.scoresHistory.map((t=>{var s;return(null===(s=t.find((t=>t.id===e.id)))||void 0===s?void 0:s.points)||0})).reduce(((t,e)=>t+e),0);return{id:e.id,name:e.name,time:(null==s?void 0:s.time)||0,points:(null==s?void 0:s.points)||0,correct:(null==s?void 0:s.correct)||!1,total:i}}));return e.sort(((t,e)=>e.total-t.total)),e}get scoresHistory(){return this._scoresHistory||(this._scoresHistory=JSON.parse(sessionStorage.getItem(this._code+"-scores"))||[]),this._scoresHistory}set scoresHistory(t){this._scoresHistory=t,sessionStorage.setItem(this._code+"-scores",JSON.stringify(t))}get activity(){return this._activity}set activity(t){this._activity=t}get code(){return this._code}set code(t){this._code=t}get user(){return this._user||(this._user=JSON.parse(sessionStorage.getItem(this._code+"-user"))),this._user}set user(t){this._user=t,sessionStorage.setItem(this._code+"-user",JSON.stringify(t))}get socket(){return this._socket}set socket(t){this._socket=t}get step(){return"number"!=typeof this._step&&(this._step=JSON.parse(sessionStorage.getItem(this._code+"-step"))||0),this._step}set step(t){this._step=t,sessionStorage.setItem(this._code+"-step",JSON.stringify(t))}get students(){return this._students||(this._students=JSON.parse(sessionStorage.getItem(this._code+"-students"))||[],this.studentsChangedSubject.next(this._students)),this._students.forEach((t=>{var e;return t.answered=void 0!==(null===(e=this.scoresHistory[this.step])||void 0===e?void 0:e.find((e=>e.id===t.id))),t})),this._students}set students(t){this._students=t,sessionStorage.setItem(this._code+"-students",JSON.stringify(t)),this.studentsChangedSubject.next(t)}get studentsChanged(){return this.studentsChanged$}join(){this._socket.emit("join-room",this._code,this.user.id,{username:this.user.name})}init(){return __awaiter(this,void 0,void 0,(function*(){this._socket=(0,o.io)("http://cpcdpruebas.upct.es:3000",{forceNew:!0})}))}};a=__decorate([(0,i.k)({global:!0}),__metadata("design:paramtypes",[c.A])],a);const d=a},73938:(t,e,s)=>{s.d(e,{$Y:()=>GamificationResultEvent,an:()=>GamificationTeacherStopEvent,aq:()=>GamificationTeacherFinishedEvent,tS:()=>GamificationTeacherAckEvent,wU:()=>GamificationTeacherNextActivityEvent});class GamificationEvent{}class GamificationTeacherAckEvent extends GamificationEvent{get step(){return this._step}set step(t){this._step=t}get questions(){return this._questions}set questions(t){this._questions=t}}class GamificationTeacherStopEvent extends GamificationEvent{}class GamificationResultEvent{constructor(t=[]){this._info=t}get info(){return this._info}}class GamificationTeacherNextActivityEvent extends GamificationResultEvent{}class GamificationTeacherFinishedEvent extends GamificationResultEvent{}}}]);