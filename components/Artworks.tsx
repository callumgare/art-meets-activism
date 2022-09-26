import { css } from '@emotion/react'

import Artwork from '@/components/Artwork'
import ArtGallery from '@/components/ArtGallery'
import { useState } from 'react'
import type { Artwork as ArtworkType } from '@/schema/artwork'
import { useMount } from 'react-use'

type Props = {
  artworks: ArtworkType[]
}

const style = css`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  grid-template-columns: repeat(auto-fill, minmax(min(250px, calc(100vw - 4rem)), 1fr));
  gap: 2em;
  align-items: center;
  justify-items: center;

  .openInGallery {
    transition: transform 0.15s ease-in-out;
    &:hover {
      transform: scale(1.05);
    }
  }
`

export default function Artworks({ artworks }: Props) {
  const [artGalleryIsOpen, setArtGalleryIsOpen] = useState(false)
  const [galleryInitialArtwork, setGalleryInitialArtwork] = useState<ArtworkType>()

  useMount(() => {
    if (typeof location !== 'undefined' && location.hash) {
      const artwork = artworks.find((artwork) => artwork.slug === location.hash.replace('#', ''))
      if (artwork) {
        openGallery(artwork)
      }
    }
  })

  function openGallery(initialArtwork: ArtworkType) {
    setGalleryInitialArtwork(initialArtwork)
    setArtGalleryIsOpen(true)
  }

  return (
    <>
      <ArtGallery
        open={artGalleryIsOpen}
        onCloseRequest={() => setArtGalleryIsOpen(false)}
        artworks={artworks}
        initialArtwork={galleryInitialArtwork}
      />
      {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
      {/* 
      // @ts-ignore inert not yet supported https://github.com/DefinitelyTyped/DefinitelyTyped/pull/60822 */}
      <ul css={style} inert={artGalleryIsOpen ? '' : null}>
        {artworks.map((artwork) => (
          <li key={artwork.id}>
            <button className="openInGallery" onClick={() => openGallery(artwork)}>
              <Artwork artwork={artwork} />
            </button>
          </li>
        ))}
      </ul>
    </>
  )
}
