import React from 'react'
import {
  useDebug,
  useDocumentReadyState,
  useFrame,
  useIsClient,
  useIsTouchDevice,
  useIsVisible,
  useRect,
} from '../src/index'

function App() {
  const [setRectRef, rect] = useRect(1000)
  const isTouch = useIsTouchDevice()
  const debug = useDebug()
  const isclient = useIsClient()
  const ready = useDocumentReadyState()
  const { setRef, inView } = useIsVisible({ threshold: 0.5 })

  useFrame((time, deltaTime) => {
    // console.log({ time, deltaTime })
  })

  return (
    <main className="main" ref={setRef}>
      <p>is touch? {isTouch ? 'yes' : 'no'}</p>
      <p>is debug? {debug ? 'yes' : 'no'}</p>
      <p>is document ready? {ready ? 'yes' : 'no'}</p>
      <p>is in viewport? {inView ? 'yes' : 'no'}</p>
      <p>is client? {isclient ? 'yes' : 'no'}</p>
      <div ref={setRectRef}>
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
