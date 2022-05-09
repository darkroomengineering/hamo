"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = void 0;
var _baseServer = _interopRequireDefault(require("./base-server"));
var _render = require("./render");
var _web = require("./api-utils/web");
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
class NextWebServer extends _baseServer.default {
    constructor(options){
        super(options);
        // Extend `renderOpts`.
        Object.assign(this.renderOpts, options.webServerConfig.extendRenderOpts);
    }
    generateRewrites() {
        // @TODO: assuming minimal mode right now
        return {
            beforeFiles: [],
            afterFiles: [],
            fallback: []
        };
    }
    handleCompression() {
    // For the web server layer, compression is automatically handled by the
    // upstream proxy (edge runtime or node server) and we can simply skip here.
    }
    getRoutesManifest() {
        return {
            headers: [],
            rewrites: {
                fallback: [],
                afterFiles: [],
                beforeFiles: []
            },
            redirects: []
        };
    }
    getPagePath() {
        // @TODO
        return '';
    }
    getPublicDir() {
        // Public files are not handled by the web server.
        return '';
    }
    getBuildId() {
        return this.serverOptions.webServerConfig.extendRenderOpts.buildId;
    }
    loadEnvConfig() {
    // The web server does not need to load the env config. This is done by the
    // runtime already.
    }
    getHasStaticDir() {
        return false;
    }
    async hasMiddleware() {
        return false;
    }
    generateImageRoutes() {
        return [];
    }
    generateStaticRoutes() {
        return [];
    }
    generateFsStaticRoutes() {
        return [];
    }
    generatePublicRoutes() {
        return [];
    }
    getMiddleware() {
        return [];
    }
    generateCatchAllMiddlewareRoute() {
        return undefined;
    }
    getFontManifest() {
        return undefined;
    }
    getMiddlewareManifest() {
        return undefined;
    }
    getPagesManifest() {
        return {
            [this.serverOptions.webServerConfig.page]: ''
        };
    }
    getFilesystemPaths() {
        return new Set();
    }
    getPrerenderManifest() {
        return {
            version: 3,
            routes: {},
            dynamicRoutes: {},
            notFoundRoutes: [],
            preview: {
                previewModeId: '',
                previewModeSigningKey: '',
                previewModeEncryptionKey: ''
            }
        };
    }
    getServerComponentManifest() {
        // @TODO: Need to return `extendRenderOpts.serverComponentManifest` here.
        return undefined;
    }
    async renderHTML(req, _res, pathname, query, renderOpts) {
        return (0, _render).renderToHTML({
            url: req.url,
            cookies: req.cookies,
            headers: req.headers
        }, {}, pathname, query, {
            ...renderOpts,
            disableOptimizedLoading: true,
            runtime: 'edge'
        });
    }
    async sendRenderResult(_req, res, options) {
        res.setHeader('X-Edge-Runtime', '1');
        // Add necessary headers.
        // @TODO: Share the isomorphic logic with server/send-payload.ts.
        if (options.poweredByHeader && options.type === 'html') {
            res.setHeader('X-Powered-By', 'Next.js');
        }
        if (!res.getHeader('Content-Type')) {
            res.setHeader('Content-Type', options.type === 'json' ? 'application/json' : 'text/html; charset=utf-8');
        }
        if (options.result.isDynamic()) {
            const writer = res.transformStream.writable.getWriter();
            options.result.pipe({
                write: (chunk)=>writer.write(chunk)
                ,
                end: ()=>writer.close()
                ,
                destroy: (err)=>writer.abort(err)
                ,
                cork: ()=>{},
                uncork: ()=>{}
            });
        } else {
            const payload = await options.result.toUnchunkedString();
            res.setHeader('Content-Length', String((0, _web).byteLength(payload)));
            if (options.generateEtags) {
                res.setHeader('ETag', await (0, _web).generateETag(payload));
            }
            res.body(payload);
        }
        res.send();
    }
    async runApi() {
        // @TODO
        return true;
    }
    async findPageComponents(pathname, query, params) {
        const result = await this.serverOptions.webServerConfig.loadComponent(pathname);
        if (!result) return null;
        return {
            query: {
                ...query || {},
                ...params || {}
            },
            components: result
        };
    }
}
exports.default = NextWebServer;

//# sourceMappingURL=web-server.js.map