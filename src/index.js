/*
 * This code imports all of the hooks in the hooks directory, and exports them.
 * It also exports the dispatch function from use-event-bus.js.
 * This file is used by the build system to create an entry point for the hooks.
 */

export { useOutsideClickEvent } from './hooks/use-click-outside-event.js'
export { useDebug } from './hooks/use-debug.js'
export { useDocumentReadyState } from './hooks/use-document-ready-state.js'
export { useFrame } from './hooks/use-frame/index.js'
export { useIntersectionObserver } from './hooks/use-intersection-observer.js'
export { useInterval } from './hooks/use-interval.js'
export { useIsClient } from './hooks/use-is-client.js'
export { useIsTouchDevice } from './hooks/use-is-touch-device.js'
export { useMediaQuery } from './hooks/use-media-query.js'
export { useRect } from './hooks/use-rect/index.js'
export { useResizeObserver } from './hooks/use-resize-observer.js'
export { useSlots } from './hooks/use-slots.js'
export { useWindowSize } from './hooks/use-window-size/index.js'
