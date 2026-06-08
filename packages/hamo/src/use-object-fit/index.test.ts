import { describe, expect, it } from 'bun:test'
import { useObjectFit } from './index'

describe('useObjectFit', () => {
  it('returns [1, 1] when parentWidth is zero (guard branch)', () => {
    // A zero dimension means no meaningful container — the hook must not
    // divide by zero; returning [1, 1] is the documented safe fallback.
    expect(useObjectFit(0, 100, 100, 100)).toEqual([1, 1])
  })

  it('returns [1, 1] when parentHeight is zero (guard branch)', () => {
    expect(useObjectFit(100, 0, 100, 100)).toEqual([1, 1])
  })

  it('returns [1, 1] when childWidth is zero (guard branch)', () => {
    expect(useObjectFit(100, 100, 0, 100)).toEqual([1, 1])
  })

  it('returns [1, 1] when childHeight is zero (guard branch)', () => {
    expect(useObjectFit(100, 100, 100, 0)).toEqual([1, 1])
  })

  it('cover: scales to fill parent when child is wider than parent ratio', () => {
    // parent 100×100 (ratio 1), child 200×100 (ratio 2).
    // childRatio > parentRatio → width = parentHeight * childRatio = 200
    // height = 200 / 2 = 100
    // scaleX = width / parentWidth = 2, scaleY = height / parentHeight = 1
    expect(useObjectFit(100, 100, 200, 100, 'cover')).toEqual([2, 1])
  })

  it('contain: scales to fit parent when child is wider than parent ratio', () => {
    // parent 100×100 (ratio 1), child 200×100 (ratio 2).
    // childRatio > parentRatio → width = parentWidth = 100
    // height = 100 / 2 = 50
    // scaleX = 100 / 100 = 1, scaleY = 50 / 100 = 0.5
    expect(useObjectFit(100, 100, 200, 100, 'contain')).toEqual([1, 0.5])
  })

  it('cover: identical ratios produce [1, 1]', () => {
    // parent and child same ratio → no scaling needed
    expect(useObjectFit(200, 100, 400, 200, 'cover')).toEqual([1, 1])
  })

  it('contain: identical ratios produce [1, 1]', () => {
    expect(useObjectFit(200, 100, 400, 200, 'contain')).toEqual([1, 1])
  })

  it('defaults to cover when objectFit is omitted', () => {
    // Same geometry as the explicit cover test above
    expect(useObjectFit(100, 100, 200, 100)).toEqual([2, 1])
  })
})
