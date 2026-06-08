import { describe, expect, it } from 'bun:test'
import { renderHook } from '@testing-library/react'
import { useWindowSize } from './index'

describe('useWindowSize (smoke)', () => {
  it('mounts without throwing and returns { width, height, dpr }', () => {
    const { result, unmount } = renderHook(() => useWindowSize())

    const { width, height, dpr } = result.current

    // After the mount effect runs in happy-dom, the values may be numbers.
    // What must hold is that the shape is correct and no throw occurred.
    expect(typeof width === 'number' || width === undefined).toBe(true)
    expect(typeof height === 'number' || height === undefined).toBe(true)
    expect(typeof dpr === 'number' || dpr === undefined).toBe(true)

    expect(() => unmount()).not.toThrow()
  })

  it('accepts a custom debounce delay without throwing', () => {
    const { unmount } = renderHook(() => useWindowSize(100))
    expect(() => unmount()).not.toThrow()
  })
})
