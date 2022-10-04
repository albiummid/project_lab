import { SessionProvider } from 'next-auth/react'
import { Provider } from 'react-redux'
import { store } from '../app/store'
import Layout from '../components/layout/Layout'
import '../styles/globals.css'
import '../styles/loading.css'
import 'react-toastify/dist/ReactToastify.css'
import 'antd/dist/antd.css'

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <>
      <SessionProvider session={session}>
        <Provider store={store}>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </Provider>
      </SessionProvider>
    </>
  )
}

export default MyApp
