import { describe, expect, it, mock } from 'bun:test'
import { act, renderHook } from '@testing-library/react'
import { useLazyState } from './index'

describe('useLazyState', () => {
  it('does NOT cause a re-render when set() is called', () => {
    // The hook's contract: set() triggers the callback but skips React state
    // updates, so the host component stays at its initial render count.
    let renderCount = 0
    const cb = mock(() => {})

    const { result } = renderHook(() => {
      renderCount++
      return useLazyState(0, cb)
    })

    const [set] = result.current
    act(() => {
      set(1)
      set(2)
      set(3)
    })

    // Only the initial mount render — no re-renders from set()
    expect(renderCount).toBe(1)
  })

  it('get() returns the latest value after set()', () => {
    const cb = mock(() => {})
    const { result } = renderHook(() => useLazyState(0, cb))

    const [set, get] = result.current
    act(() => {
      set(42)
    })

    expect(get()).toBe(42)
  })

  it('get() returns the initialValue before any set()', () => {
    const cb = mock(() => {})
    const { result } = renderHook(() => useLazyState('hello', cb))

    const [, get] = result.current
    expect(get()).toBe('hello')
  })

  it('passes previousValue correctly on successive set() calls', () => {
    // This is the bug that was fixed: previousValue on the second call must be
    // the value from the first call, not the initial value.
    const calls: Array<{ value: number; prev: number | undefined }> = []
    const cb = mock((value: number, previousValue: number | undefined) => {
      calls.push({ value, prev: previousValue })
    })

    const { result } = renderHook(() => useLazyState(0, cb))
    const [set] = result.current

    act(() => {
      set(1)
    })
    act(() => {
      set(2)
    })

    // calls[0] is the mount-effect call (value=0, prev=undefined).
    // set(1): value=1, prev=0 (the initial value stored in stateRef)
    expect(calls[1]).toEqual({ value: 1, prev: 0 })
    // set(2): prev must be 1 — not 0 (the fixed bug)
    expect(calls[2]).toEqual({ value: 2, prev: 1 })
  })

  it('callback receives undefined as previousValue on the initial mount effect', () => {
    // useLazyState fires the callback once on mount (for deps-based effect).
    // At that point prevStateRef is still undefined.
    const calls: Array<{ value: number; prev: number | undefined }> = []
    const cb = mock((value: number, previousValue: number | undefined) => {
      calls.push({ value, prev: previousValue })
    })

    renderHook(() => useLazyState(99, cb))

    expect(calls.length).toBeGreaterThanOrEqual(1)
    expect(calls[0]?.prev).toBeUndefined()
  })

  it('functional updater: set((prev) => next) passes correct previousValue', () => {
    const calls: Array<{ value: number; prev: number | undefined }> = []
    const cb = mock((value: number, previousValue: number | undefined) => {
      calls.push({ value, prev: previousValue })
    })

    const { result } = renderHook(() => useLazyState(10, cb))
    const [set] = result.current

    act(() => {
      set((prev) => prev + 5)
    })

    const last = calls[calls.length - 1]
    expect(last?.value).toBe(15)
    expect(last?.prev).toBe(10)
  })

  it('does not call callback when set() is called with the same value', () => {
    // The hook short-circuits when value === stateRef.current
    let callCount = 0
    const cb = mock(() => {
      callCount++
    })

    const { result } = renderHook(() => useLazyState(5, cb))
    const [set] = result.current

    // Reset call count after mount effect fires
    callCount = 0

    act(() => {
      set(5) // same value → should not invoke cb
    })

    expect(callCount).toBe(0)
  })

  it('useRef is stable — set and get refs survive re-renders', () => {
    // If the parent re-renders for an external reason, the same set/get
    // functions must still work (they close over the same refs).
    const cb = mock(() => {})
    const { result, rerender } = renderHook(() => useLazyState(0, cb))

    const [set1] = result.current
    rerender()
    const [, get2] = result.current

    act(() => {
      set1(77)
    })
    expect(get2()).toBe(77)
  })
})
