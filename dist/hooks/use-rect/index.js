Object.defineProperty(exports, '__esModule', { value: !0 })
var debounce = require('debounce'),
  react = require('react'),
  reactUse = require('react-use'),
  useIsomorphicLayoutEffect = require('../use-isomorphic-layout-effect.js')
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
    [f, { width: r, height: s }] = reactUse.useMeasure(),
    { width: u, height: c } = reactUse.useWindowSize(),
    [n, e] = react.useState(),
    [i, h] = react.useState(),
    a =
      (useIsomorphicLayoutEffect.useLayoutEffect(() => {
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
        t.current && (h(offsetTop(t.current)), e(offsetLeft(t.current)))
      })
  return (
    useIsomorphicLayoutEffect.useLayoutEffect(() => {
      a()
    }, [u, c]),
    [
      (e) => {
        t.current || ((t.current = e), f(e), a())
      },
      (e = 0) => {
        var e = {
            top: i - e,
            left: n,
            height: s,
            width: r,
            bottom: c - (i - e + s),
            right: u - (n + r),
          },
          t = 0 < e.top + e.height && 0 < e.bottom + e.height
        return { ...e, inView: t }
      },
    ]
  )
}
const useRect =
  'undefined' != typeof window ? _useRect : () => [() => {}, void 0]
;(exports.offsetLeft = offsetLeft),
  (exports.offsetTop = offsetTop),
  (exports.useRect = useRect)
//# sourceMappingURL=index.js.map
