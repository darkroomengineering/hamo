"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = middlewareSSRLoader;
var _getModuleBuildInfo = require("../get-module-build-info");
var _stringifyRequest = require("../../stringify-request");
async function middlewareSSRLoader() {
    const { dev , page , buildId , absolutePagePath , absoluteAppPath , absoluteAppServerPath , absoluteDocumentPath , absolute500Path , absoluteErrorPath , isServerComponent , stringifiedConfig ,  } = this.getOptions();
    const buildInfo = (0, _getModuleBuildInfo).getModuleBuildInfo(this._module);
    buildInfo.nextEdgeSSR = {
        isServerComponent: isServerComponent === 'true',
        page: page
    };
    const stringifiedPagePath = (0, _stringifyRequest).stringifyRequest(this, absolutePagePath);
    const stringifiedAppPath = (0, _stringifyRequest).stringifyRequest(this, absoluteAppPath);
    const stringifiedAppServerPath = absoluteAppServerPath ? (0, _stringifyRequest).stringifyRequest(this, absoluteAppServerPath) : null;
    const stringifiedErrorPath = (0, _stringifyRequest).stringifyRequest(this, absoluteErrorPath);
    const stringifiedDocumentPath = (0, _stringifyRequest).stringifyRequest(this, absoluteDocumentPath);
    const stringified500Path = absolute500Path ? (0, _stringifyRequest).stringifyRequest(this, absolute500Path) : null;
    const transformed = `
    import { adapter } from 'next/dist/server/web/adapter'
    import { RouterContext } from 'next/dist/shared/lib/router-context'

    import { getRender } from 'next/dist/build/webpack/loaders/next-middleware-ssr-loader/render'

    import Document from ${stringifiedDocumentPath}

    const appMod = require(${stringifiedAppPath})
    const appServerMod = ${stringifiedAppServerPath ? `require(${stringifiedAppServerPath})` : 'null'}
    const pageMod = require(${stringifiedPagePath})
    const errorMod = require(${stringifiedErrorPath})
    const error500Mod = ${stringified500Path ? `require(${stringified500Path})` : 'null'}


    const buildManifest = self.__BUILD_MANIFEST
    const reactLoadableManifest = self.__REACT_LOADABLE_MANIFEST
    const rscManifest = self.__RSC_MANIFEST

    const render = getRender({
      dev: ${dev},
      page: ${JSON.stringify(page)},
      appMod,
      pageMod,
      errorMod,
      error500Mod,
      Document,
      buildManifest,
      reactLoadableManifest,
      serverComponentManifest: ${isServerComponent} ? rscManifest : null,
      appServerMod,
      config: ${stringifiedConfig},
      buildId: ${JSON.stringify(buildId)},
    })

    export default function rscMiddleware(opts) {
      return adapter({
        ...opts,
        handler: render
      })
    }`;
    return transformed;
}

//# sourceMappingURL=index.js.map