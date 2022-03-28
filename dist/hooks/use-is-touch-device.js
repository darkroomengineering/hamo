Object.defineProperty(exports, '__esModule', { value: !0 })
var react = require('react')
const useIsTouchDevice = () => {
  const [e, t] = react.useState(void 0)
  return (
    react.useLayoutEffect(() => {
      const e = () => {
        t(
          'ontouchstart' in window ||
            0 < navigator.maxTouchPoints ||
            0 < navigator.msMaxTouchPoints
        )
      }
      return (
        e(),
        window.addEventListener('resize', e, !1),
        () => {
          window.removeEventListener('resize', e, !1)
        }
      )
    }, []),
    e
  )
}
exports.useIsTouchDevice = useIsTouchDevice
//# sourceMappingURL=use-is-touch-device.js.map
