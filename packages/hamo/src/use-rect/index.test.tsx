import { describe, expect, it } from 'bun:test'
import { act, renderHook } from '@testing-library/react'
import { useRect } from './index'

describe('useRect (smoke)', () => {
  it('mounts without throwing and returns a [setRef, rect, setWrapperRef] tuple', () => {
    const { result, unmount } = renderHook(() => useRect())

    expect(result.current).toHaveLength(3)
    const [setRef, rect, setWrapperRef] = result.current
    expect(typeof setRef).toBe('function')
    expect(typeof rect).toBe('object')
    expect(typeof setWrapperRef).toBe('function')

    expect(() => unmount()).not.toThrow()
  })

  it('lazy mode: second element is a getter function', () => {
    const { result, unmount } = renderHook(() => useRect({ lazy: true }))

    const [, getRect] = result.current
    expect(typeof getRect).toBe('function')

    expect(() => unmount()).not.toThrow()
  })

  it('setRef with null does not throw', () => {
    const { result } = renderHook(() => useRect())
    const [setRef] = result.current

    expect(() => {
      act(() => {
        setRef(null)
      })
    }).not.toThrow()
  })

  it('accepts all options without throwing', () => {
    const { unmount } = renderHook(() =>
      useRect({
        ignoreTransform: true,
        ignoreSticky: false,
        debounce: 100,
        callback: () => {},
      })
    )
    expect(() => unmount()).not.toThrow()
  })
})
