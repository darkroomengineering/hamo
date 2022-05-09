"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.replaceBasePath = replaceBasePath;
exports.hasBasePath = hasBasePath;
function replaceBasePath(pathname, basePath) {
    // ensure basePath is only stripped if it matches exactly
    // and doesn't contain extra chars e.g. basePath /docs
    // should replace for /docs, /docs/, /docs/a but not /docsss
    if (hasBasePath(pathname, basePath)) {
        pathname = pathname.slice(basePath.length);
        if (!pathname.startsWith('/')) pathname = `/${pathname}`;
    }
    return pathname;
}
function hasBasePath(pathname, basePath) {
    return typeof pathname === 'string' && (pathname === basePath || pathname.startsWith(basePath + '/'));
}

//# sourceMappingURL=router-utils.js.map