import { Artist, artistSchema } from '@/schema/artist'
import { Artwork, artworkSchema } from '@/schema/artwork'
import { MenuItem, menuItemSchema } from '@/schema/menuItem'
import { Page, pageSchema } from '@/schema/page'
import { PageInfo, pageInfoSchema } from '@/schema/pageInfo'
import { SiteInfo, siteInfoSchema } from '@/schema/siteInfo'

// We can't guarantee what data the server will return to us so we use any
// but we must verify that data to confirm it is what we expect
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type GraphGLResult = any

type FetchOptions = {
  variables?: {
    [key: string]: string
  }
}

async function fetchAPI(query = '', { variables }: FetchOptions = {}) {
  const headers: { [key: string]: string } = {
    'Content-Type': 'application/json',
  }

  // WPGraphQL Plugin must be enabled
  const res = await fetch(`${process.env.WORDPRESS_BASE_URL}/graphql`, {
    headers,
    method: 'POST',
    body: JSON.stringify({
      query,
      variables,
    }),
  })

  const json = await res.json()
  if (json.errors) {
    console.error(json.errors)
    throw new Error('Failed to fetch API')
  }
  return json.data
}

export async function getAllPagesInfo(): Promise<PageInfo[]> {
  const data = await fetchAPI(`
    {
      pages(first: 10000) {
        edges {
          node {
            slug
          }
        }
      }
    }
  `)
  return data?.pages.edges
    .map((wpPage: GraphGLResult) => ({
      slug: wpPage.node.slug,
      path: `/${wpPage.node.slug}`,
    }))
    .map(pageInfoSchema.parse)
}

export async function getPageBySlug(slug: string): Promise<Page> {
  const data = await fetchAPI(
    `query PageBySlug($id: ID!, $idType: PageIdType!) {
      page(id: $id, idType: $idType) {
        title
        slug
        content
      }
    }`,
    {
      variables: {
        id: `/${slug}/`,
        idType: 'URI',
      },
    }
  )

  return pageSchema.parse(data?.page)
}

export async function getFrontPage(): Promise<Page> {
  const data = await fetchAPI(`
    {
      pages(first: 10000) {
        edges {
          node {
            title
            slug
            content
            isFrontPage
          }
        }
      }
    }
  `)
  const wpFrontPage = data?.pages.edges.find((wpPage: GraphGLResult) => wpPage.node.isFrontPage)
  return pageSchema.parse({
    title: wpFrontPage.node.title,
    slug: wpFrontPage.node.slug,
    content: wpFrontPage.node.content,
  })
}

export async function getSiteInfo(): Promise<SiteInfo> {
  const data = await fetchAPI(`
    {
      generalSettings {
        title
        description
        url
      }
      allSiteInfo {
        nodes {
          SiteInfo {
            footerText
            headerInfoText
          }
        }
      }
    }
  `)

  return siteInfoSchema.parse({
    title: data?.generalSettings?.title,
    description: data?.generalSettings?.description,
    url: 'https://artmeetsactivism.com', // Hardcode for now until this can be pulled from the CMS https://github.com/wp-graphql/wp-graphql/issues/2520
    cmsUrl: data?.generalSettings?.url,
    footerText: data?.allSiteInfo.nodes?.[0].SiteInfo.footerText,
    headerInfoText: data?.allSiteInfo.nodes?.[0].SiteInfo.headerInfoText,
  })
}

export async function getPrimaryMenu(): Promise<MenuItem[]> {
  const data = await fetchAPI(`
    {
      menu(id:"primary", idType: LOCATION) {
        menuItems {
          nodes {
            id
            label
            path
          }
        }
      }
    }
  `)
  return data?.menu?.menuItems?.nodes.map(menuItemSchema.parse)
}

