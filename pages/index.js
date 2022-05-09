import { useLayoutEffect } from '../dist'

const Home = () => {
  useLayoutEffect(() => {
    console.log('rendering')
  }, [])

  return (
    <div>
      <p>🌺</p>
    </div>
  )
}

export default Home
