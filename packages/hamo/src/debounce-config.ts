// Shared factory for the per-hook global debounce default. Each observer hook
// (useRect, useResizeObserver, useWindowSize) owns its own independent config
// instance, exposing a `setDebounce` to change its default at runtime. This
// keeps the three hooks' semantics identical without copy-pasting the
// module-level `let` + setter into every file.

export interface DebounceConfig {
  /** Read the current default delay. Evaluate per-call so it tracks setDebounce. */
  getDelay: () => number
  /** Override the default delay for every future call of the owning hook. */
  setDebounce: (delay: number) => void
}

export function createDebounceConfig(initialDelay = 500): DebounceConfig {
  let delay = initialDelay

  return {
    getDelay: () => delay,
    setDebounce: (value: number) => {
      delay = value
    },
  }
}
