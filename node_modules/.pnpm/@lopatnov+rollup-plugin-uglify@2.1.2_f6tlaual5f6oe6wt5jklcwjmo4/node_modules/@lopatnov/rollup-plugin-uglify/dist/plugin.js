(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('terser'), require('rollup-pluginutils')) :
  typeof define === 'function' && define.amd ? define(['terser', 'rollup-pluginutils'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.uglify = factory(global.terser, global.rollupPluginutils));
})(this, (function (terser, rollupPluginutils) { 'use strict';

  function uglify(options) {
      if (options === void 0) { options = {}; }
      var filter = rollupPluginutils.createFilter(options.include, options.exclude);
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
              var result = terser.minify(code, options);
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

  return uglify;

}));
//# sourceMappingURL=plugin.js.map
