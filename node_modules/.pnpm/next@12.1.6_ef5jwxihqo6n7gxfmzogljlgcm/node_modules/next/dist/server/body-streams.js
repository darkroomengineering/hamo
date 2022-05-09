"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.clonableBodyForRequest = clonableBodyForRequest;
var _stream = require("stream");
var _webStreamsPolyfill = require("next/dist/compiled/web-streams-polyfill");
/**
 * Creates a ReadableStream from a Node.js HTTP request
 */ function requestToBodyStream(request) {
    const transform = new _webStreamsPolyfill.TransformStream({
        start (controller) {
            request.on('data', (chunk)=>controller.enqueue(chunk)
            );
            request.on('end', ()=>controller.terminate()
            );
            request.on('error', (err)=>controller.error(err)
            );
        }
    });
    return transform.readable;
}
function bodyStreamToNodeStream(bodyStream) {
    const reader = bodyStream.getReader();
    return _stream.Readable.from(async function*() {
        while(true){
            const { done , value  } = await reader.read();
            if (done) {
                return;
            }
            yield value;
        }
    }());
}
function replaceRequestBody(base, stream) {
    for(const key in stream){
        let v = stream[key];
        if (typeof v === 'function') {
            v = v.bind(stream);
        }
        base[key] = v;
    }
    return base;
}
function clonableBodyForRequest(incomingMessage) {
    let bufferedBodyStream = null;
    const endPromise = new Promise((resolve, reject)=>{
        incomingMessage.on('end', resolve);
        incomingMessage.on('error', reject);
    });
    return {
        /**
     * Replaces the original request body if necessary.
     * This is done because once we read the body from the original request,
     * we can't read it again.
     */ async finalize () {
            if (bufferedBodyStream) {
                await endPromise;
                replaceRequestBody(incomingMessage, bodyStreamToNodeStream(bufferedBodyStream));
            }
        },
        /**
     * Clones the body stream
     * to pass into a middleware
     */ cloneBodyStream () {
            const originalStream = bufferedBodyStream !== null && bufferedBodyStream !== void 0 ? bufferedBodyStream : requestToBodyStream(incomingMessage);
            const [stream1, stream2] = originalStream.tee();
            bufferedBodyStream = stream1;
            return stream2;
        }
    };
}

//# sourceMappingURL=body-streams.js.map