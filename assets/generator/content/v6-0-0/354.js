"use strict";(self.webpackChunkCDN=self.webpackChunkCDN||[]).push([[354],{80354:(n,r)=>{var o,a,i="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(n){return typeof n}:function(n){return n&&"function"==typeof Symbol&&n.constructor===Symbol&&n!==Symbol.prototype?"symbol":typeof n};a="undefined"!=typeof window?window:void 0,void 0===(o=function(){return a.annyang=function(n,r){var o,a=n.SpeechRecognition||n.webkitSpeechRecognition||n.mozSpeechRecognition||n.msSpeechRecognition||n.oSpeechRecognition;if(!a)return null;var c,s,u=[],l={start:[],error:[],end:[],soundstart:[],result:[],resultMatch:[],resultNoMatch:[],errorNetwork:[],errorPermissionBlocked:[],errorPermissionDenied:[]},f=0,p=0,g=!1,d="font-weight: bold; color: #00f;",h=!1,m=!1,y=/\s*\((.*?)\)\s*/g,b=/(\(\?:[^)]+\))\?/g,v=/(\(\?)?:\w+/g,w=/\*\w+/g,C=/[\-{}\[\]+?.,\\\^$|#]/g,S=function(n){for(var r=arguments.length,o=Array(1<r?r-1:0),a=1;a<r;a++)o[a-1]=arguments[a];n.forEach((function(n){n.callback.apply(n.context,o)}))},e=function(){return c!==r},k=function(n,r){-1!==n.indexOf("%c")||r?console.log(n,r||d):console.log(n)},x=function(){e()||o.init({},!1)},R=function(n,r,o){u.push({command:n,callback:r,originalPhrase:o}),g&&k("Command successfully loaded: %c"+o,d)},P=function(n){var r;S(l.result,n);for(var o=0;o<n.length;o++){r=n[o].trim(),g&&k("Speech recognized: %c"+r,d);for(var a=0,i=u.length;a<i;a++){var c=u[a],s=c.command.exec(r);if(s){var f=s.slice(1);return g&&(k("command matched: %c"+c.originalPhrase,d),f.length&&k("with parameters",f)),c.callback.apply(this,f),void S(l.resultMatch,r,c.originalPhrase,n)}}}S(l.resultNoMatch,n)};return o={init:function(i){var d=!(1<arguments.length&&arguments[1]!==r)||arguments[1];c&&c.abort&&c.abort(),(c=new a).maxAlternatives=5,c.continuous="http:"===n.location.protocol,c.lang="en-US",c.onstart=function(){m=!0,S(l.start)},c.onsoundstart=function(){S(l.soundstart)},c.onerror=function(n){switch(S(l.error,n),n.error){case"network":S(l.errorNetwork,n);break;case"not-allowed":case"service-not-allowed":s=!1,(new Date).getTime()-f<200?S(l.errorPermissionBlocked,n):S(l.errorPermissionDenied,n)}},c.onend=function(){if(m=!1,S(l.end),s){var n=(new Date).getTime()-f;(p+=1)%10==0&&g&&k("Speech Recognition is repeatedly stopping and starting. See http://is.gd/annyang_restarts for tips."),n<1e3?setTimeout((function(){o.start({paused:h})}),1e3-n):o.start({paused:h})}},c.onresult=function(n){if(h)return g&&k("Speech heard, but annyang is paused"),!1;for(var r=n.results[n.resultIndex],o=[],a=0;a<r.length;a++)o[a]=r[a].transcript;P(o)},d&&(u=[]),i.length&&this.addCommands(i)},start:function(n){x(),h=(n=n||{}).paused!==r&&!!n.paused,s=n.autoRestart===r||!!n.autoRestart,n.continuous!==r&&(c.continuous=!!n.continuous),f=(new Date).getTime();try{c.start()}catch(n){g&&k(n.message)}},abort:function(){s=!1,p=0,e()&&c.abort()},pause:function(){h=!0},resume:function(){o.start()},debug:function(){g=!(0<arguments.length&&arguments[0]!==r&&!arguments[0])},setLanguage:function(n){x(),c.lang=n},addCommands:function(r){var o,a;for(var c in x(),r)if(r.hasOwnProperty(c))if("function"==typeof(o=n[r[c]]||r[c]))R((a=(a=c).replace(C,"\\$&").replace(y,"(?:$1)?").replace(v,(function(n,r){return r?n:"([^\\s]+)"})).replace(w,"(.*?)").replace(b,"\\s*$1?\\s*"),new RegExp("^"+a+"$","i")),o,c);else{if(!("object"===(void 0===o?"undefined":i(o))&&o.regexp instanceof RegExp)){g&&k("Can not register command: %c"+c,d);continue}R(new RegExp(o.regexp.source,"i"),o.callback,c)}},removeCommands:function(n){n===r?u=[]:(n=Array.isArray(n)?n:[n],u=u.filter((function(r){for(var o=0;o<n.length;o++)if(n[o]===r.originalPhrase)return!1;return!0})))},addCallback:function(o,a,i){var c=n[a]||a;"function"==typeof c&&l[o]!==r&&l[o].push({callback:c,context:i||this})},removeCallback:function(n,o){var t=function(n){return n.callback!==o};for(var a in l)l.hasOwnProperty(a)&&(n!==r&&n!==a||(l[a]=o===r?[]:l[a].filter(t)))},isListening:function(){return m&&!h},getSpeechRecognizer:function(){return c},trigger:function(n){o.isListening()?(Array.isArray(n)||(n=[n]),P(n)):g&&k(m?"Speech heard, but annyang is paused":"Cannot trigger while annyang is aborted")}}}(a)}.apply(r,[]))||(n.exports=o)}}]);