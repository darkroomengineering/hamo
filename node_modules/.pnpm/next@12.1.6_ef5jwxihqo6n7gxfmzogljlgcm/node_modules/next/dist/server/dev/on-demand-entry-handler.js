"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.onDemandEntryHandler = onDemandEntryHandler;
exports.entries = exports.BUILT = exports.BUILDING = exports.ADDED = void 0;
var _events = require("events");
var _findPageFile = require("../lib/find-page-file");
var _entries = require("../../build/entries");
var _path = require("path");
var _normalizePathSep = require("../../shared/lib/page-path/normalize-path-sep");
var _normalizePagePath = require("../../shared/lib/page-path/normalize-page-path");
var _ensureLeadingSlash = require("../../shared/lib/page-path/ensure-leading-slash");
var _removePagePathTail = require("../../shared/lib/page-path/remove-page-path-tail");
var _require = require("../require");
var _output = require("../../build/output");
var _getRouteFromEntrypoint = _interopRequireDefault(require("../get-route-from-entrypoint"));
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const ADDED = Symbol('added');
exports.ADDED = ADDED;
const BUILDING = Symbol('building');
exports.BUILDING = BUILDING;
const BUILT = Symbol('built');
exports.BUILT = BUILT;
const entries = {};
exports.entries = entries;
function onDemandEntryHandler({ maxInactiveAge , multiCompiler , nextConfig , pagesBufferLength , pagesDir , watcher  }) {
    const invalidator = new Invalidator(watcher);
    const doneCallbacks = new _events.EventEmitter();
    const lastClientAccessPages = [
        ''
    ];
    for (const compiler of multiCompiler.compilers){
        compiler.hooks.make.tap('NextJsOnDemandEntries', (_compilation)=>{
            invalidator.startBuilding();
        });
    }
    function getPagePathsFromEntrypoints(type, entrypoints) {
        const pagePaths = [];
        for (const entrypoint of entrypoints.values()){
            const page = (0, _getRouteFromEntrypoint).default(entrypoint.name);
            if (page) {
                pagePaths.push(`${type}${page}`);
            }
        }
        return pagePaths;
    }
    multiCompiler.hooks.done.tap('NextJsOnDemandEntries', (multiStats)=>{
        if (invalidator.rebuildAgain) {
            return invalidator.doneBuilding();
        }
        const [clientStats, serverStats, edgeServerStats] = multiStats.stats;
        const pagePaths = [
            ...getPagePathsFromEntrypoints('client', clientStats.compilation.entrypoints),
            ...getPagePathsFromEntrypoints('server', serverStats.compilation.entrypoints),
            ...edgeServerStats ? getPagePathsFromEntrypoints('edge-server', edgeServerStats.compilation.entrypoints) : [], 
        ];
        for (const page of pagePaths){
            const entry = entries[page];
            if (!entry) {
                continue;
            }
            if (entry.status !== BUILDING) {
                continue;
            }
            entry.status = BUILT;
            doneCallbacks.emit(page);
        }
        invalidator.doneBuilding();
    });
    const pingIntervalTime = Math.max(1000, Math.min(5000, maxInactiveAge));
    setInterval(function() {
        disposeInactiveEntries(lastClientAccessPages, maxInactiveAge);
    }, pingIntervalTime + 1000).unref();
    function handlePing(pg) {
        const page = (0, _normalizePathSep).normalizePathSep(pg);
        const pageKey = `client${page}`;
        const entryInfo = entries[pageKey];
        // If there's no entry, it may have been invalidated and needs to be re-built.
        if (!entryInfo) {
            // if (page !== lastEntry) client pings, but there's no entry for page
            return {
                invalid: true
            };
        }
        // 404 is an on demand entry but when a new page is added we have to refresh the page
        const toSend = page === '/_error' ? {
            invalid: true
        } : {
            success: true
        };
        // We don't need to maintain active state of anything other than BUILT entries
        if (entryInfo.status !== BUILT) return;
        // If there's an entryInfo
        if (!lastClientAccessPages.includes(pageKey)) {
            lastClientAccessPages.unshift(pageKey);
            // Maintain the buffer max length
            if (lastClientAccessPages.length > pagesBufferLength) {
                lastClientAccessPages.pop();
            }
        }
        entryInfo.lastActiveTime = Date.now();
        entryInfo.dispose = false;
        return toSend;
    }
    return {
        async ensurePage (page, clientOnly) {
            const pagePathData = await findPagePathData(pagesDir, page, nextConfig.pageExtensions);
            let entryAdded = false;
            const addPageEntry = (type)=>{
                return new Promise((resolve, reject)=>{
                    const pageKey = `${type}${pagePathData.page}`;
                    if (entries[pageKey]) {
                        entries[pageKey].dispose = false;
                        entries[pageKey].lastActiveTime = Date.now();
                        if (entries[pageKey].status === BUILT) {
                            resolve();
                            return;
                        }
                    } else {
                        entryAdded = true;
                        entries[pageKey] = {
                            absolutePagePath: pagePathData.absolutePagePath,
                            bundlePath: pagePathData.bundlePath,
                            dispose: false,
                            lastActiveTime: Date.now(),
                            status: ADDED
                        };
                    }
                    doneCallbacks.once(pageKey, (err)=>{
                        if (err) return reject(err);
                        resolve();
                    });
                });
            };
            const promises = (0, _entries).runDependingOnPageType({
                page: pagePathData.page,
                pageRuntime: await (0, _entries).getPageRuntime(pagePathData.absolutePagePath, nextConfig),
                onClient: ()=>addPageEntry('client')
                ,
                onServer: ()=>addPageEntry('server')
                ,
                onEdgeServer: ()=>addPageEntry('edge-server')
            });
            if (entryAdded) {
                (0, _output).reportTrigger(!clientOnly && promises.length > 1 ? `${pagePathData.page} (client and server)` : pagePathData.page);
                invalidator.invalidate();
            }
            return Promise.all(promises);
        },
        onHMR (client) {
            client.addEventListener('message', ({ data  })=>{
                try {
                    const parsedData = JSON.parse(typeof data !== 'string' ? data.toString() : data);
                    if (parsedData.event === 'ping') {
                        const result = handlePing(parsedData.page);
                        client.send(JSON.stringify({
                            ...result,
                            event: 'pong'
                        }));
                    }
                } catch (_) {}
            });
        }
    };
}
function disposeInactiveEntries(lastClientAccessPages, maxInactiveAge) {
    Object.keys(entries).forEach((page)=>{
        const { lastActiveTime , status , dispose  } = entries[page];
        // Skip pages already scheduled for disposing
        if (dispose) return;
        // This means this entry is currently building or just added
        // We don't need to dispose those entries.
        if (status !== BUILT) return;
        // We should not build the last accessed page even we didn't get any pings
        // Sometimes, it's possible our XHR ping to wait before completing other requests.
        // In that case, we should not dispose the current viewing page
        if (lastClientAccessPages.includes(page)) return;
        if (lastActiveTime && Date.now() - lastActiveTime > maxInactiveAge) {
            entries[page].dispose = true;
        }
    });
}
// Make sure only one invalidation happens at a time
// Otherwise, webpack hash gets changed and it'll force the client to reload.
class Invalidator {
    constructor(watcher){
        this.watcher = watcher;
        // contains an array of types of compilers currently building
        this.building = false;
        this.rebuildAgain = false;
    }
    invalidate() {
        // If there's a current build is processing, we won't abort it by invalidating.
        // (If aborted, it'll cause a client side hard reload)
        // But let it to invalidate just after the completion.
        // So, it can re-build the queued pages at once.
        if (this.building) {
            this.rebuildAgain = true;
            return;
        }
        this.building = true;
        this.watcher.invalidate();
    }
    startBuilding() {
        this.building = true;
    }
    doneBuilding() {
        this.building = false;
        if (this.rebuildAgain) {
            this.rebuildAgain = false;
            this.invalidate();
        }
    }
}
/**
 * Attempts to find a page file path from the given pages absolute directory,
 * a page and allowed extensions. If the page can't be found it will throw an
 * error. It defaults the `/_error` page to Next.js internal error page.
 *
 * @param pagesDir Absolute path to the pages folder with trailing `/pages`.
 * @param normalizedPagePath The page normalized (it will be denormalized).
 * @param pageExtensions Array of page extensions.
 */ async function findPagePathData(pagesDir, page, extensions) {
    const normalizedPagePath = tryToNormalizePagePath(page);
    const pagePath = await (0, _findPageFile).findPageFile(pagesDir, normalizedPagePath, extensions);
    if (pagePath !== null) {
        const pageUrl = (0, _ensureLeadingSlash).ensureLeadingSlash((0, _removePagePathTail).removePagePathTail((0, _normalizePathSep).normalizePathSep(pagePath), extensions));
        return {
            absolutePagePath: (0, _path).join(pagesDir, pagePath),
            bundlePath: _path.posix.join('pages', (0, _normalizePagePath).normalizePagePath(pageUrl)),
            page: _path.posix.normalize(pageUrl)
        };
    }
    if (page === '/_error') {
        return {
            absolutePagePath: require.resolve('next/dist/pages/_error'),
            bundlePath: page,
            page: (0, _normalizePathSep).normalizePathSep(page)
        };
    } else {
        throw (0, _require).pageNotFoundError(normalizedPagePath);
    }
}
function tryToNormalizePagePath(page) {
    try {
        return (0, _normalizePagePath).normalizePagePath(page);
    } catch (err) {
        console.error(err);
        throw (0, _require).pageNotFoundError(page);
    }
}

//# sourceMappingURL=on-demand-entry-handler.js.map