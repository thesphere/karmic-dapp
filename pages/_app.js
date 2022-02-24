import Web3ContextProvider from '../context/Web3Context'
import 'bootstrap/dist/css/bootstrap.min.css'
import '../components/assets/css/CTACard.css'
import '../components/assets/css/DappNav.css'
import '../components/assets/css/KarmicModal.css'
import '../components/assets/css/Global.css'
import '../components/assets/css/BoxCard.css'
import '../components/assets/css/SupportForm.css'
import '../components/assets/css/DonateForm.css'

function MyApp({ Component, pageProps }) {
  return (
    <Web3ContextProvider>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Mono:wght@700&display=swap"
          rel="stylesheet"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@700&display=swap"
          rel="stylesheet"
        />
      </head>
      <Component {...pageProps} />
    </Web3ContextProvider>
  )
}

export default MyApp
