"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.hydrate = hydrate;
exports.version = void 0;
require("../build/polyfills/polyfill-module");
var _client = _interopRequireDefault(require("react-dom/client"));
var _react = _interopRequireWildcard(require("react"));
var _refresh = require("./streaming/refresh");
var _reactServerDomWebpack = require("next/dist/compiled/react-server-dom-webpack");
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function _interopRequireWildcard(obj) {
    if (obj && obj.__esModule) {
        return obj;
    } else {
        var newObj = {};
        if (obj != null) {
            for(var key in obj){
                if (Object.prototype.hasOwnProperty.call(obj, key)) {
                    var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {};
                    if (desc.get || desc.set) {
                        Object.defineProperty(newObj, key, desc);
                    } else {
                        newObj[key] = obj[key];
                    }
                }
            }
        }
        newObj.default = obj;
        return newObj;
    }
}
const version = "12.1.6";
exports.version = version;
const appElement = document;
let reactRoot = null;
function renderReactElement(domEl, fn) {
    const reactEl = fn();
    if (!reactRoot) {
        // Unlike with createRoot, you don't need a separate root.render() call here
        reactRoot = _client.default.hydrateRoot(domEl, reactEl);
    } else {
        reactRoot.render(reactEl);
    }
}
const getCacheKey = ()=>{
    const { pathname , search  } = location;
    return pathname + search;
};
const encoder = new TextEncoder();
let initialServerDataBuffer = undefined;
let initialServerDataWriter = undefined;
let initialServerDataLoaded = false;
let initialServerDataFlushed = false;
function nextServerDataCallback(seg) {
    if (seg[0] === 0) {
        initialServerDataBuffer = [];
    } else {
        if (!initialServerDataBuffer) throw new Error('Unexpected server data: missing bootstrap script.');
        if (initialServerDataWriter) {
            initialServerDataWriter.write(encoder.encode(seg[2]));
        } else {
            initialServerDataBuffer.push(seg[2]);
        }
    }
}
// There might be race conditions between `nextServerDataRegisterWriter` and
// `DOMContentLoaded`. The former will be called when React starts to hydrate
// the root, the latter will be called when the DOM is fully loaded.
// For streaming, the former is called first due to partial hydration.
// For non-streaming, the latter can be called first.
// Hence, we use two variables `initialServerDataLoaded` and
// `initialServerDataFlushed` to make sure the writer will be closed and
// `initialServerDataBuffer` will be cleared in the right time.
function nextServerDataRegisterWriter(writer) {
    if (initialServerDataBuffer) {
        initialServerDataBuffer.forEach((val)=>{
            writer.write(encoder.encode(val));
        });
        if (initialServerDataLoaded && !initialServerDataFlushed) {
            writer.close();
            initialServerDataFlushed = true;
            initialServerDataBuffer = undefined;
        }
    }
    initialServerDataWriter = writer;
}
// When `DOMContentLoaded`, we can close all pending writers to finish hydration.
const DOMContentLoaded = function() {
    if (initialServerDataWriter && !initialServerDataFlushed) {
        initialServerDataWriter.close();
        initialServerDataFlushed = true;
        initialServerDataBuffer = undefined;
    }
    initialServerDataLoaded = true;
};
// It's possible that the DOM is already loaded.
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', DOMContentLoaded, false);
} else {
    DOMContentLoaded();
}
const nextServerDataLoadingGlobal = self.__next_s = self.__next_s || [];
nextServerDataLoadingGlobal.forEach(nextServerDataCallback);
nextServerDataLoadingGlobal.push = nextServerDataCallback;
function createResponseCache() {
    return new Map();
}
const rscCache = createResponseCache();
function fetchFlight(href, props) {
    const url = new URL(href, location.origin);
    const searchParams = url.searchParams;
    searchParams.append('__flight__', '1');
    if (props) {
        searchParams.append('__props__', JSON.stringify(props));
    }
    return fetch(url.toString());
}
function useServerResponse(cacheKey, serialized) {
    let response = rscCache.get(cacheKey);
    if (response) return response;
    if (initialServerDataBuffer) {
        const t = new TransformStream();
        const writer = t.writable.getWriter();
        response = (0, _reactServerDomWebpack).createFromFetch(Promise.resolve({
            body: t.readable
        }));
        nextServerDataRegisterWriter(writer);
    } else {
        const fetchPromise = serialized ? (()=>{
            const t = new TransformStream();
            const writer = t.writable.getWriter();
            writer.ready.then(()=>{
                writer.write(new TextEncoder().encode(serialized));
            });
            return Promise.resolve({
                body: t.readable
            });
        })() : fetchFlight(getCacheKey());
        response = (0, _reactServerDomWebpack).createFromFetch(fetchPromise);
    }
    rscCache.set(cacheKey, response);
    return response;
}
const ServerRoot = ({ cacheKey , serialized  })=>{
    _react.default.useEffect(()=>{
        rscCache.delete(cacheKey);
    });
    const response = useServerResponse(cacheKey, serialized);
    const root = response.readRoot();
    return root;
};
function Root({ children  }) {
    if (process.env.__NEXT_TEST_MODE) {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        _react.default.useEffect(()=>{
            window.__NEXT_HYDRATED = true;
            if (window.__NEXT_HYDRATED_CB) {
                window.__NEXT_HYDRATED_CB();
            }
        }, []);
    }
    return children;
}
const RSCComponent = (props)=>{
    const cacheKey = getCacheKey();
    const { __flight_serialized__  } = props;
    const [, dispatch] = (0, _react).useState({});
    const rerender = ()=>dispatch({})
    ;
    // If there is no cache, or there is serialized data already
    function refreshCache(nextProps) {
        (0, _react).startTransition(()=>{
            const currentCacheKey = getCacheKey();
            const response = (0, _reactServerDomWebpack).createFromFetch(fetchFlight(currentCacheKey, nextProps));
            rscCache.set(currentCacheKey, response);
            rerender();
        });
    }
    return(/*#__PURE__*/ _react.default.createElement(_refresh.RefreshContext.Provider, {
        value: refreshCache
    }, /*#__PURE__*/ _react.default.createElement(ServerRoot, {
        cacheKey: cacheKey,
        serialized: __flight_serialized__
    })));
};
function hydrate() {
    renderReactElement(appElement, ()=>/*#__PURE__*/ _react.default.createElement(_react.default.StrictMode, null, /*#__PURE__*/ _react.default.createElement(Root, null, /*#__PURE__*/ _react.default.createElement(RSCComponent, null)))
    );
}

if (typeof exports.default === 'function' || (typeof exports.default === 'object' && exports.default !== null)) {
  Object.assign(exports.default, exports);
  module.exports = exports.default;
}

//# sourceMappingURL=root-index.js.map