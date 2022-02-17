import { useContext } from 'react'
import { Web3Context } from '../context/Web3Context'
import { ellipseAddress, getChainData } from '../lib/utilities'


const ConnectWallet = () => {
  const { state, connect, disconnect } = useContext(Web3Context)
  const { web3Provider, address, chainId } = state

  const chainData = getChainData(chainId)

  return (
      <>
      {web3Provider ? (
        address && (
            <div className="wallet-container">
                <span>500 Karmic</span>
                {'  '}|{'  '}
                <span>1 ETH</span>
                {'  '}|{'  '}
              <span>{ellipseAddress(address)}</span>
            </div>
          )
      ) : (
        <button className="button" type="button" onClick={connect}>
          Connect
        </button>
      )}
      </>
  )
}

export default ConnectWallet;