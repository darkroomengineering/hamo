import {
  useDebouncedState,
  useIntersectionObserver,
  useLazyState,
  useMediaQuery,
  useRect,
  useResizeObserver,
  useTimeout,
  useWindowSize,
  useDebouncedEffect,
  useDebouncedCallback,
} from 'hamo'
import { useEffect, useRef, useState } from 'react'

export default function App() {
  useEffect(() => {
    history.scrollRestoration = 'auto'
  }, [])

  const { width, height, dpr } = useWindowSize()
  const isMobile = useMediaQuery('(max-width: 800px)')

  const countRef = useRef<HTMLElement>(null)
  // const [setCount, getCount] = useLazyState(0, (value, previousValue) => {
  //   console.log('count', value, previousValue)
  //   if (countRef.current) {
  //     countRef.current.textContent = `previous value: ${previousValue?.toString() ?? 'undefined'} - current value: ${value?.toString() ?? 'undefined'}`
  //   }
  // })

  const [count, setCount] = useState(0)

  const resizeObserverRef = useRef<HTMLElement>(null)
  const [setResizeObserverRef, getResizeObserverEntry] = useResizeObserver({
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

        rectRef.current.textContent = `width: ${width}px - height: ${height}px - top: ${top}px - left: ${left}px`
      }
    },
  })

  const [setIntersectionObserverRef, entry] = useIntersectionObserver()

  useDebouncedEffect(
    () => {
      console.log('debounced effect', count)
    },
    1000,
    [count]
  )

  const [debounceCount, setDebouncedCount] = useDebouncedState(count, 1000)
  const debouncedCallback = useDebouncedCallback(
    () => {
      console.log('debounced callback', count)
    },
    1000,
    [count]
  )

  useEffect(() => {
    console.log('debounce state', debounceCount)
  }, [debounceCount])

  // useEffect(() => {
  //   console.log(rect)
  // }, [rect])

  //   useEffect(() => {
  //     console.log(resizeObserver)
  //   }, [resizeObserver])

  //   console.log({ width, height, dpr, isMobile, resizeObserver })

  console.log('count', count)

  return (
    <div>
      <div>
        useWindowSize: width: {width} - height: {height} - dpr: {dpr}
      </div>
      <div>useMediaQuery: isMobile: {isMobile ? 'true' : 'false'}</div>
      <div>
        useLazyState: <span ref={countRef} />
        <button
          type="button"
          onClick={() => {
            // setCount((prev) => prev + 1)
            setDebouncedCount((prev) => prev + 1)
            // debouncedCallback()
          }}
        >
          Increment
        </button>
        <button
          type="button"
          onClick={() => {
            // setCount((prev) => prev - 1)
            setDebouncedCount((prev) => prev - 1)
            // debouncedCallback()
          }}
        >
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
          marginBottom: '1000px',
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
      <div ref={setIntersectionObserverRef}>
        useIntersectionObserver:{' '}
        <span>{entry?.isIntersecting ? 'true' : 'false'}</span>
      </div>
    </div>
  )
}
