"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.byteLength = byteLength;
exports.generateETag = generateETag;
function byteLength(payload) {
    return new TextEncoder().encode(payload).buffer.byteLength;
}
async function generateETag(payload) {
    if (payload.length === 0) {
        // fast-path empty
        return '"0-2jmj7l5rSw0yVb/vlWAYkK/YBwk"';
    }
    // compute hash of entity
    const hash = btoa(String.fromCharCode.apply(null, new Uint8Array(await crypto.subtle.digest('SHA-1', new TextEncoder().encode(payload))))).substring(0, 27);
    // compute length of entity
    const len = byteLength(payload);
    return '"' + len.toString(16) + '-' + hash + '"';
}

//# sourceMappingURL=web.js.map