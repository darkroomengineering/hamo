"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getPageFromPath = getPageFromPath;
exports.createPagesMapping = createPagesMapping;
exports.getPageRuntime = getPageRuntime;
exports.invalidatePageRuntimeCache = invalidatePageRuntimeCache;
exports.getEdgeServerEntry = getEdgeServerEntry;
exports.getServerlessEntry = getServerlessEntry;
exports.getClientEntry = getClientEntry;
exports.createEntrypoints = createEntrypoints;
exports.runDependingOnPageType = runDependingOnPageType;
exports.finalizeEntrypoint = finalizeEntrypoint;
var _fs = _interopRequireDefault(require("fs"));
var _chalk = _interopRequireDefault(require("next/dist/compiled/chalk"));
var _path = require("path");
var _querystring = require("querystring");
var _constants = require("../lib/constants");
var _constants1 = require("../shared/lib/constants");
var _utils = require("../server/utils");
var _log = require("./output/log");
var _swc = require("../build/swc");
var _utils1 = require("./utils");
var _normalizePathSep = require("../shared/lib/page-path/normalize-path-sep");
var _normalizePagePath = require("../shared/lib/page-path/normalize-page-path");
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function getPageFromPath(pagePath, pageExtensions) {
    const extensions = pagePath.includes('/_app.server.') ? (0, _utils1).withoutRSCExtensions(pageExtensions) : pageExtensions;
    const page = (0, _normalizePathSep).normalizePathSep(pagePath.replace(new RegExp(`\\.+(${extensions.join('|')})$`), '')).replace(/\/index$/, '');
    return page === '' ? '/' : page;
}
function createPagesMapping({ hasServerComponents , isDev , pageExtensions , pagePaths  }) {
    const previousPages = {};
    const pages = pagePaths.reduce((result, pagePath)=>{
        // Do not process .d.ts files inside the `pages` folder
        if (pagePath.endsWith('.d.ts') && pageExtensions.includes('ts')) {
            return result;
        }
        const pageKey = getPageFromPath(pagePath, pageExtensions);
        // Assume that if there's a Client Component, that there is
        // a matching Server Component that will map to the page.
        // so we will not process it
        if (hasServerComponents && /\.client$/.test(pageKey)) {
            return result;
        }
        if (pageKey in result) {
            (0, _log).warn(`Duplicate page detected. ${_chalk.default.cyan((0, _path).join('pages', previousPages[pageKey]))} and ${_chalk.default.cyan((0, _path).join('pages', pagePath))} both resolve to ${_chalk.default.cyan(pageKey)}.`);
        } else {
            previousPages[pageKey] = pagePath;
        }
        result[pageKey] = (0, _normalizePathSep).normalizePathSep((0, _path).join(_constants.PAGES_DIR_ALIAS, pagePath));
        return result;
    }, {});
    // In development we always alias these to allow Webpack to fallback to
    // the correct source file so that HMR can work properly when a file is
    // added or removed.
    if (isDev) {
        delete pages['/_app'];
        delete pages['/_app.server'];
        delete pages['/_error'];
        delete pages['/_document'];
    }
    const root = isDev ? _constants.PAGES_DIR_ALIAS : 'next/dist/pages';
    return {
        '/_app': `${root}/_app`,
        '/_error': `${root}/_error`,
        '/_document': `${root}/_document`,
        ...hasServerComponents ? {
            '/_app.server': `${root}/_app.server`
        } : {},
        ...pages
    };
}
const cachedPageRuntimeConfig = new Map();
async function getPageRuntime(pageFilePath, nextConfig, isDev) {
    var ref, ref1;
    if (!((ref = nextConfig.experimental) === null || ref === void 0 ? void 0 : ref.reactRoot)) return undefined;
    const globalRuntime = (ref1 = nextConfig.experimental) === null || ref1 === void 0 ? void 0 : ref1.runtime;
    const cached = cachedPageRuntimeConfig.get(pageFilePath);
    if (cached) {
        return cached[1];
    }
    let pageContent;
    try {
        pageContent = await _fs.default.promises.readFile(pageFilePath, {
            encoding: 'utf8'
        });
    } catch (err) {
        if (!isDev) throw err;
        return undefined;
    }
    // When gSSP or gSP is used, this page requires an execution runtime. If the
    // page config is not present, we fallback to the global runtime. Related
    // discussion:
    // https://github.com/vercel/next.js/discussions/34179
    let isRuntimeRequired = false;
    let pageRuntime = undefined;
    // Since these configurations should always be static analyzable, we can
    // skip these cases that "runtime" and "gSP", "gSSP" are not included in the
    // source code.
    if (/runtime|getStaticProps|getServerSideProps/.test(pageContent)) {
        try {
            const { body  } = await (0, _swc).parse(pageContent, {
                filename: pageFilePath,
                isModule: 'unknown'
            });
            for (const node of body){
                const { type , declaration  } = node;
                if (type === 'ExportDeclaration') {
                    var ref2, ref3;
                    // Match `export const config`
                    const valueNode = declaration === null || declaration === void 0 ? void 0 : (ref2 = declaration.declarations) === null || ref2 === void 0 ? void 0 : ref2[0];
                    if ((valueNode === null || valueNode === void 0 ? void 0 : (ref3 = valueNode.id) === null || ref3 === void 0 ? void 0 : ref3.value) === 'config') {
                        var ref4;
                        const props = valueNode.init.properties;
                        const runtimeKeyValue = props.find((prop)=>prop.key.value === 'runtime'
                        );
                        const runtime = runtimeKeyValue === null || runtimeKeyValue === void 0 ? void 0 : (ref4 = runtimeKeyValue.value) === null || ref4 === void 0 ? void 0 : ref4.value;
                        pageRuntime = runtime === 'edge' || runtime === 'nodejs' ? runtime : pageRuntime;
                    } else if ((declaration === null || declaration === void 0 ? void 0 : declaration.type) === 'FunctionDeclaration') {
                        var ref5;
                        // Match `export function getStaticProps | getServerSideProps`
                        const identifier = (ref5 = declaration.identifier) === null || ref5 === void 0 ? void 0 : ref5.value;
                        if (identifier === 'getStaticProps' || identifier === 'getServerSideProps') {
                            isRuntimeRequired = true;
                        }
                    }
                } else if (type === 'ExportNamedDeclaration') {
                    // Match `export { getStaticProps | getServerSideProps } <from '../..'>`
                    const { specifiers  } = node;
                    for (const specifier of specifiers){
                        const { orig  } = specifier;
                        const hasDataFetchingExports = specifier.type === 'ExportSpecifier' && (orig === null || orig === void 0 ? void 0 : orig.type) === 'Identifier' && ((orig === null || orig === void 0 ? void 0 : orig.value) === 'getStaticProps' || (orig === null || orig === void 0 ? void 0 : orig.value) === 'getServerSideProps');
                        if (hasDataFetchingExports) {
                            isRuntimeRequired = true;
                            break;
                        }
                    }
                }
            }
        } catch (err) {}
    }
    if (!pageRuntime) {
        if (isRuntimeRequired) {
            pageRuntime = globalRuntime;
        }
    }
    cachedPageRuntimeConfig.set(pageFilePath, [
        Date.now(),
        pageRuntime
    ]);
    return pageRuntime;
}
function invalidatePageRuntimeCache(pageFilePath, safeTime) {
    const cached = cachedPageRuntimeConfig.get(pageFilePath);
    if (cached && cached[0] < safeTime) {
        cachedPageRuntimeConfig.delete(pageFilePath);
    }
}
function getEdgeServerEntry(opts) {
    if (opts.page.match(_constants.MIDDLEWARE_ROUTE)) {
        const loaderParams = {
            absolutePagePath: opts.absolutePagePath,
            page: opts.page
        };
        return `next-middleware-loader?${(0, _querystring).stringify(loaderParams)}!`;
    }
    const loaderParams = {
        absolute500Path: opts.pages['/500'] || '',
        absoluteAppPath: opts.pages['/_app'],
        absoluteAppServerPath: opts.pages['/_app.server'],
        absoluteDocumentPath: opts.pages['/_document'],
        absoluteErrorPath: opts.pages['/_error'],
        absolutePagePath: opts.absolutePagePath,
        buildId: opts.buildId,
        dev: opts.isDev,
        isServerComponent: (0, _utils1).isServerComponentPage(opts.config, opts.absolutePagePath),
        page: opts.page,
        stringifiedConfig: JSON.stringify(opts.config)
    };
    return `next-middleware-ssr-loader?${(0, _querystring).stringify(loaderParams)}!`;
}
function getServerlessEntry(opts) {
    const loaderParams = {
        absolute404Path: opts.pages['/404'] || '',
        absoluteAppPath: opts.pages['/_app'],
        absoluteAppServerPath: opts.pages['/_app.server'],
        absoluteDocumentPath: opts.pages['/_document'],
        absoluteErrorPath: opts.pages['/_error'],
        absolutePagePath: opts.absolutePagePath,
        assetPrefix: opts.config.assetPrefix,
        basePath: opts.config.basePath,
        buildId: opts.buildId,
        canonicalBase: opts.config.amp.canonicalBase || '',
        distDir: _constants.DOT_NEXT_ALIAS,
        generateEtags: opts.config.generateEtags ? 'true' : '',
        i18n: opts.config.i18n ? JSON.stringify(opts.config.i18n) : '',
        // base64 encode to make sure contents don't break webpack URL loading
        loadedEnvFiles: Buffer.from(JSON.stringify(opts.envFiles)).toString('base64'),
        page: opts.page,
        poweredByHeader: opts.config.poweredByHeader ? 'true' : '',
        previewProps: JSON.stringify(opts.previewMode),
        reactRoot: !!opts.config.experimental.reactRoot ? 'true' : '',
        runtimeConfig: Object.keys(opts.config.publicRuntimeConfig).length > 0 || Object.keys(opts.config.serverRuntimeConfig).length > 0 ? JSON.stringify({
            publicRuntimeConfig: opts.config.publicRuntimeConfig,
            serverRuntimeConfig: opts.config.serverRuntimeConfig
        }) : ''
    };
    return `next-serverless-loader?${(0, _querystring).stringify(loaderParams)}!`;
}
function getClientEntry(opts) {
    const loaderOptions = {
        absolutePagePath: opts.absolutePagePath,
        page: opts.page
    };
    const pageLoader = `next-client-pages-loader?${(0, _querystring).stringify(loaderOptions)}!`;
    // Make sure next/router is a dependency of _app or else chunk splitting
    // might cause the router to not be able to load causing hydration
    // to fail
    return opts.page === '/_app' ? [
        pageLoader,
        require.resolve('../client/router')
    ] : pageLoader;
}
async function createEntrypoints(params) {
    const { config , pages , pagesDir , isDev , target  } = params;
    const edgeServer = {};
    const server = {};
    const client = {};
    await Promise.all(Object.keys(pages).map(async (page)=>{
        const bundleFile = (0, _normalizePagePath).normalizePagePath(page);
        const clientBundlePath = _path.posix.join('pages', bundleFile);
        const serverBundlePath = _path.posix.join('pages', bundleFile);
        runDependingOnPageType({
            page,
            pageRuntime: await getPageRuntime(!pages[page].startsWith(_constants.PAGES_DIR_ALIAS) ? require.resolve(pages[page]) : (0, _path).join(pagesDir, pages[page].replace(_constants.PAGES_DIR_ALIAS, '')), config, isDev),
            onClient: ()=>{
                client[clientBundlePath] = getClientEntry({
                    absolutePagePath: pages[page],
                    page
                });
            },
            onServer: ()=>{
                if ((0, _utils).isTargetLikeServerless(target)) {
                    if (page !== '/_app' && page !== '/_document') {
                        server[serverBundlePath] = getServerlessEntry({
                            ...params,
                            absolutePagePath: pages[page],
                            page
                        });
                    }
                } else {
                    server[serverBundlePath] = [
                        pages[page]
                    ];
                }
            },
            onEdgeServer: ()=>{
                edgeServer[serverBundlePath] = getEdgeServerEntry({
                    ...params,
                    absolutePagePath: pages[page],
                    bundlePath: clientBundlePath,
                    isDev: false,
                    page
                });
            }
        });
    }));
    return {
        client,
        server,
        edgeServer
    };
}
function runDependingOnPageType(params) {
    if (params.page.match(_constants.MIDDLEWARE_ROUTE)) {
        return [
            params.onEdgeServer()
        ];
    } else if (params.page.match(_constants.API_ROUTE)) {
        return [
            params.onServer()
        ];
    } else if (params.page === '/_document') {
        return [
            params.onServer()
        ];
    } else if (params.page === '/_app' || params.page === '/_error' || params.page === '/404' || params.page === '/500') {
        return [
            params.onClient(),
            params.onServer()
        ];
    } else {
        return [
            params.onClient(),
            params.pageRuntime === 'edge' ? params.onEdgeServer() : params.onServer(), 
        ];
    }
}
function finalizeEntrypoint({ name , compilerType , value  }) {
    const entry = typeof value !== 'object' || Array.isArray(value) ? {
        import: value
    } : value;
    if (compilerType === 'server') {
        const isApi = name.startsWith('pages/api/');
        return {
            publicPath: isApi ? '' : undefined,
            runtime: isApi ? 'webpack-api-runtime' : 'webpack-runtime',
            layer: isApi ? 'api' : undefined,
            ...entry
        };
    }
    if (compilerType === 'edge-server') {
        return {
            layer: _constants.MIDDLEWARE_ROUTE.test(name) ? 'middleware' : undefined,
            library: {
                name: [
                    '_ENTRIES',
                    `middleware_[name]`
                ],
                type: 'assign'
            },
            runtime: _constants1.EDGE_RUNTIME_WEBPACK,
            asyncChunks: false,
            ...entry
        };
    }
    if (// Client special cases
    name !== 'polyfills' && name !== 'main' && name !== 'amp' && name !== 'react-refresh') {
        return {
            dependOn: name.startsWith('pages/') && name !== 'pages/_app' ? 'pages/_app' : 'main',
            ...entry
        };
    }
    return entry;
}

//# sourceMappingURL=entries.js.map