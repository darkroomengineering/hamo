import { useRouter } from 'next/router'

export const useDebug = () => {
  const router = useRouter()

  return router.asPath.includes('#debug') || process.env.NODE_ENV === 'development'
}

export default useDebug
