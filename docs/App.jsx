import React from 'react'
import {
  useDebug,
  useDocumentReadyState,
  useId,
  useIsTouchDevice,
  useRect,
} from '../src/index'

function App() {
  const [ref, compute] = useRect(1000)
  const isTouch = useIsTouchDevice()
  const debug = useDebug()
  const ready = useDocumentReadyState()
  const id = useId()

  const rect = compute()

  return (
    <main className="main">
      <p>is touch? {isTouch ? 'yes' : 'no'}</p>
      <p>is debug? {debug ? 'yes' : 'no'}</p>
      <p>is document ready? {ready ? 'yes' : 'no'}</p>
      <div ref={ref}>top: {rect.top}</div>
      <p>id: {id}</p>
    </main>
  )
}

export default App
