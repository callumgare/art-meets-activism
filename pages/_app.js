import { Global, css } from '@emotion/react'
import '@/styles/index.css'

const globalStyle = css`
  :root {
    --colour-light: #f9f7f5;
    --colour-light-accent: #e8e8e8;
    --colour-dark: #181a1b;
    --colour-dark-accent: #2d2f30;
    --colour-background: var(--colour-light);
    --colour-background-accent: var(--colour-light-accent);
    --colour-text: var(--colour-dark);

    @media (prefers-color-scheme: dark) {
      :root {
        --colour-background: var(--colour-dark);
        --colour-background-accent: var(--colour-dark-accent);
        --colour-text: var(--colour-light);
      }
    }
  }
  body {
    color: var(--colour-text);
    background-color: var(--colour-background);
  }

  a {
    text-decoration: underline;
    text-decoration-color: var(--colour-text);
  }
`

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Global styles={globalStyle} />
      <Component {...pageProps} />
    </>
  )
}

export default MyApp
