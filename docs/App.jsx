import React from 'react'
import { useDebug, useDocumentReadyState, useIsTouchDevice } from '../src/index'

function App() {
  const isTouch = useIsTouchDevice()
  const debug = useDebug()
  const ready = useDocumentReadyState()

  return (
    <main className="main">
      <p>is touch? {isTouch ? 'yes' : 'no'}</p>
      <p>is debug? {debug ? 'yes' : 'no'}</p>
      <p>is document ready? {ready ? 'yes' : 'no'}</p>
    </main>
  )
}

export default App
