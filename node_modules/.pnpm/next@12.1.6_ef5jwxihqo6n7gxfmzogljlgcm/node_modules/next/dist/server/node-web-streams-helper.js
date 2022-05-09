"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.readableStreamTee = readableStreamTee;
exports.chainStreams = chainStreams;
exports.streamFromArray = streamFromArray;
exports.streamToString = streamToString;
exports.encodeText = encodeText;
exports.decodeText = decodeText;
exports.createBufferedTransformStream = createBufferedTransformStream;
exports.createFlushEffectStream = createFlushEffectStream;
exports.renderToInitialStream = renderToInitialStream;
exports.continueFromInitialStream = continueFromInitialStream;
exports.renderToStream = renderToStream;
exports.createSuffixStream = createSuffixStream;
exports.createPrefixStream = createPrefixStream;
exports.createInlineDataStream = createInlineDataStream;
var _nonNullable = require("../lib/non-nullable");
function readableStreamTee(readable) {
    const transformStream = new TransformStream();
    const transformStream2 = new TransformStream();
    const writer = transformStream.writable.getWriter();
    const writer2 = transformStream2.writable.getWriter();
    const reader = readable.getReader();
    function read() {
        reader.read().then(({ done , value  })=>{
            if (done) {
                writer.close();
                writer2.close();
                return;
            }
            writer.write(value);
            writer2.write(value);
            read();
        });
    }
    read();
    return [
        transformStream.readable,
        transformStream2.readable
    ];
}
function chainStreams(streams) {
    const { readable , writable  } = new TransformStream();
    let promise = Promise.resolve();
    for(let i = 0; i < streams.length; ++i){
        promise = promise.then(()=>streams[i].pipeTo(writable, {
                preventClose: i + 1 < streams.length
            })
        );
    }
    return readable;
}
function streamFromArray(strings) {
    // Note: we use a TransformStream here instead of instantiating a ReadableStream
    // because the built-in ReadableStream polyfill runs strings through TextEncoder.
    const { readable , writable  } = new TransformStream();
    const writer = writable.getWriter();
    strings.forEach((str)=>writer.write(encodeText(str))
    );
    writer.close();
    return readable;
}
async function streamToString(stream) {
    const reader = stream.getReader();
    const textDecoder = new TextDecoder();
    let bufferedString = '';
    while(true){
        const { done , value  } = await reader.read();
        if (done) {
            return bufferedString;
        }
        bufferedString += decodeText(value, textDecoder);
    }
}
function encodeText(input) {
    return new TextEncoder().encode(input);
}
function decodeText(input, textDecoder) {
    return textDecoder ? textDecoder.decode(input, {
        stream: true
    }) : new TextDecoder().decode(input);
}
function createBufferedTransformStream() {
    let bufferedString = '';
    let pendingFlush = null;
    const flushBuffer = (controller)=>{
        if (!pendingFlush) {
            pendingFlush = new Promise((resolve)=>{
                setTimeout(()=>{
                    controller.enqueue(encodeText(bufferedString));
                    bufferedString = '';
                    pendingFlush = null;
                    resolve();
                }, 0);
            });
        }
        return pendingFlush;
    };
    const textDecoder = new TextDecoder();
    return new TransformStream({
        transform (chunk, controller) {
            bufferedString += decodeText(chunk, textDecoder);
            flushBuffer(controller);
        },
        flush () {
            if (pendingFlush) {
                return pendingFlush;
            }
        }
    });
}
function createFlushEffectStream(handleFlushEffect) {
    return new TransformStream({
        transform (chunk, controller) {
            const flushedChunk = encodeText(handleFlushEffect());
            controller.enqueue(flushedChunk);
            controller.enqueue(chunk);
        }
    });
}
function renderToInitialStream({ ReactDOMServer , element  }) {
    return ReactDOMServer.renderToReadableStream(element);
}
async function continueFromInitialStream({ suffix , dataStream , generateStaticHTML , flushEffectHandler , renderStream  }) {
    const closeTag = '</body></html>';
    const suffixUnclosed = suffix ? suffix.split(closeTag)[0] : null;
    if (generateStaticHTML) {
        await renderStream.allReady;
    }
    const transforms = [
        createBufferedTransformStream(),
        flushEffectHandler ? createFlushEffectStream(flushEffectHandler) : null,
        suffixUnclosed != null ? createPrefixStream(suffixUnclosed) : null,
        dataStream ? createInlineDataStream(dataStream) : null,
        suffixUnclosed != null ? createSuffixStream(closeTag) : null, 
    ].filter(_nonNullable.nonNullable);
    return transforms.reduce((readable, transform)=>readable.pipeThrough(transform)
    , renderStream);
}
async function renderToStream({ ReactDOMServer , element , suffix , dataStream , generateStaticHTML , flushEffectHandler  }) {
    const renderStream = await renderToInitialStream({
        ReactDOMServer,
        element
    });
    return continueFromInitialStream({
        suffix,
        dataStream,
        generateStaticHTML,
        flushEffectHandler,
        renderStream
    });
}
function createSuffixStream(suffix) {
    return new TransformStream({
        flush (controller) {
            if (suffix) {
                controller.enqueue(encodeText(suffix));
            }
        }
    });
}
function createPrefixStream(prefix) {
    let prefixFlushed = false;
    let prefixPrefixFlushFinished = null;
    return new TransformStream({
        transform (chunk, controller) {
            controller.enqueue(chunk);
            if (!prefixFlushed && prefix) {
                prefixFlushed = true;
                prefixPrefixFlushFinished = new Promise((res)=>{
                    // NOTE: streaming flush
                    // Enqueue prefix part before the major chunks are enqueued so that
                    // prefix won't be flushed too early to interrupt the data stream
                    setTimeout(()=>{
                        controller.enqueue(encodeText(prefix));
                        res();
                    });
                });
            }
        },
        flush (controller) {
            if (prefixPrefixFlushFinished) return prefixPrefixFlushFinished;
            if (!prefixFlushed && prefix) {
                prefixFlushed = true;
                controller.enqueue(encodeText(prefix));
            }
        }
    });
}
function createInlineDataStream(dataStream) {
    let dataStreamFinished = null;
    return new TransformStream({
        transform (chunk, controller) {
            controller.enqueue(chunk);
            if (!dataStreamFinished) {
                const dataStreamReader = dataStream.getReader();
                // NOTE: streaming flush
                // We are buffering here for the inlined data stream because the
                // "shell" stream might be chunkenized again by the underlying stream
                // implementation, e.g. with a specific high-water mark. To ensure it's
                // the safe timing to pipe the data stream, this extra tick is
                // necessary.
                dataStreamFinished = new Promise((res)=>setTimeout(async ()=>{
                        try {
                            while(true){
                                const { done , value  } = await dataStreamReader.read();
                                if (done) {
                                    return res();
                                }
                                controller.enqueue(value);
                            }
                        } catch (err) {
                            controller.error(err);
                        }
                        res();
                    }, 0)
                );
            }
        },
        flush () {
            if (dataStreamFinished) {
                return dataStreamFinished;
            }
        }
    });
}

//# sourceMappingURL=node-web-streams-helper.js.map