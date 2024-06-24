/*! For license information please see 1983.js.LICENSE.txt */
(self.webpackChunkCDN=self.webpackChunkCDN||[]).push([[1983],{71983:(e,t,n)=>{var a=function(e){var t=/(?:^|\s)lang(?:uage)?-([\w-]+)(?=\s|$)/i,n=0,a={},r={manual:e.Prism&&e.Prism.manual,disableWorkerMessageHandler:e.Prism&&e.Prism.disableWorkerMessageHandler,util:{encode:function encode(e){return e instanceof Token?new Token(e.type,encode(e.content),e.alias):Array.isArray(e)?e.map(encode):e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/\u00a0/g," ")},type:function(e){return Object.prototype.toString.call(e).slice(8,-1)},objId:function(e){return e.__id||Object.defineProperty(e,"__id",{value:++n}),e.__id},clone:function deepClone(e,t){var n,a;switch(t=t||{},r.util.type(e)){case"Object":if(a=r.util.objId(e),t[a])return t[a];for(var i in n={},t[a]=n,e)e.hasOwnProperty(i)&&(n[i]=deepClone(e[i],t));return n;case"Array":return a=r.util.objId(e),t[a]?t[a]:(n=[],t[a]=n,e.forEach((function(e,a){n[a]=deepClone(e,t)})),n);default:return e}},getLanguage:function(e){for(;e;){var n=t.exec(e.className);if(n)return n[1].toLowerCase();e=e.parentElement}return"none"},setLanguage:function(e,n){e.className=e.className.replace(RegExp(t,"gi"),""),e.classList.add("language-"+n)},currentScript:function(){if("undefined"==typeof document)return null;if("currentScript"in document)return document.currentScript;try{throw new Error}catch(a){var e=(/at [^(\r\n]*\((.*):[^:]+:[^:]+\)$/i.exec(a.stack)||[])[1];if(e){var t=document.getElementsByTagName("script");for(var n in t)if(t[n].src==e)return t[n]}return null}},isActive:function(e,t,n){for(var a="no-"+t;e;){var r=e.classList;if(r.contains(t))return!0;if(r.contains(a))return!1;e=e.parentElement}return!!n}},languages:{plain:a,plaintext:a,text:a,txt:a,extend:function(e,t){var n=r.util.clone(r.languages[e]);for(var a in t)n[a]=t[a];return n},insertBefore:function(e,t,n,a){var i=(a=a||r.languages)[e],l={};for(var o in i)if(i.hasOwnProperty(o)){if(o==t)for(var s in n)n.hasOwnProperty(s)&&(l[s]=n[s]);n.hasOwnProperty(o)||(l[o]=i[o])}var u=a[e];return a[e]=l,r.languages.DFS(r.languages,(function(t,n){n===u&&t!=e&&(this[t]=l)})),l},DFS:function DFS(e,t,n,a){a=a||{};var i=r.util.objId;for(var l in e)if(e.hasOwnProperty(l)){t.call(e,l,e[l],n||l);var o=e[l],s=r.util.type(o);"Object"!==s||a[i(o)]?"Array"!==s||a[i(o)]||(a[i(o)]=!0,DFS(o,t,l,a)):(a[i(o)]=!0,DFS(o,t,null,a))}}},plugins:{},highlightAll:function(e,t){r.highlightAllUnder(document,e,t)},highlightAllUnder:function(e,t,n){var a={callback:n,container:e,selector:'code[class*="language-"], [class*="language-"] code, code[class*="lang-"], [class*="lang-"] code'};r.hooks.run("before-highlightall",a),a.elements=Array.prototype.slice.apply(a.container.querySelectorAll(a.selector)),r.hooks.run("before-all-elements-highlight",a);for(var i,l=0;i=a.elements[l++];)r.highlightElement(i,!0===t,a.callback)},highlightElement:function(t,n,a){var i=r.util.getLanguage(t),l=r.languages[i];r.util.setLanguage(t,i);var o=t.parentElement;o&&"pre"===o.nodeName.toLowerCase()&&r.util.setLanguage(o,i);var s={element:t,language:i,grammar:l,code:t.textContent};function insertHighlightedCode(e){s.highlightedCode=e,r.hooks.run("before-insert",s),s.element.innerHTML=s.highlightedCode,r.hooks.run("after-highlight",s),r.hooks.run("complete",s),a&&a.call(s.element)}if(r.hooks.run("before-sanity-check",s),(o=s.element.parentElement)&&"pre"===o.nodeName.toLowerCase()&&!o.hasAttribute("tabindex")&&o.setAttribute("tabindex","0"),!s.code)return r.hooks.run("complete",s),void(a&&a.call(s.element));if(r.hooks.run("before-highlight",s),s.grammar)if(n&&e.Worker){var u=new Worker(r.filename);u.onmessage=function(e){insertHighlightedCode(e.data)},u.postMessage(JSON.stringify({language:s.language,code:s.code,immediateClose:!0}))}else insertHighlightedCode(r.highlight(s.code,s.grammar,s.language));else insertHighlightedCode(r.util.encode(s.code))},highlight:function(e,t,n){var a={code:e,grammar:t,language:n};if(r.hooks.run("before-tokenize",a),!a.grammar)throw new Error('The language "'+a.language+'" has no grammar.');return a.tokens=r.tokenize(a.code,a.grammar),r.hooks.run("after-tokenize",a),Token.stringify(r.util.encode(a.tokens),a.language)},tokenize:function(e,t){var n=t.rest;if(n){for(var a in n)t[a]=n[a];delete t.rest}var r=new LinkedList;return addAfter(r,r.head,e),matchGrammar(e,r,t,r.head,0),function toArray(e){var t=[],n=e.head.next;for(;n!==e.tail;)t.push(n.value),n=n.next;return t}(r)},hooks:{all:{},add:function(e,t){var n=r.hooks.all;n[e]=n[e]||[],n[e].push(t)},run:function(e,t){var n=r.hooks.all[e];if(n&&n.length)for(var a,i=0;a=n[i++];)a(t)}},Token};function Token(e,t,n,a){this.type=e,this.content=t,this.alias=n,this.length=0|(a||"").length}function matchPattern(e,t,n,a){e.lastIndex=t;var r=e.exec(n);if(r&&a&&r[1]){var i=r[1].length;r.index+=i,r[0]=r[0].slice(i)}return r}function matchGrammar(e,t,n,a,i,l){for(var o in n)if(n.hasOwnProperty(o)&&n[o]){var s=n[o];s=Array.isArray(s)?s:[s];for(var u=0;u<s.length;++u){if(l&&l.cause==o+","+u)return;var c=s[u],g=c.inside,h=!!c.lookbehind,f=!!c.greedy,d=c.alias;if(f&&!c.pattern.global){var m=c.pattern.toString().match(/[imsuy]*$/)[0];c.pattern=RegExp(c.pattern.source,m+"g")}for(var v=c.pattern||c,p=a.next,k=i;p!==t.tail&&!(l&&k>=l.reach);k+=p.value.length,p=p.next){var y=p.value;if(t.length>e.length)return;if(!(y instanceof Token)){var b,x=1;if(f){if(!(b=matchPattern(v,k,e,h))||b.index>=e.length)break;var A=b.index,w=b.index+b[0].length,C=k;for(C+=p.value.length;A>=C;)C+=(p=p.next).value.length;if(k=C-=p.value.length,p.value instanceof Token)continue;for(var L=p;L!==t.tail&&(C<w||"string"==typeof L.value);L=L.next)x++,C+=L.value.length;x--,y=e.slice(k,C),b.index-=k}else if(!(b=matchPattern(v,0,y,h)))continue;A=b.index;var S=b[0],E=y.slice(0,A),P=y.slice(A+S.length),T=k+y.length;l&&T>l.reach&&(l.reach=T);var O=p.prev;if(E&&(O=addAfter(t,O,E),k+=E.length),removeRange(t,O,x),p=addAfter(t,O,new Token(o,g?r.tokenize(S,g):S,d,S)),P&&addAfter(t,p,P),x>1){var N={cause:o+","+u,reach:T};matchGrammar(e,t,n,p.prev,k,N),l&&N.reach>l.reach&&(l.reach=N.reach)}}}}}}function LinkedList(){var e={value:null,prev:null,next:null},t={value:null,prev:e,next:null};e.next=t,this.head=e,this.tail=t,this.length=0}function addAfter(e,t,n){var a=t.next,r={value:n,prev:t,next:a};return t.next=r,a.prev=r,e.length++,r}function removeRange(e,t,n){for(var a=t.next,r=0;r<n&&a!==e.tail;r++)a=a.next;t.next=a,a.prev=t,e.length-=r}if(e.Prism=r,Token.stringify=function stringify(e,t){if("string"==typeof e)return e;if(Array.isArray(e)){var n="";return e.forEach((function(e){n+=stringify(e,t)})),n}var a={type:e.type,content:stringify(e.content,t),tag:"span",classes:["token",e.type],attributes:{},language:t},i=e.alias;i&&(Array.isArray(i)?Array.prototype.push.apply(a.classes,i):a.classes.push(i)),r.hooks.run("wrap",a);var l="";for(var o in a.attributes)l+=" "+o+'="'+(a.attributes[o]||"").replace(/"/g,"&quot;")+'"';return"<"+a.tag+' class="'+a.classes.join(" ")+'"'+l+">"+a.content+"</"+a.tag+">"},!e.document)return e.addEventListener?(r.disableWorkerMessageHandler||e.addEventListener("message",(function(t){var n=JSON.parse(t.data),a=n.language,i=n.code,l=n.immediateClose;e.postMessage(r.highlight(i,r.languages[a],a)),l&&e.close()}),!1),r):r;var i=r.util.currentScript();function highlightAutomaticallyCallback(){r.manual||r.highlightAll()}if(i&&(r.filename=i.src,i.hasAttribute("data-manual")&&(r.manual=!0)),!r.manual){var l=document.readyState;"loading"===l||"interactive"===l&&i&&i.defer?document.addEventListener("DOMContentLoaded",highlightAutomaticallyCallback):window.requestAnimationFrame?window.requestAnimationFrame(highlightAutomaticallyCallback):window.setTimeout(highlightAutomaticallyCallback,16)}return r}("undefined"!=typeof window?window:"undefined"!=typeof WorkerGlobalScope&&self instanceof WorkerGlobalScope?self:{});e.exports&&(e.exports=a),void 0!==n.g&&(n.g.Prism=a)}}]);