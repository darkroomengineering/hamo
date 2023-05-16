import React from 'react'
import { useIntersectionObserver } from '../src/hooks/use-intersection-observer'
import { useResizeObserver } from '../src/hooks/use-resize-observer'
import {
  useDebug,
  useDocumentReadyState,
  useFrame,
  useIsClient,
  useIsTouchDevice,
  useRect,
  useMediaQuery,
} from '../src/index'

function App() {
  // const [setRectRef, rect] = useRect(1000)
  const [setRectRef, rect] = useRect({ lazy: false })
  const isTouch = useIsTouchDevice()
  const debug = useDebug()
  const isClient = useIsClient()
  const readyState = useDocumentReadyState()
  const [setRef, intersection] = useIntersectionObserver({ lazy: false })
  const isMobile = useMediaQuery('(max-width: 800px)')

  useFrame((time, deltaTime) => {
    // console.log({ time, deltaTime })
  })

  return (
    <main className="main" ref={setRef}>
      <p>is touch? {isTouch ? 'yes' : 'no'}</p>
      <p>is debug? {debug ? 'yes' : 'no'}</p>
      <p>document readyState? {readyState}</p>
      <p>is in viewport? {intersection.isIntersecting ? 'yes' : 'no'}</p>
      <p>is client? {isClient ? 'yes' : 'no'}</p>
      <p>is mobile? {isMobile ? 'yes' : 'no'}</p>
      <div ref={setRectRef} className="rect">
        top: {rect?.top}
        <br />
        height: {rect?.height}
        <br />
        left: {rect?.left}
        <br />
        top: {rect?.top}
        <br />
        width: {rect?.width}
      </div>
    </main>
  )
}

export default App
