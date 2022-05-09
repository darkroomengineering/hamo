import type { NextConfigComplete, NextConfig } from '../server/config-shared';
import type { PageRuntime } from '../server/config-shared';
import type { webpack5 } from 'next/dist/compiled/webpack/webpack';
import type { LoadedEnvFiles } from '@next/env';
import { __ApiPreviewProps } from '../server/api-utils';
declare type ObjectValue<T> = T extends {
    [key: string]: infer V;
} ? V : never;
/**
 * For a given page path removes the provided extensions. `/_app.server` is a
 * special case because it is the only page where we want to preserve the RSC
 * server extension.
 */
export declare function getPageFromPath(pagePath: string, pageExtensions: string[]): string;
export declare function createPagesMapping({ hasServerComponents, isDev, pageExtensions, pagePaths, }: {
    hasServerComponents: boolean;
    isDev: boolean;
    pageExtensions: string[];
    pagePaths: string[];
}): {
    [page: string]: string;
};
export declare function getPageRuntime(pageFilePath: string, nextConfig: Partial<NextConfig>, isDev?: boolean): Promise<PageRuntime>;
export declare function invalidatePageRuntimeCache(pageFilePath: string, safeTime: number): void;
interface CreateEntrypointsParams {
    buildId: string;
    config: NextConfigComplete;
    envFiles: LoadedEnvFiles;
    isDev?: boolean;
    pages: {
        [page: string]: string;
    };
    pagesDir: string;
    previewMode: __ApiPreviewProps;
    target: 'server' | 'serverless' | 'experimental-serverless-trace';
}
export declare function getEdgeServerEntry(opts: {
    absolutePagePath: string;
    buildId: string;
    bundlePath: string;
    config: NextConfigComplete;
    isDev: boolean;
    page: string;
    pages: {
        [page: string]: string;
    };
}): ObjectValue<webpack5.EntryObject>;
export declare function getServerlessEntry(opts: {
    absolutePagePath: string;
    buildId: string;
    config: NextConfigComplete;
    envFiles: LoadedEnvFiles;
    page: string;
    previewMode: __ApiPreviewProps;
    pages: {
        [page: string]: string;
    };
}): ObjectValue<webpack5.EntryObject>;
export declare function getClientEntry(opts: {
    absolutePagePath: string;
    page: string;
}): string | string[];
export declare function createEntrypoints(params: CreateEntrypointsParams): Promise<{
    client: webpack5.EntryObject;
    server: webpack5.EntryObject;
    edgeServer: webpack5.EntryObject;
}>;
export declare function runDependingOnPageType<T>(params: {
    onClient: () => T;
    onEdgeServer: () => T;
    onServer: () => T;
    page: string;
    pageRuntime: PageRuntime;
}): T[];
export declare function finalizeEntrypoint({ name, compilerType, value, }: {
    compilerType?: 'client' | 'server' | 'edge-server';
    name: string;
    value: ObjectValue<webpack5.EntryObject>;
}): ObjectValue<webpack5.EntryObject>;
export {};
