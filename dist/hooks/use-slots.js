Object.defineProperty(exports, '__esModule', { value: !0 })
var react = require('react')
const useSlots = (e = [], t = []) => {
  const r = react.useMemo(() => t && [t].flat(), [t]),
    s = react.useMemo(() => e && [e].flat(), [e])
  var o = react.useMemo(
    () => r && s && s.map((t) => r.find((e) => e.type === t)?.props.children),
    [r, s]
  )
  return e[0] ? o : o[0]
}
exports.useSlots = useSlots
//# sourceMappingURL=use-slots.js.map
