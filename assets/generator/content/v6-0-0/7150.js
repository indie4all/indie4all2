"use strict";(self.webpackChunkCDN=self.webpackChunkCDN||[]).push([[7150],{77150:(t,e,i)=>{i.r(e),i.d(e,{default:()=>p});var n=i(16492),r=i(75015),s=i(7979),o=i(85631),c=i(44295),f=i(35999),d=i(70583),h=i(61709),l=i(45935),u=i.n(l),__decorate=function(t,e,i,n){var r,s=arguments.length,o=s<3?e:null===n?n=Object.getOwnPropertyDescriptor(e,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)o=Reflect.decorate(t,e,i,n);else for(var c=t.length-1;c>=0;c--)(r=t[c])&&(o=(s<3?r(o):s>3?r(e,i,o):r(e,i))||o);return s>3&&o&&Object.defineProperty(e,i,o),o},__metadata=function(t,e){if("object"==typeof Reflect&&"function"==typeof Reflect.metadata)return Reflect.metadata(t,e)},__awaiter=function(t,e,i,n){return new(i||(i=Promise))((function(r,s){function fulfilled(t){try{step(n.next(t))}catch(t){s(t)}}function rejected(t){try{step(n.throw(t))}catch(t){s(t)}}function step(t){t.done?r(t.value):function adopt(t){return t instanceof i?t:new i((function(e){e(t)}))}(t.value).then(fulfilled,rejected)}step((n=n.apply(t,e||[])).next())}))};let a=class DragDropGamificationElement extends o.A{constructor(t,e,i,n,r){super(t,e,i,n),this.i18n=t,this.utils=e,this.bootstrap=i,this.voiceControl=n,this.interaction=r}reset(){const t=this.widget.querySelector("tbody");t.innerHTML="",this.shuffledTerms.forEach(((e,i)=>{t.innerHTML+=u()({term:e.term,definition:e.definition,id:this.widget.id,position:i})}))}check(){const t=Array.from(this.widget.querySelectorAll(".drop-choice")),e=t.filter(((t,e)=>{const i=t.querySelector(".drag-term");if(!i)return!1;const n=this.shuffledTerms[e].definition,r=this.terms.findIndex((t=>t.term.trim()===i.textContent.trim()));return n===this.terms[r].definition})).length/t.length;this.interaction.emit(new r.sV({id:this.id,type:this.type,description:this.description,score:e})),1===e&&this.interaction.emit(new r.yz({id:this.id,type:this.type,description:this.description}))}init(){const t=Object.create(null,{init:{get:()=>super.init}});return __awaiter(this,void 0,void 0,(function*(){yield t.init.call(this),this.terms=JSON.parse(this.utils.b64DecodeUnicode(this.widget.dataset.content));const e=this.terms.map((t=>t.term)),i=this.terms.map((t=>t.definition));this.utils.shuffle(e),this.utils.shuffle(i),this.shuffledTerms=e.map(((t,e)=>({term:t,definition:i[e]})));const n=this.widget.querySelector("tbody");this.shuffledTerms.forEach(((t,e)=>{n.innerHTML+=u()({term:t.term,definition:t.definition,id:this.widget.id,position:e})})),this.rows=Array.from(n.querySelectorAll("tr"))}))}};a=__decorate([(0,n.x)({selector:".widget-drag-drop"}),__metadata("design:paramtypes",[c.A,d.A,s.A,h.A,f.A])],a);const p=a}}]);