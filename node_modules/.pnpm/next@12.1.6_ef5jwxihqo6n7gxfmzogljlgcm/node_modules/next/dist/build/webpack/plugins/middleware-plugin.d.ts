import type { WasmBinding } from '../loaders/get-module-build-info';
import { webpack5 } from 'next/dist/compiled/webpack/webpack';
export interface MiddlewareManifest {
    version: 1;
    sortedMiddleware: string[];
    clientInfo: [location: string, isSSR: boolean][];
    middleware: {
        [page: string]: {
            env: string[];
            files: string[];
            name: string;
            page: string;
            regexp: string;
            wasm?: WasmBinding[];
        };
    };
}
export default class MiddlewarePlugin {
    dev: boolean;
    constructor({ dev }: {
        dev: boolean;
    });
    apply(compiler: webpack5.Compiler): void;
}
