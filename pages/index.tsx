import Head from 'next/head'
import Container from '@/components/Container'
import SiteHeader from '@/components/SiteHeader'
import Layout from '@/components/Layout'
import { getArtworks, getFrontPage, getPrimaryMenu, getSiteInfo } from '@/lib/api'
import { css } from '@emotion/react'
import { Artwork } from '@/schema/artwork'
import { MenuItem } from '@/schema/menuItem'
import { SiteInfo } from '@/schema/siteInfo'
import RenderHTMLContent from '@/components/RenderHTMLContent'
import { Page } from '@/schema/page'

const style = css`
  .description {
    text-align: center;
    max-width: 700px;
    margin: 3em auto;
    font-size: 1.1em;
    background: var(--colour-background-accent);
    padding: 1.5em 1.7em;
  }
`

type Props = {
  siteMenu: MenuItem[]
  siteInfo: SiteInfo
  artworks: Artwork[]
  frontPage: Page
}

export default function Index({ siteMenu, siteInfo, artworks, frontPage }: Props) {
  return (
    <Layout siteInfo={siteInfo} css={style}>
      <Head>
        <title>{siteInfo.title}</title>
      </Head>
      <Container>
        <SiteHeader siteInfo={siteInfo} siteMenu={siteMenu} />

        <RenderHTMLContent artworks={artworks}>{frontPage.content || ''}</RenderHTMLContent>
      </Container>
    </Layout>
  )
}

export async function getStaticProps({}) {
  const siteMenu = await getPrimaryMenu()
  const artworks = await getArtworks()
  const siteInfo = await getSiteInfo()
  const frontPage = await getFrontPage()

  return {
    props: { siteMenu, artworks, siteInfo, frontPage },
    revalidate: 10,
  }
}
