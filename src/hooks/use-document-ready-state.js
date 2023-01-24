import { useState } from 'react'
import { isClient } from '../misc/util'
import { useLayoutEffect } from './use-isomorphic-layout-effect'

function _useDocumentReadyState() {
  const [readyState, setReadyState] = useState(document.readyState)

  useLayoutEffect(() => {
    setReadyState(document.readyState)

    function onStateChange() {
      setReadyState(document.readyState)
    }

    document.addEventListener('readystatechange', onStateChange, false)

    return () =>
      document.removeEventListener('readystatechange', onStateChange, false)
  }, [])

  return readyState
}

export const useDocumentReadyState = isClient
  ? _useDocumentReadyState
  : () => undefined
