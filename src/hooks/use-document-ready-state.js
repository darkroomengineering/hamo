// useDocumentReadyState.js
// This code is a custom hook that returns the current document.readyState
// The useLayoutEffect hook is used to set the state of the document
// The useEffect hook is used to set the state of the document to 'complete' when the document is ready

import { useEffect, useState } from 'react'

export function useDocumentReadyState() {
  const [readyState, setReadyState] = useState()

  useEffect(() => {
    function onStateChange() {
      setReadyState(document.readyState)
    }

    document.addEventListener('readystatechange', onStateChange, false)
    onStateChange()

    return () => document.removeEventListener('readystatechange', onStateChange, false)
  }, [])

  return readyState
}
