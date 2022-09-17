import { css } from '@emotion/react'
import { ReactNode } from 'react'

const style = css`
  width: 100%;
  padding-left: 1.25rem;
  padding-right: 1.25rem;
  margin: auto;
  max-width: clamp(500px, 90vw, 1536px);
`

type Props = {
  children: ReactNode
  className?: string
}

export default function Container({ children, className = '' }: Props) {
  return (
    <div css={style} className={className}>
      {children}
    </div>
  )
}
