import { GlobalRegistrator } from '@happy-dom/global-registrator'

GlobalRegistrator.register()

// React 19 act() environment flag
// @ts-expect-error test-only global
globalThis.IS_REACT_ACT_ENVIRONMENT = true

// happy-dom does not implement these observers; provide no-op stubs so the hooks
// mount and clean up without throwing.
if (!('ResizeObserver' in globalThis)) {
  class ResizeObserverStub {
    observe() {
      /* no-op */
    }
    unobserve() {
      /* no-op */
    }
    disconnect() {
      /* no-op */
    }
  }
  // @ts-expect-error test-only global
  globalThis.ResizeObserver = ResizeObserverStub
}

if (!('IntersectionObserver' in globalThis)) {
  class IntersectionObserverStub {
    root = null
    rootMargin = ''
    thresholds = []
    observe() {
      /* no-op */
    }
    unobserve() {
      /* no-op */
    }
    disconnect() {
      /* no-op */
    }
    takeRecords() {
      return []
    }
  }
  // @ts-expect-error test-only global
  globalThis.IntersectionObserver = IntersectionObserverStub
}
