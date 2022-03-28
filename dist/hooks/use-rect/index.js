Object.defineProperty(exports, '__esModule', { value: !0 })
var debounce = require('debounce'),
  react = require('react'),
  reactUse = require('react-use')
function offsetTop(e, t = 0) {
  t += e.offsetTop
  return e.offsetParent ? offsetTop(e.offsetParent, t) : t
}
function offsetLeft(e, t = 0) {
  t += e.offsetLeft
  return e.offsetParent ? offsetLeft(e.offsetParent, t) : t
}
function _useRect(o = 1e3) {
  const t = react.useRef(),
    [r, { width: f, height: s }] = reactUse.useMeasure(),
    { width: u, height: n } = reactUse.useWindowSize(),
    [c, e] = react.useState(),
    [i, d] = react.useState(),
    a =
      (react.useLayoutEffect(() => {
        const e = debounce.debounce(a, o),
          t = new ResizeObserver(e)
        return (
          t.observe(document.body),
          () => {
            t.disconnect(), e.flush()
          }
        )
      }, [o]),
      () => {
        t.current && (d(offsetTop(t.current)), e(offsetLeft(t.current)))
      })
  return [
    (e) => {
      ;(t.current = e), r(e), a()
    },
    (e = 0) => {
      var e = {
          top: i - e,
          left: c,
          height: s,
          width: f,
          bottom: n - (i - e + s),
          right: u - (c + f),
        },
        t = 0 < e.top + e.height && 0 < e.bottom + e.height
      return { ...e, inView: t }
    },
  ]
}
const useRect =
  'undefined' != typeof window ? _useRect : () => [() => {}, void 0]
;(exports.offsetLeft = offsetLeft),
  (exports.offsetTop = offsetTop),
  (exports.useRect = useRect)
//# sourceMappingURL=index.js.map
