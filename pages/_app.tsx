import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { StoreProvider } from 'easy-peasy'
import store from '../utils/store'
import Router from 'next/router'
import {useState} from 'react'
import Loader from '../components/Loader'



function MyApp({ Component, pageProps }: AppProps) {
  const [loading, setLoading] = useState(false)
  Router.events.on('routeChangeStart', (url) => {
    setLoading(true)
  })
  Router.events.on('routeChangeComplete', (url) => {
    setLoading(false)
  })
 
  const StoreProviderOverride = StoreProvider as any;
  return(
    <>
    {loading && <Loader />}
    <StoreProviderOverride store={store}>
      <Component {...pageProps} />
    </StoreProviderOverride>
    </>
    )
}

export default MyApp