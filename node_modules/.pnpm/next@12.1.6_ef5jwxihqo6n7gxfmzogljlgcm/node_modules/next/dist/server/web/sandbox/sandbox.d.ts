import type { WasmBinding } from '../../../build/webpack/loaders/get-module-build-info';
import type { RequestData, FetchEventResult } from '../types';
export declare function run(params: {
    name: string;
    env: string[];
    onWarning: (warn: Error) => void;
    paths: string[];
    request: RequestData;
    useCache: boolean;
    wasm: WasmBinding[];
}): Promise<FetchEventResult>;
