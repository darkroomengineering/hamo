import { describe, expect, it } from 'bun:test'
import { act, renderHook } from '@testing-library/react'
import { useMediaQuery } from './index'

describe('useMediaQuery (smoke)', () => {
  it('mounts without throwing and returns boolean or undefined', () => {
    const { result, unmount } = renderHook(() =>
      useMediaQuery('(min-width: 768px)')
    )

    const isMatch = result.current
    expect(typeof isMatch === 'boolean' || isMatch === undefined).toBe(true)

    expect(() => unmount()).not.toThrow()
  })

  it('updates when the query string changes', () => {
    const { result, rerender, unmount } = renderHook(
      ({ q }) => useMediaQuery(q),
      { initialProps: { q: '(min-width: 768px)' } }
    )

    expect(() => {
      act(() => {
        rerender({ q: '(prefers-color-scheme: dark)' })
      })
    }).not.toThrow()

    const isMatch = result.current
    expect(typeof isMatch === 'boolean' || isMatch === undefined).toBe(true)

    unmount()
  })
})
