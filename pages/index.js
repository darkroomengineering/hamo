import { useLayoutEffect } from '../src/hooks/use-isomorphic-layout-effect'

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
