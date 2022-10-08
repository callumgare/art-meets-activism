import Image from 'next/future/image'
import * as React from 'react'
import { css } from '@emotion/react'
import { Artwork as ArtworkType } from '@/schema/artwork'

type Props = {
  artwork: ArtworkType
}

const style = css`
  position: relative;

  img {
    max-height: 400px;
    object-fit: cover;
  }

  .info {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 100%;
    padding: 1em;
    box-sizing: border-box;
    font-size: 1.5em;
    transform: translate(-50%, -50%);
    opacity: 0;
    transition: opacity 0.15s ease-in-out;
    color: #e5e7eb;
    text-shadow: 1px 1px 3px black, -1px -1px 3px black;

    .title,
    .artist {
      font-weight: bold;
    }
    .joiner {
      font-style: italic;
      display: block;
      font-size: 0.8em;
    }
  }
  &:hover {
    img {
      filter: brightness(0.8) blur(1px);
    }
    .info {
      opacity: 1;
    }
  }
`

export default function Artwork({ artwork }: Props) {
  return (
    <div css={style}>
      <Image
        src={artwork.image.fileUrl}
        width={artwork.image.width}
        height={artwork.image.height}
        alt={artwork.image.altText}
      />
      <div className="info">
        <span className="title">{artwork.title}</span>
        <span className="joiner"> by </span>
        {artwork.artists.map((artist, index) => (
          <React.Fragment key={artist.id}>
            <span className="artist">{artist.title}</span>
            {index < artwork.artists.length - 1 && <span className="joiner">&amp;</span>}
          </React.Fragment>
        ))}
      </div>
    </div>
  )
}
