"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "unstable_useRefreshRoot", {
    enumerable: true,
    get: function() {
        return _refresh.useRefreshRoot;
    }
});
Object.defineProperty(exports, "unstable_useWebVitalsReport", {
    enumerable: true,
    get: function() {
        return _vitals.useWebVitalsReport;
    }
});
Object.defineProperty(exports, "unstable_useFlushEffects", {
    enumerable: true,
    get: function() {
        return _flushEffects.useFlushEffects;
    }
});
var _refresh = require("./refresh");
var _vitals = require("./vitals");
var _flushEffects = require("../../shared/lib/flush-effects");

if (typeof exports.default === 'function' || (typeof exports.default === 'object' && exports.default !== null)) {
  Object.assign(exports.default, exports);
  module.exports = exports.default;
}

//# sourceMappingURL=index.js.map