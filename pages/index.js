import { useEffect } from "react"
import { useRect } from "../src/hooks/use-rect"
import { on } from "../src/misc/util"

const Home = () => {
  const [ref, compute] = useRect(1000)

  useEffect(() => {
    function onScroll() {
      const scrollY = window.scrollY

      // use scrollY = 0 to get the rect position relative to the page
      // use scrollY = window.scrollY to get the rect position relative to the screen
      const { width, height, left, right, top, bottom, inView } = compute(scrollY)
    }

    on(onScroll, true)

    return () => {
      off(onScroll, true)
    }
  }, [])

  return (
    <div ref={ref}>
      <p>🌺</p>
    </div>
  )
}

export default Home
