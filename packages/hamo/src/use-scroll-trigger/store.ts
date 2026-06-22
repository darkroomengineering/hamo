// A tiny synchronous pub/sub used only by the debug overlay. Inlined (instead
// of nanoevents) to keep hamo free of runtime dependencies.

export interface TriggerEntry {
  id: string
  start: string
  end: string
  startPx: number
  endPx: number
  progress: number
  isActive: boolean
  rect: { top: number; left: number; width: number; height: number }
  translateY: number
}

const subscribers = new Set<() => void>()
const triggers = new Map<string, TriggerEntry>()
let snapshot: TriggerEntry[] = []

function updateSnapshot() {
  snapshot = Array.from(triggers.values())
}

function emit() {
  for (const callback of subscribers) callback()
}

export const scrollTriggerStore = {
  register(id: string, entry: TriggerEntry) {
    triggers.set(id, entry)
    updateSnapshot()
    emit()
  },

  update(id: string, partial: Partial<TriggerEntry>) {
    const existing = triggers.get(id)
    if (existing) {
      Object.assign(existing, partial)
      updateSnapshot()
      emit()
    }
  },

  unregister(id: string) {
    triggers.delete(id)
    updateSnapshot()
    emit()
  },

  getSnapshot(): TriggerEntry[] {
    return snapshot
  },

  subscribe(callback: () => void) {
    subscribers.add(callback)
    return () => {
      subscribers.delete(callback)
    }
  },
}
