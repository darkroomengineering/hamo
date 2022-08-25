(function(global, factory) {
  typeof exports === "object" && typeof module !== "undefined" ? factory(exports, require("react"), require("@studio-freight/tempus"), require("nanoid"), require("throttle-debounce")) : typeof define === "function" && define.amd ? define(["exports", "react", "@studio-freight/tempus", "nanoid", "throttle-debounce"], factory) : (global = typeof globalThis !== "undefined" ? globalThis : global || self, factory(global["@studio-sfreight/hamo"] = {}, global.react, global.tempus, global.nanoid, global.throttleDebounce));
})(this, function(exports2, react, tempus, nanoid, throttleDebounce) {
  "use strict";
  function useOutsideClickEvent(ref, callback) {
    const handleClickOutside = react.useCallback(
      (event) => {
        if (ref.current && !ref.current.contains(event.target)) {
          callback();
        }
      },
      [ref, callback]
    );
    react.useEffect(() => {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [handleClickOutside]);
  }
  const useDebug = () => {
    const debug = react.useMemo(
      () => typeof window !== "undefined" ? window.location.href.includes("#debug") || process.env.NODE_ENV === "development" : false,
      []
    );
    return debug;
  };
  const isBrowser = typeof window !== "undefined";
  const useLayoutEffect = isBrowser ? react.useLayoutEffect : react.useEffect;
  function _useDocumentReadyState() {
    const [readyState, setReadyState] = react.useState(document.readyState);
    useLayoutEffect(() => {
      setReadyState(document.readyState);
      function onStateChange() {
        setReadyState(document.readyState);
      }
      document.addEventListener("readystatechange", onStateChange, false);
      return () => document.removeEventListener("readystatechange", onStateChange, false);
    }, []);
    return readyState;
  }
  const useDocumentReadyState = typeof window !== "undefined" ? _useDocumentReadyState : () => void 0;
  let subscribers = [];
  const subscribe = (filter, callbackFn) => {
    if (filter === void 0 || filter === null)
      return void 0;
    if (callbackFn === void 0 || callbackFn === null)
      return void 0;
    subscribers = [...subscribers, [filter, callbackFn]];
    return () => {
      subscribers = subscribers.filter(
        (subscriber) => subscriber[1] !== callbackFn
      );
    };
  };
  const dispatch = (event) => {
    let { type } = event;
    if (typeof event === "string")
      type = event;
    const args = [];
    if (typeof event === "string")
      args.push({ type });
    else
      args.push(event);
    subscribers.forEach(([filter, callbackFn]) => {
      if (typeof filter === "string" && filter !== type)
        return;
      if (typeof filter === "function" && !filter(...args))
        return;
      callbackFn(...args);
    });
  };
  const useEventBus = (type, callback, deps = []) => {
    react.useEffect(() => subscribe(type, callback), [...deps, callback, type]);
    return dispatch;
  };
  function useFrame(callback, priority = 0) {
    react.useEffect(() => {
      if (callback) {
        const id = tempus.raf.add(callback, priority);
        return () => {
          tempus.raf.remove(id);
        };
      }
    }, [callback, priority]);
  }
  function useId() {
    const id = react.useMemo(() => nanoid.nanoid(), []);
    return id;
  }
  const useInterval = (callback, delay) => {
    const savedCallback = react.useRef();
    react.useEffect(() => {
      savedCallback.current = callback;
    });
    react.useEffect(() => {
      function tick() {
        savedCallback.current();
      }
      if (delay !== null) {
        const id = setInterval(tick, delay);
        return () => clearInterval(id);
      }
    }, [delay]);
  };
  const useIsTouchDevice = () => {
    const [isTouchDevice, setIsTouchDevice] = react.useState(void 0);
    const onResize = react.useCallback(() => {
      setIsTouchDevice(
        "ontouchstart" in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0
      );
    }, []);
    useLayoutEffect(() => {
      onResize();
      window.addEventListener("resize", onResize, false);
      return () => {
        window.removeEventListener("resize", onResize, false);
      };
    }, []);
    return isTouchDevice;
  };
  const useIsVisible = ({
    root = null,
    rootMargin = "0px",
    threshold = 1
  } = {}) => {
    const ref = react.useRef();
    const [inView, setInView] = react.useState(false);
    const setRef = (node) => {
      if (!ref.current) {
        ref.current = node;
      }
    };
    const callbackFunction = react.useCallback((entries) => {
      const [entry] = entries;
      setInView(entry.isIntersecting);
    }, []);
    react.useEffect(() => {
      const observer = new IntersectionObserver(callbackFunction, {
        root,
        rootMargin,
        threshold
      });
      if (ref.current)
        observer.observe(ref.current);
      return () => {
        observer.disconnect();
      };
    }, [callbackFunction]);
    return { setRef, inView };
  };
  const useMediaQuery = (queryString) => {
    const [isMatch, setIsMatch] = react.useState(void 0);
    const mqChange = react.useCallback((mq) => {
      setIsMatch(mq.matches);
    }, []);
    useLayoutEffect(() => {
      const mq = window.matchMedia(queryString);
      mqChange(mq);
      mq.addEventListener("change", mqChange);
      return () => {
        mq.removeEventListener("change", mqChange);
      };
    });
    return isMatch;
  };
  function offsetTop(element, accumulator = 0) {
    const top = accumulator + element.offsetTop;
    if (element.offsetParent) {
      return offsetTop(element.offsetParent, top);
    }
    return top;
  }
  function offsetLeft(element, accumulator = 0) {
    const left = accumulator + element.offsetLeft;
    if (element.offsetParent) {
      return offsetLeft(element.offsetParent, left);
    }
    return left;
  }
  function useRect({ debounce = 1e3 } = {}) {
    const element = react.useRef();
    const [rect, setRect] = react.useState({
      top: void 0,
      left: void 0,
      width: void 0,
      height: void 0
    });
    const resize = () => {
      if (element.current) {
        setRect((prev) => ({
          ...prev,
          top: offsetTop(element.current),
          left: offsetLeft(element.current)
        }));
      }
    };
    useLayoutEffect(() => {
      const callback = throttleDebounce.throttle(debounce, resize);
      const resizeObserver2 = new ResizeObserver(callback);
      resizeObserver2.observe(document.body);
      return () => {
        resizeObserver2.disconnect();
        callback.cancel({ upcomingOnly: true });
      };
    }, [debounce]);
    const onResizeObserver = ([entry]) => {
      const { width, height } = entry.contentRect;
      setRect((prev) => ({
        ...prev,
        width,
        height
      }));
    };
    const resizeObserver = react.useRef();
    const setRef = (node) => {
      var _a;
      if (!node || node === element.current)
        return;
      (_a = resizeObserver.current) == null ? void 0 : _a.disconnect();
      resizeObserver.current = new ResizeObserver(onResizeObserver);
      resizeObserver.current.observe(node);
      element.current = node;
    };
    const getRect = (x = 0, y = 0) => {
      return rect;
    };
    return [setRef, rect, getRect];
  }
  const useSlots = (types = [], children = []) => {
    const _children = react.useMemo(() => children && [children].flat(), [children]);
    const _types = react.useMemo(() => types && [types].flat(), [types]);
    const slots = react.useMemo(
      () => _children && _types && _types.map(
        (type) => {
          var _a;
          return (_a = _children.find((el) => el.type === type)) == null ? void 0 : _a.props.children;
        }
      ),
      [_children, _types]
    );
    return types[0] ? slots : slots[0];
  };
  exports2.dispatch = dispatch;
  exports2.useDebug = useDebug;
  exports2.useDocumentReadyState = useDocumentReadyState;
  exports2.useEventBus = useEventBus;
  exports2.useFrame = useFrame;
  exports2.useId = useId;
  exports2.useInterval = useInterval;
  exports2.useIsTouchDevice = useIsTouchDevice;
  exports2.useIsVisible = useIsVisible;
  exports2.useLayoutEffect = useLayoutEffect;
  exports2.useMediaQuery = useMediaQuery;
  exports2.useOutsideClickEvent = useOutsideClickEvent;
  exports2.useRect = useRect;
  exports2.useSlots = useSlots;
  Object.defineProperties(exports2, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
});
