import { Artist } from '@/schema/artist'
import { css } from '@emotion/react'
import parse, { DOMNode } from 'html-react-parser'
import Image from 'next/future/image'

import Artists from '@/components/Artists'
import { HTMLAttributeReferrerPolicy } from 'react'
import { Artwork } from '@/schema/artwork'
import Artworks from './Artworks'

const style = css`
  line-height: 1.75rem; /* 28px */
  line-height: 1.625;

  p,
  ul,
  ol,
  blockquote {
    margin-top: 0.5rem;
    margin-bottom: 1rem;
  }

  a {
    text-decoration-line: underline;
  }

  ul,
  ol {
    padding-left: 1rem; /* 16px */
  }

  ul {
    list-style-type: disc;
  }

  ol {
    list-style-type: decimal;
  }

  ul > li > ul,
  ol > li > ol {
    margin-top: 0px;
    margin-bottom: 0px;
    margin-left: 1rem; /* 16px */
  }

  ul > li > ul {
    list-style: circle;
  }

  h2 {
    margin-top: 2rem;
    margin-bottom: 0.5rem;
    font-size: 1.875rem; /* 30px */
    line-height: 2.25rem; /* 36px */
    line-height: 1.375;
    font-weight: bold;
  }

  h3 {
    margin-top: 2rem;
    margin-bottom: 0.5rem;
    font-size: 1.5rem; /* 24px */
    line-height: 2rem; /* 32px */
    line-height: 1.375;
    font-weight: bold;
  }

  h4 {
    margin-top: 1.5rem; /* 24px */
    margin-bottom: 0.5rem;
    font-size: 1.25rem; /* 20px */
    line-height: 1.75rem; /* 28px */
    line-height: 1.375;
  }

  pre {
    overflow-x: auto;
    padding: 1rem;
    background-color: #f3f4f6;
    font-size: 0.875rem;
    line-height: 1.25rem;
    line-height: 1.25;
    white-space: pre;
    border-width: 1px;
    border-color: #9ca3af;
  }

  code {
    font-size: 0.875rem;
    line-height: 1.25rem;
  }

  iframe {
    margin: auto;
  }

  img {
    margin: auto;
  }

  figcaption {
    font-size: 0.875rem;
    line-height: 1.25rem;
    text-align: center;
  }

  blockquote {
    padding-top: 1rem;
    padding-bottom: 1rem;
    padding-left: 1.5rem;
    padding-right: 1.5rem;
    margin-left: 0;
    background-color: #e5e7eb;
    font-style: italic;
    border-left-width: 4px;
    border-color: #6b7280;
  }

  blockquote p {
    margin-top: 0;
  }

  blockquote cite {
    font-style: normal;
  }

  audio {
    width: 100%;
  }
`

type Props = {
  children: string
  artists?: Artist[]
  artworks?: Artwork[]
}

export default function RenderHTMLContent({ children, artists, artworks }: Props) {
  const modifyTags = (node: DOMNode) => {
    if (node.type && node.type === 'tag' && 'name' in node) {
      if (node.name === 'img') {
        const attribs = node.attribs
        const imageProps = {
          crossOrigin: attribs.crossOrigin as '' | 'anonymous' | 'use-credentials' | undefined,
          decoding: attribs.decoding as 'async' | 'auto' | 'sync' | undefined,
          /** Sets or retrieves whether the image is a server-side image map. */
          ismap: attribs.ismap,
          referrerPolicy: attribs.referrerPolicy as HTMLAttributeReferrerPolicy | undefined,
          sizes: attribs.sizes,
          /** Sets or retrieves the URL, often with a bookmark extension (#name), to use as a client-side image map. */
          useMap: attribs.usemap,
          src: attribs.src,
          alt: attribs.alt,
          width: attribs.width,
          height: attribs.height,
          fill: attribs.fill === 'true',
          quality: attribs.quality,
          priority: attribs.priority === 'true',
          loading: attribs.loading as 'lazy' | 'eager' | undefined,
          placeholder: attribs.placeholder as 'blur' | 'empty' | undefined,
          blurDataURL: attribs.blurDataURL,
          unoptimized: attribs.unoptimized === 'true',
          className: attribs.class,
        }
        // Alt prop is set at run time so we can't statically lint this to check if an alt prop exists
        // eslint-disable-next-line jsx-a11y/alt-text
        return <Image {...imageProps} />
      }
      // taken from https://robertmarshall.dev/blog/using-wordpress-shortcodes-with-next-js/
      // It seems all shortcodes are P tags.
      // So we check that the node has a type, and that that type
      // is a tag.
      // If this tag has children, and it is the first child.
      // This may cause issues, but I have not had issues with it.
      // The first array is usually a shortcode is the first and
      // only child of a tag node.

      const innerText = node.children[0]?.type === 'text' ? node.children[0].data : ''

      // If we find the shortcode string, replace it with
      // our component.
      if (innerText === '[artists]' && artists) {
        return <Artists artists={artists} />
      }
      if (innerText === '[artworks]' && artworks) {
        return <Artworks artworks={artworks} />
      }
    }

    // If nothing then return original node
    return node
  }

  const contentAsReactNodes = parse(children, {
    replace: modifyTags,
  })

  return <div css={style}>{contentAsReactNodes}</div>
}
