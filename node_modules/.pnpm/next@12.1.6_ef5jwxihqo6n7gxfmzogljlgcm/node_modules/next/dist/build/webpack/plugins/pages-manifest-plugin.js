"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = void 0;
var _webpack = require("next/dist/compiled/webpack/webpack");
var _constants = require("../../../shared/lib/constants");
var _getRouteFromEntrypoint = _interopRequireDefault(require("../../../server/get-route-from-entrypoint"));
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
let edgeServerPages = {};
let nodeServerPages = {};
class PagesManifestPlugin {
    constructor({ serverless , dev , isEdgeRuntime  }){
        this.serverless = serverless;
        this.dev = dev;
        this.isEdgeRuntime = isEdgeRuntime;
    }
    createAssets(compilation, assets) {
        const entrypoints = compilation.entrypoints;
        const pages = {};
        for (const entrypoint of entrypoints.values()){
            const pagePath = (0, _getRouteFromEntrypoint).default(entrypoint.name);
            if (!pagePath) {
                continue;
            }
            const files = entrypoint.getFiles().filter((file)=>!file.includes('webpack-runtime') && !file.includes('webpack-api-runtime') && file.endsWith('.js')
            );
            // Skip _app.server entry which is empty
            if (!files.length) {
                continue;
            }
            // Write filename, replace any backslashes in path (on windows) with forwardslashes for cross-platform consistency.
            pages[pagePath] = files[files.length - 1];
            if (!this.dev) {
                if (!this.isEdgeRuntime) {
                    pages[pagePath] = pages[pagePath].slice(3);
                }
            }
            pages[pagePath] = pages[pagePath].replace(/\\/g, '/');
        }
        // This plugin is used by both the Node server and Edge server compilers,
        // we need to merge both pages to generate the full manifest.
        if (this.isEdgeRuntime) {
            edgeServerPages = pages;
        } else {
            nodeServerPages = pages;
        }
        assets[`${!this.dev && !this.isEdgeRuntime ? '../' : ''}` + _constants.PAGES_MANIFEST] = new _webpack.sources.RawSource(JSON.stringify({
            ...edgeServerPages,
            ...nodeServerPages
        }, null, 2));
    }
    apply(compiler) {
        compiler.hooks.make.tap('NextJsPagesManifest', (compilation)=>{
            // @ts-ignore TODO: Remove ignore when webpack 5 is stable
            compilation.hooks.processAssets.tap({
                name: 'NextJsPagesManifest',
                // @ts-ignore TODO: Remove ignore when webpack 5 is stable
                stage: _webpack.webpack.Compilation.PROCESS_ASSETS_STAGE_ADDITIONS
            }, (assets)=>{
                this.createAssets(compilation, assets);
            });
        });
    }
}
exports.default = PagesManifestPlugin;

//# sourceMappingURL=pages-manifest-plugin.js.map