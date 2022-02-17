import Web3ContextProvider from '../context/Web3Context'
import 'bootstrap/dist/css/bootstrap.min.css';
import '../components/assets/css/DappNav.css';

function MyApp({ Component, pageProps }) {
  return (
    <Web3ContextProvider>
      <Component {...pageProps} />
    </Web3ContextProvider>
  )
}

export default MyApp
