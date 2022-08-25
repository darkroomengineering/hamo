import React from 'react'
import {
  useDebug,
  useDocumentReadyState,
  useFrame,
  useId,
  useIsTouchDevice,
  useIsVisible,
  useRect,
} from '../dist/index.js'

function App() {
  const [setRectRef, rect] = useRect(1000)
  const isTouch = useIsTouchDevice()
  const debug = useDebug()
  const ready = useDocumentReadyState()
  const id = useId()
  const { setRef, inView } = useIsVisible()

  useFrame((time, deltaTime) => {
    console.log({ time, deltaTime })
  })

  return (
    <main className="main" ref={setRef}>
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
      <p>id: {id}</p>
    </main>
  )
}

export default App
