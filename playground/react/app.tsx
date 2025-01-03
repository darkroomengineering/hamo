import {
  useLazyState,
  useMediaQuery,
  useRect,
  useResizeObserver,
  useTimeout,
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
        const { inlineSize: width, blockSize: height } = entry.borderBoxSize[0]

        resizeObserverRef.current.textContent = `width: ${width}px - height: ${height}px`

        // console.log(width, height)
      }
    },
  })

  const rectRef = useRef<HTMLElement>(null)
  const [setRectRef, rect, setRectWrapperRef] = useRect({
    // lazy: true,
    callback(rect) {
      if (rectRef.current) {
        const { width, height, top, left } = rect

        // console.log({ width, height, top, left })

        rectRef.current.textContent = `width: ${width}px - height: ${height}px - top: ${top}px - left: ${left}px`
      }
    },
  })

  useTimeout(() => {
    console.log('timeout')
  }, 5000)

  useEffect(() => {
    console.log(rect)
  }, [rect])

  //   useEffect(() => {
  //     console.log(resizeObserver)
  //   }, [resizeObserver])

  //   console.log({ width, height, dpr, isMobile, resizeObserver })

  return (
    <div ref={setRectWrapperRef}>
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
        ref={setResizeObserverRef}
        style={{
          width: '50vw',
          height: '100px',
          border: '1px solid red',
          padding: '20px',
        }}
      >
        useResizeObserver: <span ref={resizeObserverRef} />
      </div>
      <div
        ref={setRectRef}
        style={{
          width: '50vw',
          height: '100px',
          border: '1px solid yellow',
          padding: '20px',
        }}
      >
        useRect: <span ref={rectRef} />
      </div>
    </div>
  )
}
