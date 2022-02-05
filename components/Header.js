import { useContext } from 'react'
import { Web3Context } from '../context/Web3Context'
import { ellipseAddress, getChainData } from '../lib/utilities'

const Header = () => {
  const { state, connect, disconnect } = useContext(Web3Context)
  const { web3Provider, address, chainId } = state

  const chainData = getChainData(chainId)

  return (
    <>
      <header>
        {address && (
          <div className="wallet-container">
            <span>{ellipseAddress(address)}</span>
            <span>{chainData.name}</span>
          </div>
        )}
        {web3Provider ? (
          <button className="button" type="button" onClick={disconnect}>
            Disconnect
          </button>
        ) : (
          <button className="button" type="button" onClick={connect}>
            Connect
          </button>
        )}
      </header>

      <style jsx>{`
        header {
          display: flex;
          align-items: center;
          justify-content: flex-end;
        }

        .header-container {
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
