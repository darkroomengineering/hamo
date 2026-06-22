export function removeParentSticky(element: HTMLElement) {
  const position = getComputedStyle(element).position

  const isSticky = position === 'sticky'

  if (isSticky) {
    element.style.setProperty('position', 'relative')
    element.dataset.sticky = 'true'
  }

  if (element.offsetParent) {
    removeParentSticky(element.offsetParent as HTMLElement)
  }
}

export function addParentSticky(element: HTMLElement) {
  if (element?.dataset?.sticky === 'true') {
    element.style.removeProperty('position')
    delete element.dataset.sticky
  }

  if (element.parentNode) {
    addParentSticky(element.parentNode as HTMLElement)
  }
}

export function offsetTop(element: HTMLElement, accumulator = 0) {
  const top = accumulator + element.offsetTop
  if (element.offsetParent) {
    return offsetTop(element.offsetParent as HTMLElement, top)
  }
  return top
}

export function offsetLeft(element: HTMLElement, accumulator = 0) {
  const left = accumulator + element.offsetLeft
  if (element.offsetParent) {
    return offsetLeft(element.offsetParent as HTMLElement, left)
  }
  return left
}

export function scrollTop(element: HTMLElement, accumulator = 0) {
  const top = accumulator + (element?.scrollTop ?? 0)
  if (element.parentNode) {
    return scrollTop(element.parentNode as HTMLElement, top)
  }
  return top
}

export function scrollLeft(element: HTMLElement, accumulator = 0) {
  const left = accumulator + (element?.scrollLeft ?? 0)
  if (element.parentNode) {
    return scrollLeft(element.parentNode as HTMLElement, left)
  }
  return left
}
