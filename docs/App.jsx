import React from 'react'
import {
  useDebug,
  useDocumentReadyState,
  useId,
  useIsTouchDevice,
  useRect,
  useIsVisible,
  useFrame,
} from '../src/index.js'

function App() {
  const [ref, compute] = useRect(1000)
  const isTouch = useIsTouchDevice()
  const debug = useDebug()
  const ready = useDocumentReadyState()
  const id = useId()
  const { setRef, inView } = useIsVisible()
  const rect = compute()
  useFrame((time, deltaTime) => {
    console.log({ time, deltaTime })
  })

  return (
    <main className="main" ref={setRef}>
      <p>is touch? {isTouch ? 'yes' : 'no'}</p>
      <p>is debug? {debug ? 'yes' : 'no'}</p>
      <p>is document ready? {ready ? 'yes' : 'no'}</p>
      <p>is in viewport? {inView ? 'yes' : 'no'}</p>
      <div ref={ref}>top: {rect.top}</div>
      <p>id: {id}</p>
    </main>
  )
}

export default App
