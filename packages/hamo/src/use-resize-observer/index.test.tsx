import { describe, expect, it } from 'bun:test'
import { act, renderHook } from '@testing-library/react'
import { useResizeObserver } from './index'

describe('useResizeObserver (smoke)', () => {
  it('mounts without throwing and returns a [setRef, entry] tuple', () => {
    const { result, unmount } = renderHook(() => useResizeObserver())

    const [setRef, entry] = result.current
    expect(typeof setRef).toBe('function')
    // Non-lazy: entry is undefined until an element is observed
    expect(entry).toBeUndefined()

    expect(() => unmount()).not.toThrow()
  })

  it('lazy mode: second element of tuple is a getter function', () => {
    const { result, unmount } = renderHook(() =>
      useResizeObserver({ lazy: true })
    )

    const [setRef, getEntry] = result.current
    expect(typeof setRef).toBe('function')
    expect(typeof getEntry).toBe('function')
    // Getter returns undefined before any observation
    expect((getEntry as () => unknown)()).toBeUndefined()

    expect(() => unmount()).not.toThrow()
  })

  it('setRef with null does not throw', () => {
    const { result } = renderHook(() => useResizeObserver())
    const [setRef] = result.current

    expect(() => {
      act(() => {
        setRef(null)
      })
    }).not.toThrow()
  })

  it('accepts a callback option without throwing', () => {
    const { unmount } = renderHook(() =>
      useResizeObserver({ callback: () => {} })
    )
    expect(() => unmount()).not.toThrow()
  })
})
