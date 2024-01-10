import { useResizeObserver } from './use-resize-observer'
import debounce from 'just-debounce-it'
import { useCallback, useEffect, useRef, useState } from 'react'
import { create } from 'zustand'
import { createNanoEvents } from 'nanoevents'

function removeParentSticky(element) {
  const position = getComputedStyle(element).position

  const isSticky = position === 'sticky'

  if (isSticky) {
    element.style.setProperty('position', 'static')
    element.dataset.sticky = 'true'
  }

  if (element.offsetParent) {
    removeParentSticky(element.offsetParent)
  }
}

function addParentSticky(element) {
  if (element?.dataset?.sticky === 'true') {
    element.style.removeProperty('position')
    element.dataset.sticky = 'true'
    delete element.dataset.sticky
  }

  if (element.parentNode) {
    addParentSticky(element.parentNode)
  }
}

function offsetTop(element, accumulator = 0) {
  const top = accumulator + element.offsetTop
  if (element.offsetParent) {
    return offsetTop(element.offsetParent, top)
  }
  return top
}

function offsetLeft(element, accumulator = 0) {
  const left = accumulator + element.offsetLeft
  if (element.offsetParent) {
    return offsetLeft(element.offsetParent, left)
  }
  return left
}

function scrollTop(element, accumulator = 0) {
  const top = accumulator + element.scrollTop
  if (element.offsetParent) {
    return scrollTop(element.offsetParent, top)
  }
  return top + window.scrollY
}

function scrollLeft(element, accumulator = 0) {
  const left = accumulator + element.scrollLeft
  if (element.offsetParent) {
    return scrollLeft(element.offsetParent, left)
  }
  return left + window.scrollX
}

const useStore = create((set) => ({
  elements: [],
  addElement: (element) => {
    set((state) => ({
      elements: [...state.elements, element],
    }))
  },
  removeElement: (element) => {
    set((state) => ({
      elements: state.elements.filter((el) => el !== element),
    }))
  },
}))

function observe(element) {
  useStore.getState().addElement(element)
}

function unobserve(element) {
  useStore.getState().removeElement(element)
}

const emitter = createNanoEvents()

function resize() {
  emitter.emit('resize')
}

/**
 * useRect - observe elements BoundingRect
 * @param {boolean} ignoreTransform - should include transform in the returned rect or not
 * @param {boolean} ignoreSticky - should ingnore parent sticky elements or not
 * @param {boolean} lazy - should return a state or a getter
 * @param {number} debounce - minimum delay between two rect computations
 * @param {Function} callback - called on value change
 */

export function useRect({
  ignoreTransform = false,
  ignoreSticky = true,
  lazy = false,
  debounce: debounceDelay = 500,
  callback = () => {},
} = {}) {
  const [element, setElement] = useState()
  const [rect, setRect] = useState({})
  const rectRef = useRef({})

  const onElementResize = useCallback(
    (entry) => {
      const width = entry.borderBoxSize[0].inlineSize
      const height = entry.borderBoxSize[0].blockSize

      rectRef.current.width = width
      rectRef.current.height = height

      callback(rectRef.current)

      if (!lazy) {
        setRect({ ...rectRef.current })
      }
    },
    [lazy],
  )

  const [setResizeObserverElement] = useResizeObserver(
    {
      lazy: true,
      debounce: debounceDelay,
      callback: onElementResize,
    },
    [debounceDelay, onElementResize],
  )

  const elements = useStore(({ elements }) => elements)

  const onParentsResize = useCallback(() => {
    if (!element) return

    let top, left

    if (ignoreSticky) removeParentSticky(element)
    if (ignoreTransform) {
      top = offsetTop(element)
      left = offsetLeft(element)
    } else {
      const rect = element.getBoundingClientRect()
      top = rect.top + scrollTop(element)
      left = rect.left + scrollLeft(element)
    }
    if (ignoreSticky) addParentSticky(element)

    rectRef.current.top = top
    rectRef.current.left = left

    callback(rectRef.current)

    if (!lazy) {
      setRect({ ...rectRef.current })
    }
  }, [ignoreTransform, ignoreSticky, lazy, element])

  // resize if body height changes
  useEffect(() => {
    const debouncedOnParentsResize = debounce(onParentsResize, debounceDelay, true)

    const resizeObserver = new ResizeObserver(debouncedOnParentsResize)
    resizeObserver.observe(document.body)

    elements.forEach((element) => {
      resizeObserver.observe(element)
    })

    return () => {
      resizeObserver.disconnect()
      debouncedOnParentsResize.cancel()
    }
  }, [elements, debounceDelay, onParentsResize])

  const getRect = useCallback(() => rectRef.current, [])

  useEffect(() => {
    function onResize() {
      const elementRect = element.getBoundingClientRect()

      rectRef.current.width = elementRect.width
      rectRef.current.height = elementRect.height

      onParentsResize()
    }

    const unbind = emitter.on('resize', onResize)

    return unbind
  }, [element, onParentsResize])

  return [
    (node) => {
      setElement(node)
      setResizeObserverElement(node)
    },
    lazy ? getRect : rect,
  ]
}

useRect.observe = observe
useRect.unobserve = unobserve
useRect.resize = resize
