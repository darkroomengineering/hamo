import { createNanoEvents } from 'nanoevents'

export interface TriggerEntry {
  id: string
  start: string
  end: string
  startPx: number
  endPx: number
  progress: number
  isActive: boolean
  rect: { top: number; left: number; width: number; height: number }
}

interface StoreEvents {
  change: () => void
}

const emitter = createNanoEvents<StoreEvents>()
const triggers = new Map<string, TriggerEntry>()
let snapshot: TriggerEntry[] = []

function updateSnapshot() {
  snapshot = Array.from(triggers.values())
}

export const scrollTriggerStore = {
  register(id: string, entry: TriggerEntry) {
    triggers.set(id, entry)
    updateSnapshot()
    emitter.emit('change')
  },

  update(id: string, partial: Partial<TriggerEntry>) {
    const existing = triggers.get(id)
    if (existing) {
      Object.assign(existing, partial)
      updateSnapshot()
      emitter.emit('change')
    }
  },

  unregister(id: string) {
    triggers.delete(id)
    updateSnapshot()
    emitter.emit('change')
  },

  getSnapshot(): TriggerEntry[] {
    return snapshot
  },

  subscribe(callback: () => void) {
    return emitter.on('change', callback)
  },
}
