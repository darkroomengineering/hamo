import { describe, expect, it, mock } from 'bun:test'
import { act, renderHook } from '@testing-library/react'
import { useDebouncedCallback, useDebouncedState } from './index'

// ---------------------------------------------------------------------------
// useDebouncedCallback
// ---------------------------------------------------------------------------

describe('useDebouncedCallback', () => {
  it('calls the callback after the delay elapses', async () => {
    const fn = mock(() => {})
    const DELAY = 40

    const { result } = renderHook(() => useDebouncedCallback(fn, DELAY))

    act(() => {
      result.current()
    })

    // Not called yet — delay has not elapsed
    expect(fn).toHaveBeenCalledTimes(0)

    await new Promise((r) => setTimeout(r, DELAY + 40))

    expect(fn).toHaveBeenCalledTimes(1)
  })

  it('debounces: only fires once when called rapidly', async () => {
    const fn = mock(() => {})
    const DELAY = 40

    const { result } = renderHook(() => useDebouncedCallback(fn, DELAY))

    act(() => {
      result.current()
      result.current()
      result.current()
    })

    await new Promise((r) => setTimeout(r, DELAY + 40))

    expect(fn).toHaveBeenCalledTimes(1)
  })

  it('leak regression: pending timer is cancelled on unmount', async () => {
    // This is the critical correctness contract: if the component unmounts
    // before the debounce delay expires, the callback must NOT fire.
    // A broken implementation would call the mock after unmount, proving a
    // timer leak that could cause state updates on unmounted components.
    const fn = mock(() => {})
    const DELAY = 40

    const { result, unmount } = renderHook(() =>
      useDebouncedCallback(fn, DELAY)
    )

    act(() => {
      result.current()
    })

    // Unmount immediately — before the timer fires
    unmount()

    // Wait well past the delay to give the (leaked) timer a chance to fire
    await new Promise((r) => setTimeout(r, DELAY + 40))

    expect(fn).toHaveBeenCalledTimes(0)
  })

  it('does not call previous callback instance after deps change', async () => {
    const fn1 = mock(() => {})
    const fn2 = mock(() => {})
    const DELAY = 40

    const { result, rerender } = renderHook(
      ({ cb }) => useDebouncedCallback(cb, DELAY),
      { initialProps: { cb: fn1 } }
    )

    act(() => {
      result.current()
    })

    // Swap the callback before delay elapses — the debounced fn uses a ref
    // so fn2 is what fires, not fn1. Both fire count should still be 1 total.
    rerender({ cb: fn2 })

    await new Promise((r) => setTimeout(r, DELAY + 40))

    // The ref-based implementation means fn2 (the latest) is invoked
    expect(fn1).toHaveBeenCalledTimes(0)
    expect(fn2).toHaveBeenCalledTimes(1)
  })
})

// ---------------------------------------------------------------------------
// useDebouncedState
// ---------------------------------------------------------------------------

describe('useDebouncedState', () => {
  it('returns the initial value immediately', () => {
    const { result } = renderHook(() => useDebouncedState('initial', 40))
    const [state] = result.current
    expect(state).toBe('initial')
  })

  it('updates state after the delay', async () => {
    const DELAY = 40
    const { result } = renderHook(() => useDebouncedState('a', DELAY))

    act(() => {
      const [, setState] = result.current
      setState('b')
    })

    // State should still be the old value immediately after set
    expect(result.current[0]).toBe('a')

    await act(async () => {
      await new Promise((r) => setTimeout(r, DELAY + 40))
    })

    expect(result.current[0]).toBe('b')
  })

  it('coalesces rapid updates — only the last value wins', async () => {
    const DELAY = 40
    const { result } = renderHook(() => useDebouncedState(0, DELAY))

    act(() => {
      const [, setState] = result.current
      setState(1)
      setState(2)
      setState(3)
    })

    await act(async () => {
      await new Promise((r) => setTimeout(r, DELAY + 40))
    })

    expect(result.current[0]).toBe(3)
  })

  it('functional updater receives the cached (not stale) value', async () => {
    const DELAY = 40
    const { result } = renderHook(() => useDebouncedState(10, DELAY))

    act(() => {
      const [, setState] = result.current
      setState((prev) => prev + 5)
    })

    await act(async () => {
      await new Promise((r) => setTimeout(r, DELAY + 40))
    })

    expect(result.current[0]).toBe(15)
  })
})
