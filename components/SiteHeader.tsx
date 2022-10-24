import Link from 'next/link'
import { css } from '@emotion/react'

import useActiveLinkCheck from '@/hooks/useActiveLinkCheck'
import { SiteInfo } from '@/schema/siteInfo'
import { MenuItem } from '@/schema/menuItem'
import RenderHTMLContent from './RenderHTMLContent'

const style = css`
  a {
    text-decoration: none;
  }

  .titleAndDetails {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1.5em;
    margin: 3rem 0 2rem;

    .title {
      flex: 2 1 auto;
      h1 {
        font-size: clamp(2.5em, 4.5vw, 5em);
        line-height: 90%;
        font-weight: bold;
      }

      .subtitle {
        font-size: clamp(1.5em, 2.06vw, 2.3em);
      }
    }
    .details {
      flex: 1 1 auto;
      font-size: clamp(1.1em, 2vw, 1.5em);
      max-width: 420px;
      text-align: right;

      p {
        margin: 0;
      }
    }
    @media (max-width: 500px) {
      flex-direction: column;
      text-align: center;
      gap: 1em;

      .details {
        text-align: center;
      }
    }
  }
  nav {
    display: flex;
    column-gap: 1em;
    row-gap: 0.3em;
    margin: 1.5em 0;
    font-weight: bold;
    font-size: 1.2em;
    flex-wrap: wrap;
    text-align: center;

    @media (max-width: 500px) {
      justify-content: center;
    }

    .active {
      text-decoration: underline;
    }
  }
`

type Props = {
  siteInfo: SiteInfo
  siteMenu: MenuItem[]
}

export default function SiteHeader({ siteInfo, siteMenu }: Props) {
  const isActiveLink = useActiveLinkCheck()
  return (
    <header css={style}>
      <div className="titleAndDetails">
        <div className="title">
          <h1>{siteInfo.title}</h1>
          <div className="subtitle">{siteInfo.description}</div>
        </div>
        <div className="details">
          <RenderHTMLContent siteInfo={siteInfo}>{siteInfo.headerInfoText || ''}</RenderHTMLContent>
        </div>
      </div>
      <nav>
        {siteMenu.map((menuItem) => (
          <Link key={menuItem.id} href={menuItem.path}>
            <a className={isActiveLink(menuItem.path) ? 'active' : ''}>{menuItem.label}</a>
          </Link>
        ))}
      </nav>
    </header>
  )
}
