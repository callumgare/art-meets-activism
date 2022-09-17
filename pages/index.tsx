import Head from 'next/head'
import Container from '@/components/Container'
import SiteHeader from '@/components/SiteHeader'
import Layout from '@/components/Layout'
import Artworks from '@/components/Artworks'
import { getArtworks, getPrimaryMenu, getSiteInfo } from '@/lib/api'
import { css } from '@emotion/react'
import { Artwork } from '@/schema/artwork'
import { MenuItem } from '@/schema/menuItem'
import { SiteInfo } from '@/schema/siteInfo'

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
}

export default function Index({ siteMenu, siteInfo, artworks }: Props) {
  return (
    <Layout siteInfo={siteInfo} css={style}>
      <Head>
        <title>{siteInfo.title}</title>
      </Head>
      <Container>
        <SiteHeader siteInfo={siteInfo} siteMenu={siteMenu} />
        <div className="description">
          Leading artists have donated works to highlight the need to treat refugees and asylum seekers with dignity and
          compassion. All funds raised will be shared between the{' '}
          <a href="https://basp.org.au/">Brigidine Asylum Seekers Project (BASP)</a> and the{' '}
          <a href="https://rac-vic.org/">Refugee Action Collective - Victoria (RAC - VIC)</a>.
        </div>
        <Artworks artworks={artworks} />
      </Container>
    </Layout>
  )
}

export async function getStaticProps({}) {
  const siteMenu = await getPrimaryMenu()
  const artworks = await getArtworks()
  const siteInfo = await getSiteInfo()

  return {
    props: { siteMenu, artworks, siteInfo },
    revalidate: 10,
  }
}
