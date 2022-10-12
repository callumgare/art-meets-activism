import { css } from '@emotion/react'
import { ReactNode } from 'react'

import { SiteInfo } from '@/schema/siteInfo'
import Footer from '@/components/Footer'
import Meta from '@/components/Meta'
import AnalyticsScript from '@/components/AnalyticsScript'

const style = css`
  min-height: 100vh;
  min-height: 100dvh;
  display: flex;
  flex-direction: column;

  main {
    flex: 1;
  }
`

type Props = {
  siteInfo: SiteInfo
  children: ReactNode
  className?: string
}

export default function Layout({ siteInfo, children, className = '' }: Props) {
  return (
    <>
      <Meta siteInfo={siteInfo} />
      <AnalyticsScript />
      <div css={style} className={className}>
        <main>{children}</main>
        <Footer siteInfo={siteInfo} />
      </div>
    </>
  )
}
