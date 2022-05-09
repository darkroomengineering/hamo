"use strict";
var _rootIndex = require("./root-index");
window.next = {
    version: _rootIndex.version,
    root: true
};
(0, _rootIndex).hydrate();

if (typeof exports.default === 'function' || (typeof exports.default === 'object' && exports.default !== null)) {
  Object.assign(exports.default, exports);
  module.exports = exports.default;
}

//# sourceMappingURL=root-next.js.map