Object.defineProperty(exports, '__esModule', { value: !0 })
var rafz = require('@react-spring/rafz'),
  react = require('react'),
  uuid = require('uuid')
const callbacks = {}
function useFrame(e, r = 0, a = []) {
  const c = react.useMemo(() => uuid.v4(), [])
  react.useLayoutEffect(() => {
    if (e)
      return (
        (callbacks[c] = { callback: e, priority: r }),
        () => {
          delete callbacks[c]
        }
      )
  }, [e, c, r, ...a])
}
rafz.raf.onFrame(
  () => (
    Object.entries(callbacks)
      .sort((e, r) => e[1].priority - r[1].priority)
      .forEach(([, { callback: e }]) => {
        e(rafz.raf.now())
      }),
    !0
  )
),
  (exports.useFrame = useFrame)
//# sourceMappingURL=use-frame.js.map
