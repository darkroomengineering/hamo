import { webpack } from 'next/dist/compiled/webpack/webpack';
import type { webpack5 } from 'next/dist/compiled/webpack/webpack';
/**
 * Produce source maps for middlewares.
 * Currently we use the same compiler for browser and middlewares,
 */
export declare const getMiddlewareSourceMapPlugins: () => (MiddlewareSourceMapsPlugin | webpack.SourceMapDevToolPlugin)[];
/**
 * Produce source maps for middlewares.
 * Currently we use the same compiler for browser and middlewares,
 * so we can avoid having the custom plugins if the browser source maps
 * are emitted.
 */
declare class MiddlewareSourceMapsPlugin {
    apply(compiler: webpack5.Compiler): void;
}
export {};
