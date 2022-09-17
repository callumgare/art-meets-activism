import { Artwork } from '@/schema/artwork'
import { css } from '@emotion/react'
import Image from 'next/future/image'
import * as React from 'react'
import RenderHTMLContent from '@/components/RenderHTMLContent'

type Props = {
  artwork: Artwork
  className: string
}

const style = css`
  container-type: inline-size;
  display: flex;
  flex-wrap: wrap;
  gap: 2em;
  justify-content: center;
  align-items: center;
  overflow: auto;

  .imageContainer {
    /* flex: 9 0 auto;
  width: 50%;
  max-height: 100%;
  min-width: min(500px, 100%);
  display: flex;
  align-items: center;
  justify-content: center; */
    flex: 3 3 0px;
    min-width: 20em;
    height: fit-content;
    min-height: 20%;

    img {
      /* object-fit: contain; */
      max-height: 100%;
      max-width: 100%;
      height: auto;
      width: auto;
      /* filter: drop-shadow(-3px 3px 4px #00000045) drop-shadow(3px 3px 4px #00000045); */
      box-shadow: -3px 3px 4px #00000045, 3px 3px 4px #00000045;
    }
  }

  .label {
    flex: 1 1 0;
    min-width: min(20em, calc(100vw - 5rem));
    display: flex;
    flex-direction: column;
    gap: 1em;
    max-width: fit-content;
    background-color: var(--colour-background);
    padding: 1em;
    box-shadow: 0px 1px 10px #0000001a;

    @media (prefers-color-scheme: dark) {
      background: #474c4e;
    }

    .title {
      font-weight: bold;
      font-size: 1.2em;
    }
    .statement {
      font-style: italic;

      p {
        margin: 0.9rem 0;
      }
    }
  }

  // @container (min-width: 700px){
  //   img {
  //     max-height: 80%;
  //     width: auto;
  //   }
  // }
`

export default function ArtGalleryArtwork({ artwork, className }: Props) {
  const startingPrice = artwork.startingPrice === 0 ? 'None' : `$${artwork.startingPrice}`
  return (
    <div css={style} className={className}>
      <div
        className="imageContainer"
        style={{
          aspectRatio: `auto ${artwork.image.width} / ${artwork.image.height}`,
          maxWidth: `min(${artwork.image.width}px, 95%, 100vh * calc(${artwork.image.width} / ${artwork.image.height}))`,
          maxHeight: `min(${artwork.image.height}px, 95%)`,
          minWidth: `min(500px, ${artwork.image.width}px, 100%)`,
        }}
      >
        <Image
          src={artwork.image.fileUrl}
          width={artwork.image.width}
          height={artwork.image.height}
          alt={artwork.image.altText}
          draggable="false"
          priority={true}
        />
      </div>
      {/* <div className="labelContainer"> */}
      <div className="label">
        {/* <pre>{JSON.stringify(artwork, null, 2)}</pre> */}
        {artwork.title !== 'Untitled' && <div className="title">{artwork.title}</div>}
        <div className="artists">
          {artwork.artists.map((artist, index) => (
            <React.Fragment key={artist.id}>
              <a href={`/artists#${artist.slug}`}>{artist.title}</a>
              {index < artwork.artists.length - 1 && <span className="joiner">&amp;</span>}
            </React.Fragment>
          ))}
        </div>
        {artwork.statement !== null && (
          <div className="statement">
            <RenderHTMLContent>{artwork.statement}</RenderHTMLContent>
          </div>
        )}
        <div className="startingPrice">Starting price: {startingPrice}</div>
      </div>
      {/* </div> */}
    </div>
  )
}
