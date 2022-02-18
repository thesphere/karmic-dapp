import { useContext } from 'react'
import { Web3Context } from '../context/Web3Context'
import { ellipseAddress, getChainData } from '../lib/utilities'
import DappNav from './DappNav'

const Header = () => {
  const { state } = useContext(Web3Context)
  const { address, chainId } = state

  const chainData = getChainData(chainId)

  return (
    <>
    <DappNav/>

      <style jsx>{`
        header {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          height: 50px;
        }

        .wallet-container {
          width: 300px;
          display: flex;
          align-items: center;
          justify-content: space-evenly;
        }
      `}</style>
    </>
  )
}

export default Header
