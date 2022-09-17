import Head from 'next/head'
import { GetStaticProps } from 'next'

import Container from '@/components/Container'
import RenderHTMLContent from '@/components/RenderHTMLContent'
import SiteHeader from '@/components/SiteHeader'
import Layout from '@/components/Layout'
import { getAllPagesInfo, getArtists, getArtworks, getPageBySlug, getPrimaryMenu, getSiteInfo } from '@/lib/api'
import { Artist } from '@/schema/artist'
import { css } from '@emotion/react'
import { SiteInfo } from '@/schema/siteInfo'
import { Page as PageData } from '@/schema/page'
import { MenuItem } from '@/schema/menuItem'

const style = css`
  article {
    max-width: 900px;
    margin: 4rem auto;
  }
`

type Props = {
  page: PageData
  siteInfo: SiteInfo
  siteMenu: MenuItem[]
  artists: Artist[]
}

export default function Page({ page, siteInfo, siteMenu, artists }: Props) {
  return (
    <Layout siteInfo={siteInfo}>
      <Container css={style}>
        <SiteHeader siteInfo={siteInfo} siteMenu={siteMenu} />
        <article>
          <Head>
            <title>{`${page.title} | ${siteInfo.title}`}</title>
          </Head>
          <RenderHTMLContent artists={artists}>{page.content}</RenderHTMLContent>
        </article>
      </Container>
    </Layout>
  )
}

export const getStaticProps: GetStaticProps<Record<string, unknown>, { pageSlug: string }> = async ({ params }) => {
  if (!params) {
    return { notFound: true }
  }

  const siteInfo = await getSiteInfo()
  const page = await getPageBySlug(params.pageSlug)
  const siteMenu = await getPrimaryMenu()
  const artists = await getArtists()
  const artworks = await getArtworks()

  if (!page) {
    return { notFound: true }
  }

  return {
    props: {
      page,
      siteInfo,
      siteMenu,
      artists,
      artworks,
    },
    revalidate: 10,
  }
}

export async function getStaticPaths() {
  const allPagesInfo = await getAllPagesInfo()

  return {
    paths: allPagesInfo.map((pageInfo) => pageInfo.path),
    fallback: 'blocking',
  }
}
