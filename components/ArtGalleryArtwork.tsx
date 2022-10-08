import { css } from '@emotion/react'
import Image from 'next/future/image'
import { useState, useRef, useEffect, Fragment } from 'react'
import cn from 'classnames'

import { Artwork } from '@/schema/artwork'
import RenderHTMLContent from '@/components/RenderHTMLContent'

type Props = {
  artwork: Artwork
  className: string
  isVisible: boolean
}

const style = css`
  container-type: inline-size;
  display: flex;
  gap: 2em;
  justify-content: center;
  justify-content: safe center;
  align-items: flex-start;
  overflow: auto;

  .imageContainer,
  .labelContainer {
    min-height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .imageContainer {
    flex: 9 3 0px;
    min-width: min(20em, 100%);
    height: max-content;

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

  .labelContainer {
    flex: 1 1 20em;
    max-width: max-content;
    height: 100%;

    .label {
      /* min-width: min(20em, calc(100vw - 5rem)); */
      overflow: auto;
      max-height: 100%;
      display: flex;
      flex-direction: column;
      gap: 1em;
      max-width: max-content;
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

        &.overflowed {
          .contents {
            max-height: 400px;
            overflow: hidden;
            position: relative;
            &::after {
              display: block;
              content: '';
              position: absolute;
              bottom: 0;
              width: 100%;
              height: 70px;
              background: linear-gradient(transparent, var(--colour-background));

              @media (prefers-color-scheme: dark) {
                background: linear-gradient(transparent, #474c4e);
              }
            }
          }
          .showMoreStatement {
            font-weight: bold;
          }
        }

        p {
          margin: 0.9rem 0;
        }
      }
    }
  }

  @media (max-width: 1200px) {
    flex-direction: column;
    align-items: center;
    justify-content: unset;

    .imageContainer,
    .labelContainer {
      min-height: unset;
    }

    .imageContainer {
      max-height: 80%;
      flex: 0 1 auto;
    }

    .labelContainer {
      height: unset;

      .label {
        overflow: unset;
        max-height: unset;
      }
    }
  }
`

export default function ArtGalleryArtwork({ artwork, className, isVisible }: Props) {
  const startingPrice = 'TBA'
  const statementOverflowHeight = 450
  const [statementOverflowHidden, setStatementOverflowHidden] = useState(false)
  const rootElm = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const statementElm = rootElm.current?.querySelector('.statement')
    if (statementElm) {
      if (statementElm.scrollHeight > statementOverflowHeight) {
        statementOverflowHidden || setStatementOverflowHidden(true)
      }
    }
  }, [isVisible, artwork]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div css={style} className={className} ref={rootElm}>
      <div
        className="imageContainer"
        style={{
          aspectRatio: `auto ${artwork.image.width} / ${artwork.image.height}`,
          maxWidth: `min(${artwork.image.width}px, 100%, 100vh * calc(${artwork.image.width} / ${artwork.image.height}))`,
          maxHeight: `min(${artwork.image.height}px, calc(100% - 2.5em))`,
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
      <div className="labelContainer">
        <div className="label">
          <div className="title">{artwork.title}</div>
          <div className="artists">
            {artwork.artists.map((artist, index) => (
              <Fragment key={artist.id}>
                <a href={`/artists#${artist.slug}`}>{artist.title}</a>
                {index < artwork.artists.length - 1 && <span className="joiner">&amp;</span>}
              </Fragment>
            ))}
          </div>
          {artwork.statement !== null && (
            <div className={cn('statement', { overflowed: statementOverflowHidden })}>
              <div className="contents">
                <RenderHTMLContent>{artwork.statement}</RenderHTMLContent>
              </div>
              {statementOverflowHidden && (
                <button className="showMoreStatement" onClick={() => setStatementOverflowHidden(false)}>
                  Show more...
                </button>
              )}
            </div>
          )}
          <div className="startingPrice">Starting price: {startingPrice}</div>
        </div>
      </div>
    </div>
  )
}
