import useIsMobile from '@/hooks/useIsMobile'
import { css } from '@emotion/react'
import cn from 'classnames'
import { useSpring, animated, useReducedMotion, Globals } from '@react-spring/web'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useKey, usePrevious } from 'react-use'
import { useDrag } from 'react-use-gesture'

import ArtGalleryArtwork from '@/components/ArtGalleryArtwork'
import { Artwork } from '@/schema/artwork'

type Props = {
  open: boolean
  onCloseRequest: () => void
  artworks: Artwork[]
  initialArtwork?: Artwork
}

const style = css`
  width: 200px;
  height: 200px;
  position: relative;

  &.hidden {
    display: none;
  }

  &.closing {
    .room {
      .face {
        animation-direction: reverse;
      }
      &.enableReflections {
        .face {
          .wallContents.floor-reflection {
            animation-direction: reverse;
          }

          &::after {
            animation-direction: reverse;
          }
        }
      }
    }
  }

  &.hidden,
  &.closing {
    .close {
      opacity: 0;
    }
  }

  .close {
    position: fixed;
    top: 1rem;
    right: 2rem;
    font-size: 3em;
    z-index: 2;
    transition: opacity 0.3s;
    opacity: 1;
    transform: translateZ(10000px); /* fixes safari bug */
    width: 1em;
    height: 1em;
    background: var(--colour-background);
    border-radius: 1em;
    padding-bottom: 0.13em;
    line-height: 0;
  }

  .room {
    position: fixed;

    .face {
      position: absolute;
      &.-north,
      &.-east,
      &.-south,
      &.-west {
        width: var(--width);
        height: var(--height);
        background: #fbf8f2;

        @media (prefers-color-scheme: dark) {
          background: #383632;
        }

        .wallContents {
          .artwork {
            max-width: calc(100vw - 8px);
            padding: 2em;
            height: 100%;
            margin: auto;

            img {
              -webkit-user-select: none;
              -khtml-user-select: none;
              -moz-user-select: none;
              -o-user-select: none;
              user-select: none;
            }
          }
        }
      }

      &.-top,
      &.-bottom {
        width: var(--depth);
        height: var(--depth);
      }
    }
  }

  .room:not(.full3d) {
    top: 0;
    left: 0;
    height: 100vh;
    width: 100vw;
    height: 100dvh;
    width: 100dvw;
    display: flex;
    .face {
      &.-north,
      &.-east,
      &.-south,
      &.-west {
        flex: 0 0 auto;
        height: 100%;
        width: 100%;
        top: 0;
        left: 0;

        .wallContents {
          height: 100%;
          width: 100%;

          .artwork {
            height: 100%;
            width: 100%;
          }
        }
      }

      &.-top,
      &.-bottom {
        display: none;
      }
    }
  }

  .room.full3d {
    --width: clamp(100vh, 80vw, 130vh);
    --height: 80vh;
    @supports (height: 100dvh) {
      --width: clamp(100dvh, 80dvw, 130dvh);
      --height: 80dvh;
    }
    --depth: var(--width);

    @media (max-aspect-ratio: 11/10) {
      --height: 100vh;
      --width: 100vw;
      @supports (height: 100dvh) {
        --height: 100dvh;
        --width: 100dvw;
      }
      --depth: var(--width);
    }

    top: 50%;
    left: 50%;
    transform-style: preserve-3d;
    z-index: 1;

    .face {
      animation-fill-mode: forwards;
      animation-timing-function: ease-in-out;
      animation-duration: 0.3s;

      @media (prefers-reduced-motion) {
        animation-duration: 0;
      }

      .wallContents/*,
    ::after*/ {
        position: absolute;
        top: 0;
        width: 100%;
        transform: translateX(-50%);
        left: 50%;
      }

      .wallContents {
        height: 100%;
        /* spotlight effect */
        &::after {
          --spotlight-shadow-opacity: 0.13;
          @media (prefers-color-scheme: dark) {
            --spotlight-shadow-opacity: 0.3;
          }
          background-image: radial-gradient(
            ellipse at 50% 50%,
            transparent 75%,
            rgba(0, 0, 0, var(--spotlight-shadow-opacity)) 90%
          );
          display: block;
          content: '';
          position: absolute;
          top: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
        }
      }

      &.-top {
        animation-name: slidein-top;
        --spotlight-color: #ebe9e4;
        --spotlight-shadow-color: rgb(201, 198, 193);
        @media (prefers-color-scheme: dark) {
          --spotlight-color: #232527;
          --spotlight-shadow-color: #181611;
        }
        background: //north
          radial-gradient(circle at 50% 120%, var(--spotlight-color) 20%, transparent 35%),
          // east
          radial-gradient(circle at 120% 50%, var(--spotlight-color) 20%, transparent 35%),
          // south
          radial-gradient(circle at 50% -20%, var(--spotlight-color) 20%, transparent 35%),
          // west
          radial-gradient(circle at -20% 50%, var(--spotlight-color) 20%, transparent 35%),
          var(--spotlight-shadow-color);

        @keyframes slidein-top {
          from {
            transform: translate(-50%, -50%) rotateX(-90deg) translateZ(calc(var(--height) * -1.5));
            filter: opacity(0);
          }

          to {
            transform: translate(-50%, -50%) rotateX(-90deg) translateZ(calc(var(--height) * -0.5 + 1px));
          }
        }
      }

      &.-bottom {
        background: #979797;
        background: radial-gradient(circle at 50% -20%, #aaaaaa 20%, transparent 35%),
          // north
          radial-gradient(circle at 120% 50%, #c5c5c5 20%, transparent 35%),
          // east
          radial-gradient(circle at 50% 120%, #c5c5c5 20%, transparent 35%),
          // south
          radial-gradient(circle at -20% 50%, #c5c5c5 20%, transparent 35%),
          // west
          #979797;
        background: url('/wood-grain.svg'), rgb(200, 156, 103);
        filter: brightness(0.9);
        @media (prefers-color-scheme: dark) {
          filter: brightness(0.3);
        }
        animation-name: slidein-bottom;

        @keyframes slidein-bottom {
          from {
            transform: translate(-50%, -50%) rotateX(90deg) translateZ(calc(var(--height) * -1.5));
            filter: opacity(0);
          }

          to {
            transform: translate(-50%, -50%) rotateX(90deg) translateZ(calc(var(--height) * -0.5));
          }
        }
      }

      &.-north {
        animation-name: slidein-north;

        @keyframes slidein-north {
          from {
            transform: translate(-50%, -50%) translateZ(calc(var(--depth) * -5.5));
            filter: opacity(0);
          }

          to {
            transform: translate(-50%, -50%) translateZ(calc(var(--depth) * -0.5 + 1px));
          }
        }
      }

      &.-east {
        animation-name: slidein-east;

        @keyframes slidein-east {
          from {
            transform: translate(-50%, -50%) rotateY(-90deg) translateZ(calc(var(--width) * -1.5));
            filter: opacity(0);
          }

          to {
            transform: translate(-50%, -50%) rotateY(-90deg) translateZ(calc(var(--width) * -0.5 + 1px));
          }
        }
      }

      &.-south {
        animation-name: slidein-south;

        @keyframes slidein-south {
          from {
            transform: translate(-50%, -50%) rotateY(180deg) translateZ(calc(var(--depth) * -1.5));
            filter: opacity(0);
          }

          to {
            transform: translate(-50%, -50%) rotateY(180deg) translateZ(calc(var(--depth) * -0.5 + 1px));
          }
        }
      }

      &.-west {
        animation-name: slidein-west;

        @keyframes slidein-west {
          from {
            transform: translate(-50%, -50%) rotateY(90deg) translateZ(calc(var(--width) * -1.5));
            filter: opacity(0);
          }

          to {
            transform: translate(-50%, -50%) rotateY(90deg) translateZ(calc(var(--width) * -0.5 + 1px));
          }
        }
      }
    }

    &.enableReflections {
      .face {
        .wallContents {
          &.floor-reflection {
            transform: translateX(-50%) translateY(100%) scaleY(-1);
            animation-fill-mode: forwards;
            animation-timing-function: ease-in-out;
            animation-duration: 0.3s;
            animation-name: slidein-reflection;

            @keyframes slidein-reflection {
              from {
                translate: 0% 200%;
              }

              to {
                translate: 0% 0%;
              }
            }
          }
        }

        /* black background behind wall reflection */
        &.-north::after,
        &.-east::after,
        &.-south::after,
        &.-west::after {
          display: block;
          content: '';
          background: black;
          position: absolute;
          top: 0;
          height: 100%;
          width: 100%;
          transform: translateY(100%);
          z-index: -1;
          animation-fill-mode: forwards;
          animation-timing-function: ease-in-out;
          animation-duration: 0.3s;
          animation-name: slidein-reflection;
        }

        &.-bottom {
          background: #595959cc;
          backdrop-filter: blur(4px);
        }
      }
    }
  }
`

