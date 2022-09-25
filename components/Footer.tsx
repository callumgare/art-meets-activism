import Container from '@/components/Container'
import { css } from '@emotion/react'

const style = css`
  background: var(--colour-background-accent);
  margin-top: 4em;

  .container {
    display: flex;
    padding: 3em 1.25rem;
    width: 100%;
  }

  .acknowledgement {
    max-width: 70%;

    @media (max-width: 1000px) {
      max-width: unset;
    }
  }
`

export default function Footer() {
  return (
    <footer css={style}>
      <Container className="container">
        <div className="acknowledgement">
          RAC-Vic and BASP respectfully acknowledge the Traditional Custodians of the land of the Wurundjeri Woi-wurrung
          and Bunurong Peoples of the Kulin Nation and we recognise their enduring connection to land, waters and
          culture. We pay our respect to Elders past and present.
        </div>
      </Container>
    </footer>
  )
}