export async function getArtworks(): Promise<Artwork[]> {
  const data = await fetchAPI(`
    query {
      artworks(first: 1000) {
        nodes {
          id
          title
          slug
          artwork {
            imageOfTheArtwork {
              altText
              caption
              mediaItemUrl
              mediaDetails {
                width
                height
              }
            }
            startingPrice
            statement
            auctionType
            auctionUrl
            artist {
              ... on Artist {
                id
                title
                slug
              } 
            }
          }
        }
      }
    }
  `)
  const artworks = data?.artworks?.nodes.map((wpArtwork: GraphGLResult) => ({
    id: wpArtwork.id,
    title: wpArtwork.title,
    slug: wpArtwork.slug,
    image: {
      altText: wpArtwork.artwork.imageOfTheArtwork.altText,
      caption: wpArtwork.artwork.imageOfTheArtwork.caption,
      fileUrl: wpArtwork.artwork.imageOfTheArtwork.mediaItemUrl,
      width: wpArtwork.artwork.imageOfTheArtwork.mediaDetails.width,
      height: wpArtwork.artwork.imageOfTheArtwork.mediaDetails.height,
    },
    startingPrice: wpArtwork.artwork.startingPrice ?? 0, // startingPrice is a required field so every artwork should have a starting price but wordpress returns 0 as null for some reason
    auctionType: wpArtwork.artwork.auctionType,
    auctionURL: wpArtwork.artwork.auctionUrl,
    statement: wpArtwork.artwork.statement,
    artists: wpArtwork.artwork.artist,
  }))

  const parsedArtworks: Artwork[] = artworks
    .map((artwork: Artwork) => {
      try {
        return artworkSchema.parse(artwork)
      } catch (error) {
        console.info(artwork)
        throw error
      }
    })
    .sort((artworkA: Artwork, artworkB: Artwork) => sortByName(artworkA.artists[0]?.title, artworkB.artists[0]?.title))
  return parsedArtworks
}

export async function getArtists(): Promise<Artist[]> {
  const data = await fetchAPI(`
    query {
      artists(first: 1000) {
        nodes {
          id
          title
          slug
          artist {
            shortBiography
            photoOfTheArtist {
              altText
              caption
              mediaItemUrl
              mediaDetails {
                width
                height
              }
            }
          }
        }
      }
      artworks(first: 1000) {
        nodes {
          id
          title
          slug
          artwork {
            artist {
              ... on Artist {
                id
              } 
            }
          }
        }
      }
    }
  `)

  const artists = data?.artists?.nodes.map((wpArtist: GraphGLResult) => ({
    id: wpArtist.id,
    title: wpArtist.title,
    slug: wpArtist.slug,
    image: wpArtist.artist.photoOfTheArtist && {
      altText: wpArtist.artist.photoOfTheArtist.altText,
      caption: wpArtist.artist.photoOfTheArtist.caption,
      fileUrl: wpArtist.artist.photoOfTheArtist.mediaItemUrl,
      width: wpArtist.artist.photoOfTheArtist.mediaDetails.width,
      height: wpArtist.artist.photoOfTheArtist.mediaDetails.height,
    },
    biography: wpArtist.artist.shortBiography,
    artworks: data?.artworks?.nodes
      .filter((wpArtwork: GraphGLResult) =>
        wpArtwork.artwork.artist.some((wpArtworkArtist: GraphGLResult) => wpArtworkArtist.id === wpArtist.id)
      )
      .map((wpArtwork: GraphGLResult) => ({
        id: wpArtwork.id,
        slug: wpArtwork.slug,
        title: wpArtwork.title,
      })),
  }))

  const parsedArtists: Artist[] = artists
    .map(artistSchema.parse)
    .sort((artistA: Artist, artistB: Artist) => sortByName(artistA.title, artistB.title))
  return parsedArtists
}

function sortByName(nameA: string, nameB: string) {
  const normalisedNameA = nameA.replace(/^Dr\s+/i, '')
  const normalisedNameB = nameB.replace(/^Dr\s+/i, '')
  return normalisedNameA.localeCompare(normalisedNameB)
}
