Object.defineProperty(exports, '__esModule', { value: !0 })
var react = require('react'),
  rafz = require('@react-spring/rafz'),
  uuid = require('uuid'),
  store = require('lib/store')
const useTimeoutFn = (e, t = 0) => {
    const r = react.useRef(!1),
      o = react.useRef(),
      s = react.useRef(e)
    var u = react.useCallback(() => r.current, [])
    const n = react.useCallback(() => {
        ;(r.current = !1),
          o.current && clearTimeout(o.current),
          (o.current = setTimeout(() => {
            ;(r.current = !0), s.current()
          }, t))
      }, [t]),
      c = react.useCallback(() => {
        ;(r.current = null), o.current && clearTimeout(o.current)
      }, [])
    return (
      react.useEffect(() => {
        s.current = e
      }, [e]),
      react.useEffect(() => (n(), c), [t]),
      [u, c, n]
    )
  },
  useDebounce = (e, t = 0, r = []) => {
    var [e, t, o] = useTimeoutFn(e, t)
    return react.useEffect(o, r), [e, t]
  },
  useDebug = () => {
    return react.useMemo(
      () =>
        window.location.pathname.includes('#debug') ||
        'development' === process.env.NODE_ENV,
      [window.location.pathname]
    )
  },
  isBrowser = 'undefined' != typeof window,
  noop = () => {},
  on = (e, ...t) => {
    e && e.addEventListener && e.addEventListener(...t)
  },
  off = (e, ...t) => {
    e && e.removeEventListener && e.removeEventListener(...t)
  },
  useIsomorphicLayoutEffect = isBrowser
    ? react.useLayoutEffect
    : react.useEffect,
  callbacks = {}
function useFrame(e, t = 0, r = []) {
  const o = react.useMemo(() => uuid.v4(), [])
  useIsomorphicLayoutEffect(() => {
    if (e)
      return (
        (callbacks[o] = { callback: e, priority: t }),
        () => {
          delete callbacks[o]
        }
      )
  }, [e, o, t, ...r])
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
      o = (e) => {
        r(e.matches)
      }
    return (
      react.useEffect(() => {
        const t = window.matchMedia(e)
        o(t)
        try {
          t?.addEventListener('change', o)
        } catch (e) {
          try {
            t?.addListener(o)
          } catch (e) {
            console.error(e)
          }
        }
        return () => {
          try {
            t?.removeEventListener('change', o)
          } catch (e) {
            try {
              t?.removeListener(o)
            } catch (e) {
              console.error(e)
            }
          }
        }
      }),
      t
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
      o = react.useMemo(
        () =>
          new window.ResizeObserver((e) => {
            var t, r, o, s, u, n, c
            e[0] &&
              (({
                x: e,
                y: t,
                width: r,
                height: o,
                top: s,
                left: u,
                bottom: n,
                right: c,
              } = e[0].contentRect),
              a({
                x: e,
                y: t,
                width: r,
                height: o,
                top: s,
                left: u,
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
            o.observe(e),
            () => {
              o.disconnect()
            }
          )
      }, [e]),
      isBrowser && void 0 !== window.ResizeObserver
        ? [t, r]
        : () => [noop, defaultState]
    )
  },
  useEffectOnce = (e) => {
    react.useEffect(e, [])
  },
  useUnmount = (e) => {
    const t = react.useRef(e)
    ;(t.current = e), useEffectOnce(() => () => t.current())
  },
  useRafState = (e) => {
    const t = react.useRef(0),
      [r, o] = react.useState(e)
    e = react.useCallback((e) => {
      rafz.raf.cancel(t.current), rafz.raf(o(e))
    }, [])
    return (
      useUnmount(() => {
        rafz.raf.cancel(t.current)
      }),
      [r, e]
    )
  },
  useWindowSize = (e = 1 / 0, t = 1 / 0) => {
    const [r, o] = useRafState({
      width: isBrowser ? window.innerWidth : e,
      height: isBrowser ? window.innerHeight : t,
    })
    return (
      react.useEffect(() => {
        if (isBrowser) {
          const e = () => {
            o({ width: window.innerWidth, height: window.innerHeight })
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
const useRect = (c = !0) => {
    const e = react.useRef(),
      [t, { width: r, height: o }] = useMeasure(),
      [f, { height: h }] = useMeasure(),
      { width: s, height: u } = useWindowSize(),
      [n, l] = react.useState({ top: void 0, left: void 0 }),
      a = react.useRef({}),
      i = react.useRef({})
    return (
      react.useEffect(() => {
        f(document.body), t(e.current)
      }, []),
      useDebounce(
        () => {
          l({ top: offsetTop(e.current), left: offsetLeft(e.current) })
        },
        1e3,
        [h]
      ),
      react.useEffect(() => {
        a.current = { top: n.top, left: n.left, width: r, height: o }
      }, [n, r, o]),
      useDebounce(
        () => {
          i.current = { width: s, height: u }
        },
        1e3,
        [s, u]
      ),
      [
        e,
        () => {
          var e =
              store.useStore.getState().locomotive?.scroll?.instance.scroll.y ||
              0,
            { top: t, left: r, width: o, height: s } = a.current,
            { width: u, height: n } = i.current
          if (
            'number' == typeof t &&
            'number' == typeof r &&
            'number' == typeof o &&
            'number' == typeof s
          )
            return (
              (n = c
                ? {
                    top: t - e,
                    left: r,
                    height: s,
                    width: o,
                    bottom: n - (t - e + s),
                    right: u - (r + o),
                  }
                : {
                    top: t,
                    left: r,
                    height: s,
                    width: o,
                    bottom: t + s,
                    right: r + o,
                  }),
              (e = 0 < n.top + n.height && 0 < n.bottom + n.height),
              { ...n, inView: e }
            )
        },
      ]
    )
  },
  useSlots = (e = [], t = []) => {
    const r = react.useMemo(() => t && [t].flat(), [t]),
      o = react.useMemo(() => e && [e].flat(), [e])
    var s = react.useMemo(
      () => r && o && o.map((t) => r.find((e) => e.type === t)?.props.children),
      [r, o]
    )
    return e[0] ? s : s[0]
  }
;(exports.useDebounce = useDebounce),
  (exports.useDebug = useDebug),
  (exports.useFrame = useFrame),
  (exports.useInterval = useInterval),
  (exports.useIsTouchDevice = useIsTouchDevice),
  (exports.useMediaQuery = useMediaQuery),
  (exports.useRect = useRect),
  (exports.useSlots = useSlots),
  (exports.useTimeoutFn = useTimeoutFn)
//# sourceMappingURL=index.js.map
