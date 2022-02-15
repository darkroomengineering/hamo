Object.defineProperty(exports, '__esModule', { value: !0 })
var react = require('react'),
  rafz = require('@react-spring/rafz'),
  uuid = require('uuid')
const useTimeoutFn = (e, t = 0) => {
    const r = react.useRef(!1),
      s = react.useRef(),
      u = react.useRef(e)
    var o = react.useCallback(() => r.current, [])
    const n = react.useCallback(() => {
        ;(r.current = !1),
          s.current && clearTimeout(s.current),
          (s.current = setTimeout(() => {
            ;(r.current = !0), u.current()
          }, t))
      }, [t]),
      c = react.useCallback(() => {
        ;(r.current = null), s.current && clearTimeout(s.current)
      }, [])
    return (
      react.useEffect(() => {
        u.current = e
      }, [e]),
      react.useEffect(() => (n(), c), [t]),
      [o, c, n]
    )
  },
  useDebounce = (e, t = 0, r = []) => {
    var [e, t, s] = useTimeoutFn(e, t)
    return react.useEffect(s, r), [e, t]
  },
  isBrowser = 'undefined' != typeof window,
  noop = () => {},
  on = (e, ...t) => {
    e && e.addEventListener && e.addEventListener(...t)
  },
  off = (e, ...t) => {
    e && e.removeEventListener && e.removeEventListener(...t)
  },
  useDebug = () => {
    const [e, t] = react.useState(!1)
    return (
      react.useEffect(() => {
        t(
          window.pathname.current.includes('#debug') ||
            'development' === process.env.NODE_ENV
        )
      }, []),
      !!isBrowser && e
    )
  },
  useEffectOnce = (e) => {
    react.useEffect(e, [])
  },
  useIsomorphicLayoutEffect = isBrowser
    ? react.useLayoutEffect
    : react.useEffect,
  callbacks = {}
function useFrame(e, t = 0, r = []) {
  const s = react.useMemo(() => uuid.v4(), [])
  useIsomorphicLayoutEffect(() => {
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
  defaultState = {
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  useMeasure = () => {
    const [e, t] = react.useState(null),
      [r, a] = react.useState(defaultState),
      s = react.useMemo(
        () =>
          new window.ResizeObserver((e) => {
            var t, r, s, u, o, n, c
            e[0] &&
              (({
                x: e,
                y: t,
                width: r,
                height: s,
                top: u,
                left: o,
                bottom: n,
                right: c,
              } = e[0].contentRect),
              a({
                x: e,
                y: t,
                width: r,
                height: s,
                top: u,
                left: o,
                bottom: n,
                right: c,
              }))
          }),
        []
      )
    return (
      useIsomorphicLayoutEffect(() => {
        if (e)
          return (
            s.observe(e),
            () => {
              s.disconnect()
            }
          )
      }, [e]),
      isBrowser && void 0 !== window.ResizeObserver
        ? [t, r]
        : () => [noop, defaultState]
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
  },
  useUnmount = (e) => {
    const t = react.useRef(e)
    ;(t.current = e), useEffectOnce(() => () => t.current())
  },
  useRafState = (e) => {
    const t = react.useRef(0),
      [r, s] = react.useState(e)
    e = react.useCallback((e) => {
      rafz.raf.cancel(t.current), rafz.raf(s(e))
    }, [])
    return (
      useUnmount(() => {
        rafz.raf.cancel(t.current)
      }),
      [r, e]
    )
  },
  useWindowSize = (e = 1 / 0, t = 1 / 0) => {
    const [r, s] = useRafState({
      width: isBrowser ? window.innerWidth : e,
      height: isBrowser ? window.innerHeight : t,
    })
    return (
      react.useEffect(() => {
        if (isBrowser) {
          const e = () => {
            s({ width: window.innerWidth, height: window.innerHeight })
          }
          return (
            on(window, 'resize', e),
            () => {
              off(window, 'resize', e)
            }
          )
        }
      }, []),
      r
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
const useRect = (c = { y: 0 }) => {
    const e = react.useRef(),
      [t, { width: r, height: s }] = useMeasure(),
      [f, { height: h }] = useMeasure(),
      { width: u, height: o } = useWindowSize(),
      [n, d] = react.useState({ top: void 0, left: void 0 }),
      a = react.useRef({}),
      i = react.useRef({})
    return (
      react.useEffect(() => {
        f(document.body), t(e.current)
      }, []),
      useDebounce(
        () => {
          d({ top: offsetTop(e.current), left: offsetLeft(e.current) })
        },
        1e3,
        [h]
      ),
      react.useEffect(() => {
        a.current = { top: n.top, left: n.left, width: r, height: s }
      }, [n, r, s]),
      useDebounce(
        () => {
          i.current = { width: u, height: o }
        },
        1e3,
        [u, o]
      ),
      [
        e,
        () => {
          var e = c.y,
            { top: t, left: r, width: s, height: u } = a.current,
            { width: o, height: n } = i.current
          if (
            'number' == typeof t &&
            'number' == typeof r &&
            'number' == typeof s &&
            'number' == typeof u
          )
            return (
              (n = {
                top: t - e,
                left: r,
                height: u,
                width: s,
                bottom: n - (t - e + u),
                right: o - (r + s),
              }),
              (t = 0 < n.top + n.height && 0 < n.bottom + n.height),
              { ...n, inView: t }
            )
        },
      ]
    )
  },
  useSlots = (e = [], t = []) => {
    const r = react.useMemo(() => t && [t].flat(), [t]),
      s = react.useMemo(() => e && [e].flat(), [e])
    var u = react.useMemo(
      () => r && s && s.map((t) => r.find((e) => e.type === t)?.props.children),
      [r, s]
    )
    return e[0] ? u : u[0]
  }
;(exports.useDebounce = useDebounce),
  (exports.useDebug = useDebug),
  (exports.useEffectOnce = useEffectOnce),
  (exports.useFrame = useFrame),
  (exports.useInterval = useInterval),
  (exports.useIsTouchDevice = useIsTouchDevice),
  (exports.useIsomorphicLayoutEffect = useIsomorphicLayoutEffect),
  (exports.useMeasure = useMeasure),
  (exports.useMediaQuery = useMediaQuery),
  (exports.useRafState = useRafState),
  (exports.useRect = useRect),
  (exports.useSlots = useSlots),
  (exports.useTimeoutFn = useTimeoutFn),
  (exports.useUnmount = useUnmount),
  (exports.useWindowSize = useWindowSize)
//# sourceMappingURL=index.js.map
