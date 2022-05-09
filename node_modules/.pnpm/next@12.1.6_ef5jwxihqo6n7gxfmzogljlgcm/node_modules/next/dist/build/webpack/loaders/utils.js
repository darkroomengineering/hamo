"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.isNextBuiltinClientComponent = isNextBuiltinClientComponent;
exports.buildExports = buildExports;
exports.createServerComponentFilter = exports.createClientComponentFilter = exports.defaultJsFileExtensions = void 0;
const defaultJsFileExtensions = [
    'js',
    'mjs',
    'jsx',
    'ts',
    'tsx'
];
exports.defaultJsFileExtensions = defaultJsFileExtensions;
const imageExtensions = [
    'jpg',
    'jpeg',
    'png',
    'webp',
    'avif'
];
const nextClientComponents = [
    'link',
    'image',
    'head',
    'script'
];
const NEXT_BUILT_IN_CLIENT_RSC_REGEX = new RegExp(`[\\\\/]next[\\\\/](${nextClientComponents.join('|')})\\.js$`);
function isNextBuiltinClientComponent(resourcePath) {
    return NEXT_BUILT_IN_CLIENT_RSC_REGEX.test(resourcePath);
}
function buildExports(moduleExports, isESM) {
    let ret = '';
    Object.keys(moduleExports).forEach((key)=>{
        const exportExpression = isESM ? `export ${key === 'default' ? key : `const ${key} =`} ${moduleExports[key]}` : `exports.${key} = ${moduleExports[key]}`;
        ret += exportExpression + '\n';
    });
    return ret;
}
const createClientComponentFilter = ()=>{
    // Special cases for Next.js APIs that are considered as client components:
    // - .client.[ext]
    // - next built-in client components
    // - .[imageExt]
    const regex = new RegExp('(' + `\\.client(\\.(${defaultJsFileExtensions.join('|')}))?|` + `next/(${nextClientComponents.join('|')})(\\.js)?|` + `\\.(${imageExtensions.join('|')})` + ')$');
    return (importSource)=>regex.test(importSource)
    ;
};
exports.createClientComponentFilter = createClientComponentFilter;
const createServerComponentFilter = ()=>{
    const regex = new RegExp(`\\.server(\\.(${defaultJsFileExtensions.join('|')}))?$`);
    return (importSource)=>regex.test(importSource)
    ;
};
exports.createServerComponentFilter = createServerComponentFilter;

//# sourceMappingURL=utils.js.map