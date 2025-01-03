import {
  useLazyState,
  useMediaQuery,
  useResizeObserver,
  useWindowSize,
} from 'hamo'
import { useEffect, useRef } from 'react'

export default function App() {
  const { width, height, dpr } = useWindowSize()
  const isMobile = useMediaQuery('(max-width: 800px)')

  const countRef = useRef<HTMLElement>(null)
  const [getCount, setCount] = useLazyState(0, (value, previousValue) => {
    console.log('count', value, previousValue)
    if (countRef.current) {
      countRef.current.textContent = `previous value: ${previousValue?.toString() ?? 'undefined'} - current value: ${value?.toString() ?? 'undefined'}`
    }
  })

  const resizeObserverRef = useRef<HTMLElement>(null)
  const [setResizeObserverRef, resizeObserver] = useResizeObserver({
    lazy: true,
    callback: (entry) => {
      if (entry && resizeObserverRef.current) {
        const { width, height } = entry.contentRect

        resizeObserverRef.current.textContent = `width: ${width}px - height: ${height}px`

        console.log(width, height)
      }
    },
  })

  //   useEffect(() => {
  //     console.log(resizeObserver)
  //   }, [resizeObserver])

  //   console.log({ width, height, dpr, isMobile, resizeObserver })

  return (
    <>
      <div>
        useWindowSize: width: {width} - height: {height} - dpr: {dpr}
      </div>
      <div>useMediaQuery: isMobile: {isMobile ? 'true' : 'false'}</div>
      <div>
        useLazyState: <span ref={countRef} />
        <button type="button" onClick={() => setCount((prev) => prev + 1)}>
          Increment
        </button>
        <button type="button" onClick={() => setCount((prev) => prev - 1)}>
          Decrement
        </button>
      </div>
      <div
        ref={(node) => {
          setResizeObserverRef(node)
        }}
        style={{ width: '50vw', height: '100px', border: '1px solid red' }}
      >
        useResizeObserver: <span ref={resizeObserverRef} />
      </div>
    </>
  )
}
