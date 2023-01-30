// useDocumentReadyState.js
// This code is a custom hook that returns the current document.readyState
// The useLayoutEffect hook is used to set the state of the document
// The useEffect hook is used to set the state of the document to 'complete' when the document is ready

import { useEffect, useState } from 'react'

export function useDocumentReadyState() {
  const [readyState, setReadyState] = useState(() => {
    if (typeof document !== 'undefined') {
      return document.readyState
    }
    return 'loading'
  })

  useEffect(() => {
    if (typeof document === 'undefined') return

    setReadyState(document.readyState)

    function onStateChange() {
      setReadyState(document.readyState)
    }

    document.addEventListener('readystatechange', onStateChange, false)

    return () => document.removeEventListener('readystatechange', onStateChange, false)
  }, [])

  return readyState
}
