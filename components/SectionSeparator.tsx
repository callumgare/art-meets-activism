import { css } from '@emotion/react'

const style = css`
  border: solid 1px var(--colour-background-accent);
  margin-bottom: 1rem;
  margin-top: 1rem;
`

export default function SectionSeparator() {
  return <hr css={style} />
}
