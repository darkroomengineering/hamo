import React from 'react'
import {
  useDebug,
  useDocumentReadyState,
  useFrame,
  useIsTouchDevice,
  useIsVisible,
  useRect,
} from '../src/index'

function App() {
  const [setRectRef, rect] = useRect(1000)
  const isTouch = useIsTouchDevice()
  const debug = useDebug()
  const ready = useDocumentReadyState()
  const { setRef, inView } = useIsVisible({ once: true })

  useFrame((time, deltaTime) => {
    console.log({ time, deltaTime })
  })

  return (
    <main className="main" ref={(node) => setRef(node)}>
      <p>is touch? {isTouch ? 'yes' : 'no'}</p>
      <p>is debug? {debug ? 'yes' : 'no'}</p>
      <p>is document ready? {ready ? 'yes' : 'no'}</p>
      <p>is in viewport? {inView ? 'yes' : 'no'}</p>
      <div ref={(node) => setRectRef(node)}>
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
