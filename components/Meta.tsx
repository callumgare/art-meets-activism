import { SiteInfo } from '@/schema/siteInfo'
import Head from 'next/head'

type Props = {
  siteInfo: SiteInfo
}

export default function Meta({ siteInfo }: Props) {
  return (
    <Head>
      <link rel="apple-touch-icon" sizes="180x180" href="/favicon/apple-touch-icon.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon/favicon-16x16.png" />
      <link rel="manifest" href="/favicon/site.webmanifest" />
      <link rel="mask-icon" href="/favicon/safari-pinned-tab.svg" color="#5bbad5" />
      <link rel="shortcut icon" href="/favicon/favicon.ico" />
      <meta name="msapplication-TileColor" content="#2b5797" />
      <meta name="msapplication-config" content="/favicon/browserconfig.xml" />
      {/* key prop is necessary for theme-color meta tags until this issue is fixed https://github.com/vercel/next.js/issues/40570 */}
      <meta name="theme-color" media="(prefers-color-scheme: light)" key="light-mode" content="#f9f7f5" />
      <meta name="theme-color" media="(prefers-color-scheme: dark)" key="dark-mode" content="#181a1b" />
      <meta name="description" content={siteInfo.description} />
      <meta property="og:image" content="/landscape-site-image.jpg" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={siteInfo.title} />
      <meta name="twitter:description" content={siteInfo.description} />
      <meta name="twitter:image" content="/landscape-site-image.jpg" />
    </Head>
  )
}
