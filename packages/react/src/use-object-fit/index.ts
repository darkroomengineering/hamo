import { useMemo } from 'react'

/**
 * @name useObjectFit
 * @description
 * A hook that allows you to calculate the scale of a child element based on the parent element and the object fit type.
 * @param {number} parentWidth - The width of the parent element.
 * @param {number} parentHeight - The height of the parent element.
 * @param {number} childWidth - The width of the child element.
 * @param {number} childHeight - The height of the child element.
 * @param {string} objectFit - The object fit type. Can be 'contain' or 'cover'.
 * @returns {array} [width, height] - The scale of the child element.
 */

export function useObjectFit(
  parentWidth = 1,
  parentHeight = 1,
  childWidth = 1,
  childHeight = 1,
  objectFit: 'contain' | 'cover' = 'cover'
) {
  const [width, height] = useMemo(() => {
    if (!parentWidth || !parentHeight || !childWidth || !childHeight)
      return [1, 1]
    const parentRatio = parentWidth / parentHeight
    const childRatio = childWidth / childHeight
    let width: number
    if (objectFit === 'contain') {
      width = parentRatio > childRatio ? parentHeight * childRatio : parentWidth
    } else if (objectFit === 'cover') {
      width = parentRatio > childRatio ? parentWidth : parentHeight * childRatio
    } else {
      return [1, 1]
    }
    const height = width / childRatio
    return [parentWidth / width, parentHeight / height]
  }, [parentWidth, parentHeight, childHeight, childWidth, objectFit])

  return [1 / width, 1 / height]
}
