export declare type EventSwcLoadFailure = {
    eventName: string;
    payload: {
        platform: string;
        arch: string;
        nodeVersion: string;
        nextVersion: string;
        wasm?: string;
        glibcVersion?: string;
        installedSwcPackages?: string;
    };
};
export declare function eventSwcLoadFailure(event: EventSwcLoadFailure['payload']): Promise<void>;
