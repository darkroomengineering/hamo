import { webpack5 } from 'next/dist/compiled/webpack/webpack';
/**
 * A getter for module build info that casts to the type it should have.
 * We also expose here types to make easier to use it.
 */
export declare function getModuleBuildInfo(webpackModule: webpack5.Module): {
    nextEdgeMiddleware?: EdgeMiddlewareMeta | undefined;
    nextEdgeSSR?: EdgeSSRMeta | undefined;
    nextUsedEnvVars?: Set<string> | undefined;
    nextWasmMiddlewareBinding?: WasmBinding | undefined;
    usingIndirectEval?: boolean | Set<string> | undefined;
};
export interface EdgeMiddlewareMeta {
    page: string;
}
export interface EdgeSSRMeta {
    isServerComponent: boolean;
    page: string;
}
export interface WasmBinding {
    filePath: string;
    name: string;
}
