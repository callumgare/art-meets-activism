import useIsMounted from '@/hooks/useIsMounted'
import Script from 'next/script'

export default function AnalyticsScript() {
  const isMounted = useIsMounted()
  if (!process.env.NEXT_PUBLIC_PLAUSIBLE_ANALYTICS_BASE_URL || !isMounted) {
    return null
  }
  return (
    <Script
      defer
      data-domain={`${location.host}`}
      src={`${process.env.NEXT_PUBLIC_PLAUSIBLE_ANALYTICS_BASE_URL}/js/plausible.js`}
    />
  )
}
