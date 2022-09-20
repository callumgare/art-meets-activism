import { css } from '@emotion/react'
import Image from 'next/future/image'
import Link from 'next/link'

import type { Artist } from '@/schema/artist'
import React from 'react'
import SectionSeparator from '@/components/SectionSeparator'

type Props = {
  artists: Artist[]
}

const style = css`
  display: flex;
  flex-direction: column;
  padding: 0;

  li {
    position: relative;
    list-style-type: none;
    margin: 1.4em 0 2em;

    &:has(.anchor:target) {
      background-color: var(--colour-background-accent);
    }

    .anchor {
      position: absolute;
      top: -2em;
    }

    .image {
      margin: 1em 0;
      max-height: 30em;
      max-width: 100%;
      width: auto;
      height: auto;

      &.noImage {
        height: 400px;
        background-color: #cdcdcd;
        width: auto;
        aspect-ratio: auto 300 / 400;
      }
    }

    .info {
      .name {
        font-weight: bold;
        font-size: 1.5em;
      }

      .bio {
        p {
          margin: 0.8rem 0;
        }
      }
    }

    @media (min-width: 800px) {
      .image {
        float: left;
        margin: 0.7em 2em 2em 0;
        max-width: 50%;
      }

      &:nth-of-type(even) {
        .image {
          float: right;
          margin: 1em 0 2em 2em;
        }
      }
    }
  }
`

export default function Artists({ artists }: Props) {
  return (
    <ul css={style}>
      {artists.map((artist, index) => (
        <React.Fragment key={artist.id}>
          <li>
            <div className="anchor" id={artist.slug} />
            {artist.image ? (
              <Image
                className="image"
                src={artist.image.fileUrl}
                width={artist.image.width}
                height={artist.image.height || 1}
                alt={artist.image.altText}
              />
            ) : (
              <div className="image noImage" />
            )}
            <div className="info">
              <div className="name">{artist.title}</div>
              <div className="bio" dangerouslySetInnerHTML={{ __html: artist.biography }} />
              {!!artist.artworks.length && (
                <div className="artworks">
                  Artwork{artist.artworks.length > 1 && 's'}:{' '}
                  {artist.artworks.map((artwork, index) => (
                    <React.Fragment key={artwork.id}>
                      <Link key={artwork.id} href={`/#${artwork.slug}`}>
                        <a>{artwork.title}</a>
                      </Link>

                      {index < artist.artworks.length - 1 && <span className="joiner">&amp;</span>}
                    </React.Fragment>
                  ))}
                </div>
              )}
            </div>
          </li>
          {index < artists.length - 1 && <SectionSeparator />}
        </React.Fragment>
      ))}
    </ul>
  )
}
