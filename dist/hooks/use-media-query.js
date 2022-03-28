Object.defineProperty(exports, '__esModule', { value: !0 })
var react = require('react')
const useMediaQuery = (e) => {
  const [r, t] = react.useState(void 0),
    c = (e) => {
      t(e.matches)
    }
  return (
    react.useEffect(() => {
      const r = window.matchMedia(e)
      c(r)
      try {
        r?.addEventListener('change', c)
      } catch (e) {
        try {
          r?.addListener(c)
        } catch (e) {
          console.error(e)
        }
      }
      return () => {
        try {
          r?.removeEventListener('change', c)
        } catch (e) {
          try {
            r?.removeListener(c)
          } catch (e) {
            console.error(e)
          }
        }
      }
    }),
    r
  )
}
exports.useMediaQuery = useMediaQuery
//# sourceMappingURL=use-media-query.js.map
