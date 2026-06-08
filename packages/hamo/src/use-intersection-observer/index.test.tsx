import { describe, expect, it } from 'bun:test'
import { act, renderHook } from '@testing-library/react'
import { useIntersectionObserver } from './index'

describe('useIntersectionObserver (smoke)', () => {
  it('mounts without throwing and returns a [setRef, entry] tuple', () => {
    const { result, unmount } = renderHook(() => useIntersectionObserver())

    const [setRef, entry] = result.current
    expect(typeof setRef).toBe('function')
    // Non-lazy: entry is undefined until an element is observed
    expect(entry).toBeUndefined()

    expect(() => unmount()).not.toThrow()
  })

  it('lazy mode: second element of tuple is a getter function', () => {
    const { result, unmount } = renderHook(() =>
      useIntersectionObserver({ lazy: true })
    )

    const [setRef, getEntry] = result.current
    expect(typeof setRef).toBe('function')
    expect(typeof getEntry).toBe('function')
    expect((getEntry as () => unknown)()).toBeUndefined()

    expect(() => unmount()).not.toThrow()
  })

  it('setRef with null does not throw', () => {
    const { result } = renderHook(() => useIntersectionObserver())
    const [setRef] = result.current

    expect(() => {
      act(() => {
        setRef(null)
      })
    }).not.toThrow()
  })

  it('accepts all options without throwing', () => {
    const { unmount } = renderHook(() =>
      useIntersectionObserver({
        rootMargin: '10px',
        threshold: 0.5,
        once: true,
        callback: () => {},
      })
    )
    expect(() => unmount()).not.toThrow()
  })
})
