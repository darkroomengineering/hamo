/// <reference types="react" />
export declare function readableStreamTee<T = any>(readable: ReadableStream<T>): [ReadableStream<T>, ReadableStream<T>];
export declare function chainStreams<T>(streams: ReadableStream<T>[]): ReadableStream<T>;
export declare function streamFromArray(strings: string[]): ReadableStream<Uint8Array>;
export declare function streamToString(stream: ReadableStream<Uint8Array>): Promise<string>;
export declare function encodeText(input: string): Uint8Array;
export declare function decodeText(input?: Uint8Array, textDecoder?: TextDecoder): string;
export declare function createBufferedTransformStream(): TransformStream<Uint8Array, Uint8Array>;
export declare function createFlushEffectStream(handleFlushEffect: () => string): TransformStream<Uint8Array, Uint8Array>;
export declare function renderToInitialStream({ ReactDOMServer, element, }: {
    ReactDOMServer: any;
    element: React.ReactElement;
}): Promise<ReadableStream<Uint8Array> & {
    allReady?: Promise<void>;
}>;
export declare function continueFromInitialStream({ suffix, dataStream, generateStaticHTML, flushEffectHandler, renderStream, }: {
    suffix?: string;
    dataStream?: ReadableStream<Uint8Array>;
    generateStaticHTML: boolean;
    flushEffectHandler?: () => string;
    renderStream: ReadableStream<Uint8Array> & {
        allReady?: Promise<void>;
    };
}): Promise<ReadableStream<Uint8Array>>;
export declare function renderToStream({ ReactDOMServer, element, suffix, dataStream, generateStaticHTML, flushEffectHandler, }: {
    ReactDOMServer: typeof import('react-dom/server');
    element: React.ReactElement;
    suffix?: string;
    dataStream?: ReadableStream<Uint8Array>;
    generateStaticHTML: boolean;
    flushEffectHandler?: () => string;
}): Promise<ReadableStream<Uint8Array>>;
export declare function createSuffixStream(suffix: string): TransformStream<Uint8Array, Uint8Array>;
export declare function createPrefixStream(prefix: string): TransformStream<Uint8Array, Uint8Array>;
export declare function createInlineDataStream(dataStream: ReadableStream<Uint8Array>): TransformStream<Uint8Array, Uint8Array>;
