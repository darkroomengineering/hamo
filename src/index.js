/*
 * This code imports all of the hooks in the hooks directory, and exports them.
 * It also exports the dispatch function from use-event-bus.js.
 * This file is used by the build system to create an entry point for the hooks.
 */

export { default as useOutsideClickEvent } from './hooks/use-click-outside-event.js'
export { default as useDebug } from './hooks/use-debug.js'
export { default as useDocumentReadyState } from './hooks/use-document-ready-state.js'
export { default as useEventBus, dispatch } from './hooks/use-event-bus.js'
export { default as useFrame } from './hooks/use-frame.js'
export { default as useId } from './hooks/use-id.js'
export { default as useInterval } from './hooks/use-interval.js'
export { default as useIsTouchDevice } from './hooks/use-is-touch-device.js'
export { default as useIsVisible } from './hooks/use-is-visible.js'
export { default as useLayoutEffect } from './hooks/use-isomorphic-layout-effect.js'
export { default as useMediaQuery } from './hooks/use-media-query.js'
export { default as useRect } from './hooks/use-rect.js'
export { default as useSlots } from './hooks/use-slots.js'
