import { formatUnits } from 'ethers/lib/utils'
import { useContext } from 'react'
import { Web3Context } from '../context/Web3Context'
import { ellipseAddress, getChainData } from '../lib/utilities'
import Button from './Button'


const ConnectWallet = ({ethBalance, karmicBalance}) => {
  const { state, connect, disconnect } = useContext(Web3Context)
  const { web3Provider, address, chainId } = state

  const chainData = getChainData(chainId)

  return (
      <>
      {web3Provider ? (
        address && (
            <div className="wallet-container rounded-purple-container bg-transparent">
                <span>{karmicBalance?formatUnits(karmicBalance, 18):"-"} Karmic</span>
                <span style={{marginLeft: "10px", marginRight: "10px"}}>|</span>
                <span>{ethBalance?formatUnits(ethBalance, 18):"-"} ETH</span>
                <span style={{marginLeft: "10px", marginRight: "10px"}}>|</span>
              <span>{ellipseAddress(address)}</span>
            </div>
          )
      ) : (
        <Button action={connect} text={"Connect"}/>
      )}
      </>
  )
}

export default ConnectWallet;