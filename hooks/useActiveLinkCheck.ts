import { useRouter } from 'next/router'

import useIsMounted from './useIsMounted'

export default function useActiveLinkCheck(): (linkPath: string) => boolean {
  const isMounted = useIsMounted()

  const router = useRouter()

  return function (linkPath) {
    return isMounted ? router.asPath.replace(/#[^#]*$/, '') === linkPath.replace(/(.)\/$/, '$1') : false
  }
}
