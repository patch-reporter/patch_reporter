!function(t){var n={};function e(c){if(n[c])return n[c].exports;var a=n[c]={i:c,l:!1,exports:{}};return t[c].call(a.exports,a,a.exports,e),a.l=!0,a.exports}e.m=t,e.c=n,e.d=function(t,n,c){e.o(t,n)||Object.defineProperty(t,n,{enumerable:!0,get:c})},e.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},e.t=function(t,n){if(1&n&&(t=e(t)),8&n)return t;if(4&n&&"object"==typeof t&&t&&t.__esModule)return t;var c=Object.create(null);if(e.r(c),Object.defineProperty(c,"default",{enumerable:!0,value:t}),2&n&&"string"!=typeof t)for(var a in t)e.d(c,a,function(n){return t[n]}.bind(null,a));return c},e.n=function(t){var n=t&&t.__esModule?function(){return t.default}:function(){return t};return e.d(n,"a",n),n},e.o=function(t,n){return Object.prototype.hasOwnProperty.call(t,n)},e.p="",e(e.s=9)}([function(t,n,e){"use strict";function c(t,n){return(n||document).querySelector(t)}function a(t,n){return(n||document).querySelectorAll(t)}function r(t,n,e,c){t.addEventListener(n,e,!!c)}function i(t,n,e,c){r(t,e,function(e){var r=e.target,i=a(n,t);Array.prototype.indexOf.call(i,r)>=0&&c.call(r,e)},"blur"===e||"focus"===e)}function o(t){var n=new Date(t),e=n.getFullYear(),c=n.getMonth()+1,a=n.getDate(),r=n.getHours(),i=n.getMinutes(),o=n.getSeconds();return c+"/"+a+"/"+e+" "+r+":"+i+":"+(0===o?o+"0":o)}function u(t){var n=c(".loading");t?n.classList.remove("hide"):n.classList.add("hide")}function l(t,n){t.innerHTML=n}e.d(n,"e",function(){return c}),e.d(n,"f",function(){return a}),e.d(n,"b",function(){return r}),e.d(n,"a",function(){return i}),e.d(n,"c",function(){return o}),e.d(n,"g",function(){return u}),e.d(n,"d",function(){return l})},function(t,n,e){"use strict";var c=function(t){var n=t.method,e=t.url,c=t.callback,a=void 0===c?function(){}:c,r=t.data,i=t.type,o=void 0===i?"JSON":i;return new Promise(function(t,c){var i,u=new XMLHttpRequest;if(!u)return!1;u.open(n,e),"JSON"===o&&(u.setRequestHeader("Content-Type","application/json"),i=JSON.stringify(r)),u.onload=function(){if(u.readyState===XMLHttpRequest.DONE)if(200===u.status){var n="JSON"===o?JSON.parse(u.responseText):u.responseText;a(n),t(n)}else c(Error(u.statusText))},u.onerror=function(){c(Error("Something went wrong ... "))},u.send(i)})};e.d(n,"a",function(){return i}),e.d(n,"b",function(){return o});var a="GET",r="https://api.github.com";function i(t,n){return c({method:a,url:"".concat(r,"/repos/").concat(t,"/").concat(n,"/releases")})}function o(t){return c({method:a,url:"".concat(r,"/search/repositories?q=").concat(t,"&sort=&order=desc")})}},function(t,n,e){},,,function(t,n){t.exports="data:image/svg+xml;base64,PHN2ZwogICAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogICAgdmlld0JveD0iMCAwIDE0IDE2IgogICAgdmVyc2lvbj0iMS4xIgogICAgd2lkdGg9IjE0IgogICAgaGVpZ2h0PSIxNiIKICAgIGFyaWEtaGlkZGVuPSJ0cnVlIgo+CiAgICA8cGF0aAogICAgICAgIGZpbGwtcnVsZT0iZXZlbm9kZCIKICAgICAgICBkPSJNMTQgNmwtNC45LS42NEw3IDEgNC45IDUuMzYgMCA2bDMuNiAzLjI2TDIuNjcgMTQgNyAxMS42NyAxMS4zMyAxNGwtLjkzLTQuNzRMMTQgNnoiCiAgICA+PC9wYXRoPgo8L3N2Zz4="},function(t,n){t.exports="data:image/svg+xml;base64,PHN2ZyBhcmlhLWhpZGRlbj0idHJ1ZSIgZm9jdXNhYmxlPSJmYWxzZSIgZGF0YS1wcmVmaXg9ImZhcyIgZGF0YS1pY29uPSJleHRlcm5hbC1saW5rLWFsdCIgY2xhc3M9InN2Zy1pbmxpbmUtLWZhIGZhLWV4dGVybmFsLWxpbmstYWx0IGZhLXctMTgiIHJvbGU9ImltZyIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2aWV3Qm94PSIwIDAgNTc2IDUxMiI+PHBhdGggZmlsbD0iY3VycmVudENvbG9yIiBkPSJNNTc2IDI0djEyNy45ODRjMCAyMS40NjEtMjUuOTYgMzEuOTgtNDAuOTcxIDE2Ljk3MWwtMzUuNzA3LTM1LjcwOS0yNDMuNTIzIDI0My41MjNjLTkuMzczIDkuMzczLTI0LjU2OCA5LjM3My0zMy45NDEgMGwtMjIuNjI3LTIyLjYyN2MtOS4zNzMtOS4zNzMtOS4zNzMtMjQuNTY5IDAtMzMuOTQxTDQ0Mi43NTYgNzYuNjc2bC0zNS43MDMtMzUuNzA1QzM5MS45ODIgMjUuOSA0MDIuNjU2IDAgNDI0LjAyNCAwSDU1MmMxMy4yNTUgMCAyNCAxMC43NDUgMjQgMjR6TTQwNy4wMjkgMjcwLjc5NGwtMTYgMTZBMjMuOTk5IDIzLjk5OSAwIDAgMCAzODQgMzAzLjc2NVY0NDhINjRWMTI4aDI2NGEyNC4wMDMgMjQuMDAzIDAgMCAwIDE2Ljk3LTcuMDI5bDE2LTE2QzM3Ni4wODkgODkuODUxIDM2NS4zODEgNjQgMzQ0IDY0SDQ4QzIxLjQ5IDY0IDAgODUuNDkgMCAxMTJ2MzUyYzAgMjYuNTEgMjEuNDkgNDggNDggNDhoMzUyYzI2LjUxIDAgNDgtMjEuNDkgNDgtNDhWMjg3Ljc2NGMwLTIxLjM4Mi0yNS44NTItMzIuMDktNDAuOTcxLTE2Ljk3eiI+PC9wYXRoPjwvc3ZnPg=="},function(t,n){t.exports="data:image/svg+xml;base64,PHN2ZyBhcmlhLWhpZGRlbj0idHJ1ZSIgZm9jdXNhYmxlPSJmYWxzZSIgcm9sZT0iaW1nIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0NDggNTEyIj48cGF0aCBmaWxsPSJyZWQiIGQ9Ik0zMiA0NjRhNDggNDggMCAwIDAgNDggNDhoMjg4YTQ4IDQ4IDAgMCAwIDQ4LTQ4VjEyOEgzMnptMjcyLTI1NmExNiAxNiAwIDAgMSAzMiAwdjIyNGExNiAxNiAwIDAgMS0zMiAwem0tOTYgMGExNiAxNiAwIDAgMSAzMiAwdjIyNGExNiAxNiAwIDAgMS0zMiAwem0tOTYgMGExNiAxNiAwIDAgMSAzMiAwdjIyNGExNiAxNiAwIDAgMS0zMiAwek00MzIgMzJIMzEybC05LjQtMTguN0EyNCAyNCAwIDAgMCAyODEuMSAwSDE2Ni44YTIzLjcyIDIzLjcyIDAgMCAwLTIxLjQgMTMuM0wxMzYgMzJIMTZBMTYgMTYgMCAwIDAgMCA0OHYzMmExNiAxNiAwIDAgMCAxNiAxNmg0MTZhMTYgMTYgMCAwIDAgMTYtMTZWNDhhMTYgMTYgMCAwIDAtMTYtMTZ6Ij48L3BhdGg+PC9zdmc+"},,function(t,n,e){"use strict";e.r(n);var c=e(1),a=e(0),r=e(5),i=e.n(r),o=e(6),u=e.n(o),l=e(7),s=e.n(l);e(10),e(2),e(11);var g=Object(a.e)(".default__theme"),d=Object(a.e)(".patch-reporter__theme");function M(){Object(a.e)(".modal").classList.add("modal__visible")}function I(){Object(a.e)(".modal").classList.remove("modal__visible")}function N(){chrome.storage.sync.get(null,function(t){var n=Object(a.e)(".current-repositories");n.innerHTML="";var e=document.createDocumentFragment();for(var c in t){var r=t[c],o=document.createElement("li");o.className="grid-list",o.innerHTML='\n                <div class="card">\n                    <div class="card__head">\n                        <div class="card__head--thumb">\n                            <img src="'.concat(r.thumbnail,'" alt="thumbnail" />\n                        </div>\n                        <div class="card__title--wrap">\n                            <div class="card__title">').concat(r.fullName,'</div>\n                            <div class="card__sub-title">').concat(r.language,'</div>\n                        </div>\n                    </div>\n                    <div class="card__body">\n                        <div class="card__body--contents">').concat(r.description,'</div>\n                    </div>\n                    <ul class="card__actions">\n                        <li class="card__actions-btn star">\n                            <span>\n                                <img src=').concat(i.a," />\n                                ").concat(r.starCount,'\n                            </span>\n                        </li>\n                        <li class="card__actions-btn github">\n                            <span>\n                                <img src="').concat(u.a,'"/>\n                            </span>\n                        </li>\n                        <li class="card__actions-btn delete">\n                            <span class="btn__delete">\n                                <img src="').concat(s.a,'" data-fullname="').concat(r.fullName,'"/>\n                            </span>\n                        </li>\n                    </ul>\n                </div>\n            '),e.appendChild(o)}var l=document.createElement("li");l.className="grid-list",l.innerHTML='<button class="btn__add">추가하기</button>',n.appendChild(e),n.appendChild(l)})}function m(t){console.log(t);var n=t.target.dataset.fullname;chrome.storage.sync.remove(n),N()}function b(){var t=Object(a.e)(".input-search").value;t&&Object(c.b)(t).then(function(t){console.log(t),function(t){var n=Object(a.e)(".search-result"),e="<ul>";console.log(t);var c=!0,r=!1,i=void 0;try{for(var o,u=t[Symbol.iterator]();!(c=(o=u.next()).done);c=!0){var l=o.value;e+='\n            <li class="list">\n                <div>\n                    <a target="_blank" href='.concat(l.html_url,">").concat(l.fullName,"</a> / ").concat(l.language," / ").concat(l.starCount,'\n                    <button class="btn-subscribe"\n                        data-fullname="').concat(l.fullName,'"\n                        data-language="').concat(l.language,'"\n                        data-starcount="').concat(l.starCount,'"\n                        data-description="').concat(l.description,'"\n                        data-thumbnail="').concat(l.thumbnail,'"\n                    >추가</button>\n                </div>\n            </li>')}}catch(t){r=!0,i=t}finally{try{c||null==u.return||u.return()}finally{if(r)throw i}}e+="</ul>",n.innerHTML=e,Object(a.f)(".btn-subscribe").forEach(function(t){Object(a.b)(t,"click",f,!1)})}(t.items.map(function(t){return{id:t.id,fullName:t.full_name,language:t.language,starCount:t.stargazers_count,description:t.description,thumbnail:t.owner.avatar_url}}))})}function f(t){var n=t.currentTarget.dataset,e=n.fullname,c=n.language,a=n.starcount,r=n.description,i=n.thumbnail;chrome.storage.sync.get(null,function(t){if(console.log(t),t[e])alert("이미 추가된 라이브러리입니다.");else{var n,o,u,l={fullName:e,language:c,starCount:a,description:r,thumbnail:i};chrome.storage.sync.set((u=l,(o=e)in(n={})?Object.defineProperty(n,o,{value:u,enumerable:!0,configurable:!0,writable:!0}):n[o]=u,n),function(){N()})}})}Object(a.b)(g,"click",function(){chrome.storage.sync.get(null,function(t){console.log(t)}),chrome.storage.sync.set({defaultnewtab:!0})},!1),Object(a.b)(d,"click",function(){chrome.storage.sync.remove("defaultnewtab")},!1),chrome.storage.sync.get("defaultnewtab",function(t){t.defaultnewtab}),Object(a.b)(window,"load",function(){var t=Object(a.e)(".current-repositories"),n=Object(a.e)(".btn-search"),e=Object(a.e)(".modal__overlay");N(),Object(a.b)(n,"click",b,!1),Object(a.b)(e,"click",I,!1),Object(a.a)(t,".btn__add","click",M),Object(a.a)(t,".btn__delete img","click",m)})},function(t,n,e){},function(t,n,e){}]);