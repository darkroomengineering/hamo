import { FetchEvent } from '../spec-compliant/fetch-event';
import { NextRequest } from './request';
export declare class NextFetchEvent extends FetchEvent {
    sourcePage: string;
    constructor(params: {
        request: NextRequest;
        page: string;
    });
    /**
     * @deprecated The `request` is now the first parameter and the API is now async.
     *
     * Read more: https://nextjs.org/docs/messages/middleware-new-signature
     */
    get request(): void;
    /**
     * @deprecated Using `respondWith` is no longer needed.
     *
     * Read more: https://nextjs.org/docs/messages/middleware-new-signature
     */
    respondWith(): void;
}
