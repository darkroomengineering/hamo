Object.defineProperty(exports, '__esModule', { value: !0 })
var router = require('next/router'),
  react = require('react')
const useDebug = () => {
  const e = router.useRouter()
  return react.useMemo(
    () => e.asPath.includes('#debug') || 'development' === process.env.NODE_ENV,
    [e]
  )
}
exports.useDebug = useDebug
//# sourceMappingURL=use-debug.js.map
