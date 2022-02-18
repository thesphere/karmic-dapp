import { Navbar } from 'react-bootstrap'
import ConnectWallet from './ConnectWallet'

const DappNav = () => {
  return (
    <Navbar className="bg-transparent" bg="dark" variant="dark">
      <Navbar.Brand className="justify-content-start" href="#home">
        <img
          alt=""
          src="./SphereLogo.png"
          width="175"
          height="74"
          className="d-inline-block align-top"
        />
      </Navbar.Brand>
      <Navbar.Collapse className="justify-content-end">
        <ConnectWallet />
      </Navbar.Collapse>
    </Navbar>
  )
}

export default DappNav
