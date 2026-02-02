/**
 * @name useObjectFit
 * @description A hook that calculates scale factors for fitting a child element within a parent element.
 * @param {number} parentWidth - The width of the parent element.
 * @param {number} parentHeight - The height of the parent element.
 * @param {number} childWidth - The width of the child element.
 * @param {number} childHeight - The height of the child element.
 * @param {'contain' | 'cover'} objectFit - The object fit mode ('contain' or 'cover').
 * @returns {[number, number]} A tuple containing [widthScale, heightScale].
 */
export function useObjectFit(
  parentWidth = 1,
  parentHeight = 1,
  childWidth = 1,
  childHeight = 1,
  objectFit: 'contain' | 'cover' = 'cover'
): [number, number] {
  // Early return for invalid inputs
  if (!(parentWidth && parentHeight && childWidth && childHeight)) {
    return [1, 1]
  }

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
  const widthScale = parentWidth / width
  const heightScale = parentHeight / height

  return [1 / widthScale, 1 / heightScale]
}
