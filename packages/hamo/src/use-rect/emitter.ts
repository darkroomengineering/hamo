type Listener = (...args: unknown[]) => void

function createEmitter() {
  const listeners = new Map<string, Set<Listener>>()

  return {
    on(event: string, listener: Listener): () => void {
      let set = listeners.get(event)
      if (!set) {
        set = new Set()
        listeners.set(event, set)
      }
      set.add(listener)
      return () => {
        set?.delete(listener)
      }
    },
    emit(event: string, ...args: unknown[]): void {
      const set = listeners.get(event)
      if (!set) return
      for (const listener of set) listener(...args)
    },
  }
}

export const emitter = createEmitter()
