export function removeParentSticky(element) {
  const position = getComputedStyle(element).position

  const isSticky = position === 'sticky'

  if (isSticky) {
    element.style.setProperty('position', 'relative')
    element.dataset.sticky = 'true'
  }

  if (element.offsetParent) {
    removeParentSticky(element.offsetParent)
  }
}

export function addParentSticky(element) {
  if (element?.dataset?.sticky === 'true') {
    element.style.removeProperty('position')
    delete element.dataset.sticky
  }

  if (element.parentNode) {
    addParentSticky(element.parentNode)
  }
}

export function offsetTop(element, accumulator = 0) {
  const top = accumulator + element.offsetTop
  if (element.offsetParent) {
    return offsetTop(element.offsetParent, top)
  }
  return top
}

export function offsetLeft(element, accumulator = 0) {
  const left = accumulator + element.offsetLeft
  if (element.offsetParent) {
    return offsetLeft(element.offsetParent, left)
  }
  return left
}

export function scrollTop(element, accumulator = 0) {
  const top = accumulator + (element?.scrollTop ?? 0)
  if (element.parentNode) {
    return scrollTop(element.parentNode, top)
  }
  return top + window.scrollY
}

export function scrollLeft(element, accumulator = 0) {
  const left = accumulator + (element?.scrollLeft ?? 0)
  if (element.parentNode) {
    return scrollLeft(element.parentNode, left)
  }
  return left + window.scrollX
}
