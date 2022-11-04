var e=require("react"),n=require("@studio-freight/tempus"),t=require("nanoid"),r=require("throttle-debounce"),u="undefined"!=typeof window?e.useLayoutEffect:e.useEffect,o="undefined"!=typeof window?function(){var n=e.useState(document.readyState),t=n[0],r=n[1];return u(function(){function e(){r(document.readyState)}return r(document.readyState),document.addEventListener("readystatechange",e,!1),function(){return document.removeEventListener("readystatechange",e,!1)}},[]),t}:function(){},i=[],c=function(e){var n=e.type;"string"==typeof e&&(n=e);var t=[];t.push("string"==typeof e?{type:n}:e),i.forEach(function(e){var r=e[0],u=e[1];"string"==typeof r&&r!==n||("function"!=typeof r||r.apply(void 0,t))&&u.apply(void 0,t)})};function f(){return f=Object.assign?Object.assign.bind():function(e){for(var n=1;n<arguments.length;n++){var t=arguments[n];for(var r in t)Object.prototype.hasOwnProperty.call(t,r)&&(e[r]=t[r])}return e},f.apply(this,arguments)}function s(e,n){void 0===n&&(n=0);var t=n+e.offsetTop;return e.offsetParent?s(e.offsetParent,t):t}function a(e,n){void 0===n&&(n=0);var t=n+e.offsetLeft;return e.offsetParent?a(e.offsetParent,t):t}exports.dispatch=c,exports.useDebug=function(){return e.useMemo(function(){return"undefined"!=typeof window&&(window.location.href.includes("#debug")||"development"===process.env.NODE_ENV)},[])},exports.useDocumentReadyState=o,exports.useEventBus=function(n,t,r){return void 0===r&&(r=[]),e.useEffect(function(){return function(e,n){if(null!=e&&null!=n)return i=[].concat(i,[[e,n]]),function(){i=i.filter(function(e){return e[1]!==n})}}(n,t)},[].concat(r,[t,n])),c},exports.useFrame=function(t,r){void 0===r&&(r=0),e.useEffect(function(){if(t){var e=n.raf.add(t,r);return function(){n.raf.remove(e)}}},[t,r])},exports.useId=function(){return e.useMemo(function(){return t.nanoid()},[])},exports.useInterval=function(n,t){var r=e.useRef();e.useEffect(function(){r.current=n}),e.useEffect(function(){if(null!==t){var e=setInterval(function(){r.current()},t);return function(){return clearInterval(e)}}},[t])},exports.useIsTouchDevice=function(){var n=e.useState(void 0),t=n[0],r=n[1],o=e.useCallback(function(){r("ontouchstart"in window||navigator.maxTouchPoints>0||navigator.msMaxTouchPoints>0)},[]);return u(function(){return o(),window.addEventListener("resize",o,!1),function(){window.removeEventListener("resize",o,!1)}},[]),t},exports.useIsVisible=function(n){var t=void 0===n?{}:n,r=t.root,u=void 0===r?null:r,o=t.rootMargin,i=void 0===o?"0px":o,c=t.threshold,f=void 0===c?1:c,s=t.once,a=void 0!==s&&s,d=e.useRef(),v=e.useRef(),l=e.useState(!1),p=l[0],h=l[1],m=e.useCallback(function(e){h(e[0].isIntersecting)},[]);return e.useEffect(function(){return d.current=new IntersectionObserver(m,{root:u,rootMargin:i,threshold:f}),v.current&&d.current.observe(v.current),function(){d.current.disconnect()}},[m]),e.useEffect(function(){a&&p&&d.current.disconnect()},[p]),{setRef:function(e){v.current||(v.current=e)},inView:p}},exports.useLayoutEffect=u,exports.useMediaQuery=function(n){var t=e.useState(void 0),r=t[0],o=t[1],i=e.useCallback(function(e){o(e.matches)},[]);return u(function(){var e=window.matchMedia(n);return i(e),e.addEventListener("change",i),function(){e.removeEventListener("change",i)}}),r},exports.useOutsideClickEvent=function(n,t){var r=e.useCallback(function(e){n.current&&!n.current.contains(e.target)&&t()},[n,t]);e.useEffect(function(){return document.addEventListener("mousedown",r),function(){document.removeEventListener("mousedown",r)}},[r])},exports.useRect=function(n){var t=(void 0===n?{}:n).debounce,o=void 0===t?1e3:t,i=e.useRef(),c=e.useState({top:void 0,left:void 0,width:void 0,height:void 0}),d=c[0],v=c[1],l=function(){i.current&&v(function(e){return f({},e,{top:s(i.current),left:a(i.current)})})};u(function(){var e=r.throttle(o,l),n=new ResizeObserver(e);return n.observe(document.body),function(){n.disconnect(),e.cancel({upcomingOnly:!0})}},[o]);var p=function(e){var n=e[0].contentRect,t=n.width,r=n.height;v(function(e){return f({},e,{width:t,height:r})})},h=e.useRef();return[function(e){var n;e&&e!==i.current&&(null==(n=h.current)||n.disconnect(),h.current=new ResizeObserver(p),h.current.observe(e),i.current=e)},d,function(e,n){return d}]},exports.useSlots=function(n,t){void 0===n&&(n=[]),void 0===t&&(t=[]);var r=e.useMemo(function(){return t&&[t].flat()},[t]),u=e.useMemo(function(){return n&&[n].flat()},[n]),o=e.useMemo(function(){return r&&u&&u.map(function(e){var n;return null==(n=r.find(function(n){return n.type===e}))?void 0:n.props.children})},[r,u]);return n[0]?o:o[0]};
//# sourceMappingURL=index.js.map