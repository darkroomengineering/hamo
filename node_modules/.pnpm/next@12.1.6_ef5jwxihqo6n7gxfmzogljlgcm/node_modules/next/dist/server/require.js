"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.pageNotFoundError = pageNotFoundError;
exports.getPagePath = getPagePath;
exports.requirePage = requirePage;
exports.requireFontManifest = requireFontManifest;
exports.getMiddlewareInfo = getMiddlewareInfo;
var _fs = require("fs");
var _path = require("path");
var _constants = require("../shared/lib/constants");
var _normalizeLocalePath = require("../shared/lib/i18n/normalize-locale-path");
var _normalizePagePath = require("../shared/lib/page-path/normalize-page-path");
var _denormalizePagePath = require("../shared/lib/page-path/denormalize-page-path");
function pageNotFoundError(page) {
    const err = new Error(`Cannot find module for page: ${page}`);
    err.code = 'ENOENT';
    return err;
}
function getPagePath(page, distDir, serverless, dev, locales) {
    const serverBuildPath = (0, _path).join(distDir, serverless && !dev ? _constants.SERVERLESS_DIRECTORY : _constants.SERVER_DIRECTORY);
    const pagesManifest = require((0, _path).join(serverBuildPath, _constants.PAGES_MANIFEST));
    try {
        page = (0, _denormalizePagePath).denormalizePagePath((0, _normalizePagePath).normalizePagePath(page));
    } catch (err) {
        console.error(err);
        throw pageNotFoundError(page);
    }
    let pagePath = pagesManifest[page];
    if (!pagesManifest[page] && locales) {
        const manifestNoLocales = {};
        for (const key of Object.keys(pagesManifest)){
            manifestNoLocales[(0, _normalizeLocalePath).normalizeLocalePath(key, locales).pathname] = pagesManifest[key];
        }
        pagePath = manifestNoLocales[page];
    }
    if (!pagePath) {
        throw pageNotFoundError(page);
    }
    return (0, _path).join(serverBuildPath, pagePath);
}
function requirePage(page, distDir, serverless) {
    const pagePath = getPagePath(page, distDir, serverless);
    if (pagePath.endsWith('.html')) {
        return _fs.promises.readFile(pagePath, 'utf8');
    }
    return require(pagePath);
}
function requireFontManifest(distDir, serverless) {
    const serverBuildPath = (0, _path).join(distDir, serverless ? _constants.SERVERLESS_DIRECTORY : _constants.SERVER_DIRECTORY);
    const fontManifest = require((0, _path).join(serverBuildPath, _constants.FONT_MANIFEST));
    return fontManifest;
}
function getMiddlewareInfo(params) {
    const serverBuildPath = (0, _path).join(params.distDir, params.serverless && !params.dev ? _constants.SERVERLESS_DIRECTORY : _constants.SERVER_DIRECTORY);
    const middlewareManifest = require((0, _path).join(serverBuildPath, _constants.MIDDLEWARE_MANIFEST));
    let page;
    try {
        page = (0, _denormalizePagePath).denormalizePagePath((0, _normalizePagePath).normalizePagePath(params.page));
    } catch (err) {
        throw pageNotFoundError(params.page);
    }
    let pageInfo = middlewareManifest.middleware[page];
    if (!pageInfo) {
        throw pageNotFoundError(page);
    }
    var _env, _wasm;
    return {
        name: pageInfo.name,
        paths: pageInfo.files.map((file)=>(0, _path).join(params.distDir, file)
        ),
        env: (_env = pageInfo.env) !== null && _env !== void 0 ? _env : [],
        wasm: ((_wasm = pageInfo.wasm) !== null && _wasm !== void 0 ? _wasm : []).map((binding)=>({
                ...binding,
                filePath: (0, _path).join(params.distDir, binding.filePath)
            })
        )
    };
}

//# sourceMappingURL=require.js.map