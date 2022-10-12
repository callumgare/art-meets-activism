import Container from '@/components/Container'
import { SiteInfo } from '@/schema/siteInfo'
import { css } from '@emotion/react'
import RenderHTMLContent from './RenderHTMLContent'

const style = css`
  background: var(--colour-background-accent);
  margin-top: 4em;

  .container {
    display: flex;
    padding: 1.5em 1.25rem;
    width: 100%;
  }

  .acknowledgement {
    max-width: 70%;

    @media (max-width: 1000px) {
      max-width: unset;
    }
  }
`

type Props = {
  siteInfo: SiteInfo
}

export default function Footer({ siteInfo }: Props) {
  return (
    <footer css={style}>
      <Container className="container">
        <div className="acknowledgement">
          <RenderHTMLContent>{siteInfo.footerText || ''}</RenderHTMLContent>
        </div>
      </Container>
    </footer>
  )
}
