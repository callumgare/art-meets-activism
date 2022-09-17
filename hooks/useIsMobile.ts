import { useEffect, useState } from 'react'

interface extendedNavigator extends Navigator {
  msMaxTouchPoints: number
}

declare const navigator: extendedNavigator

export default function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    setIsMobile(checkIfMobile())
  }, [])

  return isMobile
}

// based off https://stackoverflow.com/a/72502261
function checkIfMobile(): boolean {
  if (typeof window === 'undefined') {
    return false
  }
  if ('maxTouchPoints' in navigator) {
    return navigator.maxTouchPoints > 0
  } else if ('msMaxTouchPoints' in navigator) {
    //
    return navigator.msMaxTouchPoints > 0
  } else {
    const mQ = 'matchMedia' in window && matchMedia('(pointer:coarse)')
    if (mQ && mQ.media === '(pointer:coarse)') {
      return !!mQ.matches
    } else if ('orientation' in window) {
      return true // deprecated, but good fallback
    } else {
      // Only as a last resort, fall back to user agent sniffing
      const UA = navigator.userAgent
      return /\b(BlackBerry|webOS|iPhone|IEMobile)\b/i.test(UA) || /\b(Android|Windows Phone|iPad|iPod)\b/i.test(UA)
    }
  }
}
