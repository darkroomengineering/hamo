Object.defineProperty(exports, '__esModule', { value: !0 })
var router = require('next/router'),
  react = require('react'),
  rafz = require('@react-spring/rafz'),
  uuid = require('uuid'),
  debounce = require('debounce'),
  reactUse = require('react-use')
const useDebug = () => {
    const e = router.useRouter()
    return react.useMemo(
      () =>
        e.asPath.includes('#debug') || 'development' === process.env.NODE_ENV,
      [e]
    )
  },
  callbacks = {}
function useFrame(e, t = 0, r = []) {
  const s = react.useMemo(() => uuid.v4(), [])
  react.useLayoutEffect(() => {
    if (e)
      return (
        (callbacks[s] = { callback: e, priority: t }),
        () => {
          delete callbacks[s]
        }
      )
  }, [e, s, t, ...r])
}
rafz.raf.onFrame(
  () => (
    Object.entries(callbacks)
      .sort((e, t) => e[1].priority - t[1].priority)
      .forEach(([, { callback: e }]) => {
        e(rafz.raf.now())
      }),
    !0
  )
)
const useInterval = (e, t) => {
    const r = react.useRef()
    react.useEffect(() => {
      r.current = e
    }),
      react.useEffect(() => {
        if (null !== t) {
          let e = setInterval(function () {
            r.current()
          }, t)
          return () => clearInterval(e)
        }
      }, [t])
  },
  useIsTouchDevice = () => {
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
  },
  useMediaQuery = (e) => {
    const [t, r] = react.useState(void 0),
      s = (e) => {
        r(e.matches)
      }
    return (
      react.useEffect(() => {
        const t = window.matchMedia(e)
        s(t)
        try {
          t?.addEventListener('change', s)
        } catch (e) {
          try {
            t?.addListener(s)
          } catch (e) {
            console.error(e)
          }
        }
        return () => {
          try {
            t?.removeEventListener('change', s)
          } catch (e) {
            try {
              t?.removeListener(s)
            } catch (e) {
              console.error(e)
            }
          }
        }
      }),
      t
    )
  }
function offsetTop(e, t = 0) {
  t += e.offsetTop
  return e.offsetParent ? offsetTop(e.offsetParent, t) : t
}
function offsetLeft(e, t = 0) {
  t += e.offsetLeft
  return e.offsetParent ? offsetLeft(e.offsetParent, t) : t
}
function _useRect(r = 1e3) {
  const t = react.useRef(),
    [s, { width: o, height: u }] = reactUse.useMeasure(),
    { width: c, height: n } = reactUse.useWindowSize(),
    [a, e] = react.useState(),
    [i, d] = react.useState(),
    f =
      (react.useLayoutEffect(() => {
        const e = debounce.debounce(f, r),
          t = new ResizeObserver(e)
        return (
          t.observe(document.body),
          () => {
            t.disconnect(), e.flush()
          }
        )
      }, [r]),
      () => {
        t.current && (d(offsetTop(t.current)), e(offsetLeft(t.current)))
      })
  return [
    (e) => {
      ;(t.current = e), s(e), f()
    },
    (e = 0) => {
      var e = {
          top: i - e,
          left: a,
          height: u,
          width: o,
          bottom: n - (i - e + u),
          right: c - (a + o),
        },
        t = 0 < e.top + e.height && 0 < e.bottom + e.height
      return { ...e, inView: t }
    },
  ]
}
const useRect =
    'undefined' != typeof window ? _useRect : () => [() => {}, void 0],
  useSlots = (e = [], t = []) => {
    const r = react.useMemo(() => t && [t].flat(), [t]),
      s = react.useMemo(() => e && [e].flat(), [e])
    var o = react.useMemo(
      () => r && s && s.map((t) => r.find((e) => e.type === t)?.props.children),
      [r, s]
    )
    return e[0] ? o : o[0]
  }
;(exports.useDebug = useDebug),
  (exports.useFrame = useFrame),
  (exports.useInterval = useInterval),
  (exports.useIsTouchDevice = useIsTouchDevice),
  (exports.useMediaQuery = useMediaQuery),
  (exports.useRect = useRect),
  (exports.useSlots = useSlots)
//# sourceMappingURL=index.js.map
