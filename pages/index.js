import { useIsTouchDevice } from "../src/hooks/use-is-touch-device"

const Home = () => {
  const isTouch = useIsTouchDevice()

  return (
    <div >
      {console.log(isTouch)}
      <p>🌺 {isTouch}</p>
    </div>
  )
}

export default Home
