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
          RAC and BASP respectfully acknowledges the Traditional Owners of the land, the Wurundjeri Woi Wurrung and
          Bunurong Boon Wurrung peoples of the Eastern Kulin and pays respect to their Elders past, present and
          emerging.
        </div>
      </Container>
    </footer>
  )
}
