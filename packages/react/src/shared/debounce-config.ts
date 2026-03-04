/**
 * Creates a module-level debounce configuration.
 * Note: This is shared globally across all hook instances.
 */
export function createDebounceConfig(defaultDelay = 500) {
  let delay = defaultDelay

  return {
    getDelay: () => delay,
    setDelay: (newDelay: number) => {
      delay = newDelay
    },
  }
}
