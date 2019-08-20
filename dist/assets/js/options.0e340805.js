!function(t){var e={};function n(r){if(e[r])return e[r].exports;var c=e[r]={i:r,l:!1,exports:{}};return t[r].call(c.exports,c,c.exports,n),c.l=!0,c.exports}n.m=t,n.c=e,n.d=function(t,e,r){n.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:r})},n.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},n.t=function(t,e){if(1&e&&(t=n(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var r=Object.create(null);if(n.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var c in t)n.d(r,c,function(e){return t[e]}.bind(null,c));return r},n.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return n.d(e,"a",e),e},n.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},n.p="",n(n.s=6)}([function(t,e,n){"use strict";function r(t,e){return(e||document).querySelector(t)}function c(t,e){return(e||document).querySelectorAll(t)}function a(t,e,n,r){t.addEventListener(e,n,!!r)}function o(t){var e=new Date(t),n=e.getFullYear(),r=e.getMonth()+1,c=e.getDate(),a=e.getHours(),o=e.getMinutes(),i=e.getSeconds();return r+"/"+c+"/"+n+" "+a+":"+o+":"+(0===i?i+"0":i)}function i(t){var e=r(".loading");t?e.classList.remove("hide"):e.classList.add("hide")}n.d(e,"c",function(){return r}),n.d(e,"d",function(){return c}),n.d(e,"a",function(){return a}),n.d(e,"b",function(){return o}),n.d(e,"e",function(){return i})},function(t,e,n){"use strict";var r=function(t){var e=t.method,n=t.url,r=t.callback,c=void 0===r?function(){}:r,a=t.data,o=t.type,i=void 0===o?"JSON":o;return new Promise(function(t,r){var o,u=new XMLHttpRequest;if(!u)return!1;u.open(e,n),"JSON"===i&&(u.setRequestHeader("Content-Type","application/json"),o=JSON.stringify(a)),u.onload=function(){if(u.readyState===XMLHttpRequest.DONE)if(200===u.status){var e="JSON"===i?JSON.parse(u.responseText):u.responseText;c(e),t(e)}else r(Error(u.statusText))},u.onerror=function(){r(Error("Something went wrong ... "))},u.send(o)})};n.d(e,"a",function(){return o}),n.d(e,"b",function(){return i});var c="GET",a="https://api.github.com";function o(t,e){return r({method:c,url:"".concat(a,"/repos/").concat(t,"/").concat(e,"/releases")})}function i(t){return r({method:c,url:"".concat(a,"/search/repositories?q=").concat(t,"&sort=&order=desc")})}},,,,function(t,e,n){},function(t,e,n){"use strict";n.r(e);var r=n(1),c=n(0);n(7),n(5),n(8);function a(t,e){var n=Object.keys(t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(t);e&&(r=r.filter(function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable})),n.push.apply(n,r)}return n}function o(t,e,n){return e in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}var i=Object(c.c)(".default__theme"),u=Object(c.c)(".patch-reporter__theme");function l(){Object(c.c)(".modal").classList.add("modal__visible")}function s(){Object(c.c)(".modal").classList.remove("modal__visible")}function d(){chrome.storage.sync.get(null,function(t){var e=Object(c.c)(".current-repositories");e.innerHTML="",e.innerHTML+='\n            <li class="list">\n                <div class="list__item--title"><span>Name</span></div>\n                <div class="list__item--title"><span>Language</span></div>\n                <div class="list__item--title"><span>Starred</span></div>\n                <div class="list__item--title"><span>Description</span></div>\n                <div class="list__item--title"><span>Actions</span></div>\n            </li>\n        ';var n=document.createDocumentFragment(),r=function(e){var r=function(t){for(var e=1;e<arguments.length;e++){var n=null!=arguments[e]?arguments[e]:{};e%2?a(n,!0).forEach(function(e){o(t,e,n[e])}):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(n)):a(n).forEach(function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(n,e))})}return t}({},t[e],{e_actions:"삭제"}),i=document.createElement("li");for(var u in i.className="list",i.dataset.id=e,r){var l=document.createElement("div"),s=document.createElement("span"),d=document.createTextNode(r[u]);"e_actions"===u&&Object(c.a)(s,"click",function(){f(r.a_fullname)},!1),l.className="list__item",s.appendChild(d),l.appendChild(s),i.appendChild(l)}n.appendChild(i)};for(var i in t)r(i);e.appendChild(n)})}function f(t){chrome.storage.sync.remove(t),d()}function p(){var t=Object(c.c)(".input-search").value;t&&Object(r.b)(t).then(function(t){console.log(t),function(t){var e=Object(c.c)(".search-result"),n="<ul>";console.log(t);var r=!0,a=!1,o=void 0;try{for(var i,u=t[Symbol.iterator]();!(r=(i=u.next()).done);r=!0){var l=i.value;n+='\n            <li class="list">\n                <div>\n                    <a target="_blank" href='.concat(l.html_url,">").concat(l.a_fullName,"</a> / ").concat(l.b_language," / ").concat(l.c_starCount,'\n                    <button class="btn-subscribe"\n                        data-fullname="').concat(l.a_fullName,'"\n                        data-language="').concat(l.b_language,'"\n                        data-starcount="').concat(l.c_starCount,'"\n                        data-description="').concat(l.d_description,'"\n                    >추가</button>\n                </div>\n            </li>')}}catch(t){a=!0,o=t}finally{try{r||null==u.return||u.return()}finally{if(a)throw o}}n+="</ul>",e.innerHTML=n,Object(c.d)(".btn-subscribe").forEach(function(t){Object(c.a)(t,"click",b,!1)})}(t.items.map(function(t){return{id:t.id,a_fullName:t.full_name,b_language:t.language,c_starCount:t.stargazers_count,d_description:t.description}}))})}function b(t){var e=t.currentTarget.dataset,n=e.fullname,r=e.language,c=e.starcount,a=e.description;chrome.storage.sync.get(null,function(t){if(t[n])alert("이미 추가된 라이브러리입니다.");else{var e={a_fullname:n,b_language:r,c_starcount:c,d_description:a};chrome.storage.sync.set(o({},n,e),function(){d()})}})}Object(c.a)(i,"click",function(){chrome.storage.sync.get(null,function(t){console.log(t)}),chrome.storage.sync.set({defaultnewtab:!0})},!1),Object(c.a)(u,"click",function(){chrome.storage.sync.remove("defaultnewtab")},!1),chrome.storage.sync.get("defaultnewtab",function(t){t.defaultnewtab}),Object(c.a)(window,"load",function(){var t=Object(c.c)(".btn-search"),e=Object(c.c)(".btn__add"),n=Object(c.c)(".modal__overlay");d(),Object(c.a)(t,"click",p,!1),Object(c.a)(e,"click",l,!1),Object(c.a)(n,"click",s,!1)})},function(t,e,n){},function(t,e,n){}]);