"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = void 0;
var _hotDevClient = _interopRequireDefault(require("./error-overlay/hot-dev-client"));
var _websocket = require("./error-overlay/websocket");
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
var _default = ()=>{
    const devClient = (0, _hotDevClient).default();
    devClient.subscribeToHmrEvent((obj)=>{
        if (obj.action === 'reloadPage') {
            (0, _websocket).sendMessage(JSON.stringify({
                event: 'client-reload-page',
                clientId: window.__nextDevClientId
            }));
            return window.location.reload();
        }
        if (obj.action === 'removedPage') {
            const [page] = obj.data;
            if (page === window.next.router.pathname) {
                (0, _websocket).sendMessage(JSON.stringify({
                    event: 'client-removed-page',
                    clientId: window.__nextDevClientId,
                    page
                }));
                return window.location.reload();
            }
            return;
        }
        if (obj.action === 'addedPage') {
            const [page] = obj.data;
            if (page === window.next.router.pathname && typeof window.next.router.components[page] === 'undefined') {
                (0, _websocket).sendMessage(JSON.stringify({
                    event: 'client-added-page',
                    clientId: window.__nextDevClientId,
                    page
                }));
                return window.location.reload();
            }
            return;
        }
        throw new Error('Unexpected action ' + obj.action);
    });
    return devClient;
};
exports.default = _default;

if (typeof exports.default === 'function' || (typeof exports.default === 'object' && exports.default !== null)) {
  Object.assign(exports.default, exports);
  module.exports = exports.default;
}

//# sourceMappingURL=webpack-hot-middleware-client.js.map