Object.defineProperty(exports, '__esModule', { value: !0 })
var react = require('react')
const useInterval = (e, r) => {
  const t = react.useRef()
  react.useEffect(() => {
    t.current = e
  }),
    react.useEffect(() => {
      if (null !== r) {
        let e = setInterval(function () {
          t.current()
        }, r)
        return () => clearInterval(e)
      }
    }, [r])
}
exports.useInterval = useInterval
//# sourceMappingURL=use-interval.js.map
