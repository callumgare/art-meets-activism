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
  gap: 2em;

  li {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    position: relative;

    @media (min-width: 1024px) {
      gap: 2em;
      flex-direction: row;

      &:nth-of-type(even) {
        flex-direction: row-reverse;
      }
    }

    &:has(.anchor:target) {
      background-color: var(--colour-background-accent);
    }

    .anchor {
      position: absolute;
      top: -2em;
    }

    .image {
      margin: 0.8rem 0;
      max-height: 400px;
      width: auto;
      max-width: 100%;

      @media (min-width: 1024px) {
        max-width: 70%;
      }

      &.noImage {
        height: 400px;
        background-color: #cdcdcd;
        width: auto;
        aspect-ratio: auto 300 / 400;
      }
    }

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
            <div>
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
