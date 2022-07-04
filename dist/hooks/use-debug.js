Object.defineProperty(exports, '__esModule', { value: !0 })
var react = require('react')
const useDebug = () => {
  return react.useMemo(
    () =>
      'undefined' != typeof window &&
      (window.location.href.includes('#debug') ||
        'development' === process.env.NODE_ENV),
    []
  )
}
exports.useDebug = useDebug
//# sourceMappingURL=use-debug.js.map
