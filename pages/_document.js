import Document, {
  Html,
  Head,
  Main,
  NextScript,
  DocumentContext,
} from 'next/document'

export default class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const originalRenderPage = ctx.renderPage

    try {
      ctx.renderPage = () =>
        originalRenderPage({
          enhanceApp: (App) => (props) => <App {...props} />,
        })

      const initialProps = await Document.getInitialProps(ctx)
      return {
        ...initialProps,
        styles: [initialProps.styles],
      }
    } finally {
    }
  }

  render() {
    return (
      <Html lang='en-us'>
        <Head>
          <meta httpEquiv='Content-Type' content='text/html; charset=UTF-8' />
          <link
            href='https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,400;0,500;0,700;1,400;1,500;1,700&display=swap'
            rel='stylesheet'
          />
          <meta
            name='google-site-verification'
            content='n5KZqEu_bixbDbMe-qbvNh-aE-dcO86q7wTW3WhrAEQ'
          />
        </Head>
        <body>
          <Main />
          <NextScript />
          <div id='modal'></div>
        </body>
      </Html>
    )
  }
}
