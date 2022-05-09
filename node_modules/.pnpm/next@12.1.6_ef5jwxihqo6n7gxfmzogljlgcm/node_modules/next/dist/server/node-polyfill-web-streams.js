"use strict";
var _webStreamsPolyfill = require("next/dist/compiled/web-streams-polyfill");
// Polyfill Web Streams for the Node.js runtime.
if (!global.ReadableStream) {
    global.ReadableStream = _webStreamsPolyfill.ReadableStream;
}
if (!global.TransformStream) {
    global.TransformStream = _webStreamsPolyfill.TransformStream;
}

//# sourceMappingURL=node-polyfill-web-streams.js.map