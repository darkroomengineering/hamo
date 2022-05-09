"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
var _error = require("../error");
var _fetchEvent = require("../spec-compliant/fetch-event");
class NextFetchEvent extends _fetchEvent.FetchEvent {
    constructor(params){
        super(params.request);
        this.sourcePage = params.page;
    }
    /**
   * @deprecated The `request` is now the first parameter and the API is now async.
   *
   * Read more: https://nextjs.org/docs/messages/middleware-new-signature
   */ get request() {
        throw new _error.DeprecationError({
            page: this.sourcePage
        });
    }
    /**
   * @deprecated Using `respondWith` is no longer needed.
   *
   * Read more: https://nextjs.org/docs/messages/middleware-new-signature
   */ respondWith() {
        throw new _error.DeprecationError({
            page: this.sourcePage
        });
    }
}
exports.NextFetchEvent = NextFetchEvent;

//# sourceMappingURL=fetch-event.js.map