export default function ArtGallery({ open, onCloseRequest, artworks, initialArtwork }: Props) {
  const currentFace = useRef(0)

  const artGalleryElm = useRef<HTMLDivElement>(null)

  const [indexOfArtworkCurrentlyInView, setIndexOfArtworkCurrentlyInView] = useState(0)

  const isMobile = useIsMobile()
  const full3d = !isMobile
  // sadly most hardware isn't powerful enough to use reflections :(
  const enableReflections = false
  const debug = false

  const prefersReducedMotion = useReducedMotion() || false
  // Counteract the fact that modifies global var
  Globals.assign({
    skipAnimation: false,
  })

  const [animationStyle, api] = useSpring(
    () => ({
      from: { displayedArtworkIndex: currentFace.current },
      onChange: ({ value }) => {
        const newIndexOfArtworkCurrentlyInView = Math.round(value.displayedArtworkIndex)
        if (newIndexOfArtworkCurrentlyInView !== indexOfArtworkCurrentlyInView) {
          setIndexOfArtworkCurrentlyInView(newIndexOfArtworkCurrentlyInView)
        }
      },
    }),
    [indexOfArtworkCurrentlyInView]
  )

  const playEntryAnimation = useCallback(
    async function ({ reversed }: { reversed: boolean }): Promise<void> {
      if (prefersReducedMotion || !full3d) {
        return
      }

      if (reversed) {
        artGalleryElm.current?.classList.add('closing')
      } else {
        artGalleryElm.current?.classList.remove('closing')
      }
      const faceElms: HTMLElement[] = Array.from(document.querySelectorAll('.room .face'))
      const animationPromises: Promise<void>[] = []
      for (const faceElm of faceElms) {
        const animationName = faceElm.style.animationName
        faceElm.style.animationName = 'none'
        void faceElm.offsetWidth
        faceElm.style.animationName = animationName
        animationPromises.push(
          new Promise((resolve) =>
            faceElm.addEventListener(
              'animationend',
              () => {
                resolve()
              },
              { once: true }
            )
          )
        )
      }
      return Promise.all(animationPromises).then(() => {
        /* throw away result */
      })
    },
    [full3d, prefersReducedMotion]
  )

  const goToArtwork = useCallback(
    function (artwork: Artwork, springOptions = {}) {
      const artworkIndex = artworks.indexOf(artwork)
      api.start({
        displayedArtworkIndex: artworkIndex,
        ...springOptions,
      })
    },
    [artworks, api]
  )

  function wrap(number: number, exclusiveUpperBounds: number): number
  function wrap(number: number, inclusiveLowerBounds: number, exclusiveUpperBounds: number): number
  function wrap(number: number, upperOrLowerBounds: number, exclusiveUpperBounds: number | undefined = undefined) {
    const inclusiveLowerBounds = typeof exclusiveUpperBounds === 'number' ? upperOrLowerBounds : 0
    exclusiveUpperBounds = typeof exclusiveUpperBounds === 'number' ? exclusiveUpperBounds : upperOrLowerBounds

    function wrapOnlyUpperBounds(number: number, exclusiveUpperBounds: number) {
      return ((number % exclusiveUpperBounds) + exclusiveUpperBounds) % exclusiveUpperBounds
    }

    return (
      wrapOnlyUpperBounds(number - inclusiveLowerBounds, exclusiveUpperBounds - inclusiveLowerBounds) +
      inclusiveLowerBounds
    )
  }

  const [isHidden, setIsHidden] = useState(!open)
  useEffect(() => {
    artGalleryElm.current?.classList.remove('closing')
  }, [isHidden])
  const previousOpen = usePrevious(open)
  useEffect(() => {
    if (typeof previousOpen === 'undefined' || open === previousOpen) {
      return
    }

    if (open) {
      // opening
      artGalleryElm.current?.classList.remove('closing')
      if (initialArtwork) {
        goToArtwork(initialArtwork, { immediate: true })
      }
      setIsHidden(false)
      playEntryAnimation({ reversed: false }).then(() => {
        if (debug) {
          console.log('open animation ended')
        }
      })
    } else if (!open) {
      // closing
      playEntryAnimation({ reversed: true }).then(() => {
        if (debug) {
          console.log('close animation ended')
        }
        setIsHidden(true)
      })
    }
  }, [open, goToArtwork, initialArtwork, playEntryAnimation, previousOpen, debug])

  useKey(
    'ArrowLeft',
    () =>
      api.start({
        displayedArtworkIndex: animationStyle.displayedArtworkIndex.goal - 1,
        immediate: !!prefersReducedMotion || !full3d,
      }),
    {},
    [prefersReducedMotion]
  )
  useKey(
    'ArrowRight',
    () =>
      api.start({
        displayedArtworkIndex: animationStyle.displayedArtworkIndex.goal + 1,
        immediate: !!prefersReducedMotion || !full3d,
      }),
    {},
    [prefersReducedMotion]
  )
  useKey('Escape', onCloseRequest)
  const getTransformValue = (faceNumber: number, full3d: boolean) =>
    full3d
      ? `perspective(calc(var(--depth) * 1 - 2vw)) translateZ(calc(var(--depth) * 0.5)) rotateY(calc(${faceNumber} * 90deg))`
      : `translateX(calc(${faceNumber} * -100%))`

  const displayedArtworkIndexAtStartOfDrag = useRef<number>()

  const dragBindProps = useDrag(
    ({ active, swipe: [swipeX], movement: [mx], direction: [xDir, yDir], distance, args: [artworkIndex] }) => {
      const wallWidth = artGalleryElm.current?.querySelector('.face.wall')?.clientWidth

      if (typeof wallWidth === 'undefined') {
        return
      }

      if (typeof displayedArtworkIndexAtStartOfDrag.current === 'undefined') {
        displayedArtworkIndexAtStartOfDrag.current = animationStyle.displayedArtworkIndex.get()
      }

      const dragPosition = displayedArtworkIndexAtStartOfDrag.current - mx / wallWidth
      if (active) {
        if (Math.abs(yDir) > Math.abs(xDir)) {
          return
        }
        api.start({
          displayedArtworkIndex: dragPosition,
          immediate: true,
        })
      } else {
        displayedArtworkIndexAtStartOfDrag.current = undefined
        const isClick = distance < 4
        let newDisplayedArtworkIndex = Math.round(dragPosition)
        if (swipeX === -1) {
          newDisplayedArtworkIndex = Math.ceil(dragPosition)
        } else if (swipeX === 1) {
          newDisplayedArtworkIndex = Math.floor(dragPosition)
        } else if (isClick) {
          newDisplayedArtworkIndex = artworkIndex
        }
        api.start({
          displayedArtworkIndex: newDisplayedArtworkIndex,
          immediate: isClick ? prefersReducedMotion : false,
        })
      }
    }
  )

  return (
    <div css={style} className={cn({ hidden: isHidden })} ref={artGalleryElm}>
      {full3d && (
        <style global jsx>{`
          body {
            transition: overflow 0s 5s;
            animation-fill-mode: forwards;
            animation-duration: 0s;
            animation-delay: 0.28s;
            ${open ? '' : 'animation-direction: reverse; animation-delay: 0.1s;'}
            ${isHidden ? '' : 'animation-name: delay-overflow;'}
          }
          @keyframes delay-overflow {
            from {
              overflow: auto;
            }
            to {
              overflow: hidden;
            }
          }
        `}</style>
      )}

      {!full3d && (
        <style global jsx>{`
          body {
            ${isHidden ? '' : 'overflow: hidden;'}
          }
        `}</style>
      )}
      <button onClick={onCloseRequest} className="close">
        ×
      </button>
      <animated.div
        className={cn('room', { full3d, enableReflections })}
        style={{
          transform: animationStyle.displayedArtworkIndex.to((displayedArtworkIndex) =>
            getTransformValue(displayedArtworkIndex, full3d)
          ),
        }}
      >
        <div className="face -top"></div>
        <div className="face -bottom"></div>
        {['north', 'east', 'south', 'west'].map((faceName, index) => {
          // Sliding 4-element wide window that slides across the artwork array and contains 1 artwork before the one currently in view
          // and 2 artworks after the currently in view one
          const inclusiveLowerBounds = indexOfArtworkCurrentlyInView - 1
          const exclusiveUpperBounds = indexOfArtworkCurrentlyInView + 3
          const unwrappedArtworkIndex = wrap(index, inclusiveLowerBounds, exclusiveUpperBounds)
          const artworkIndex = wrap(unwrappedArtworkIndex, artworks.length)
          return (
            <div
              className={cn('face', 'wall', `-${faceName}`)}
              key={faceName}
              style={full3d ? {} : { translate: `calc(100% * ${unwrappedArtworkIndex})` }}
            >
              {debug && (
                <div style={{ position: 'absolute', opacity: 0.2 }}>
                  {faceName} # {artworkIndex}
                </div>
              )}
              {artworks[artworkIndex] && (
                <>
                  <div className="wallContents" {...dragBindProps(unwrappedArtworkIndex)}>
                    <ArtGalleryArtwork artwork={artworks[artworkIndex]} className="artwork" />
                  </div>
                  {enableReflections && (
                    <div className="wallContents floor-reflection">
                      <ArtGalleryArtwork artwork={artworks[artworkIndex]} className="artwork" />
                    </div>
                  )}
                </>
              )}
            </div>
          )
        })}
      </animated.div>
    </div>
  )
}
