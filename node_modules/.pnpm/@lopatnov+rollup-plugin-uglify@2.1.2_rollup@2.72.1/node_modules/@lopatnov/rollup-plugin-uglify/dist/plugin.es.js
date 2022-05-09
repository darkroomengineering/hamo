import { minify } from 'terser';
import { createFilter } from 'rollup-pluginutils';

function uglify(options) {
    if (options === void 0) { options = {}; }
    var filter = createFilter(options.include, options.exclude);
    return {
        name: "uglify",
        transform: function (code, id) {
            var _this = this;
            if (!filter(id)) {
                return;
            }
            if (typeof options.sourceMap === "undefined") {
                options.sourceMap = true;
            }
            if (typeof options.warnings === "undefined") {
                options.warnings = true;
            }
            var result = minify(code, options);
            if (!(result instanceof Promise)) {
                if (result.error) {
                    throw result.error;
                }
                if (result.warnings) {
                    result.warnings.forEach(function (warning) {
                        _this.warn(warning);
                    });
                }
                return {
                    code: result.code,
                    map: result.map
                };
            }
            else {
                return result;
            }
        }
    };
}

export { uglify as default };
//# sourceMappingURL=plugin.es.js.map
