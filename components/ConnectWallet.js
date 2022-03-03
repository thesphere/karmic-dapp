import { formatUnits, parseUnits } from 'ethers/lib/utils'
import { useContext } from 'react'
import { Web3Context } from '../context/Web3Context'
import { ellipseAddress, getChainData } from '../lib/utilities'
import Button from './Button'

const roundOffBN = (number, decimal = 18) => {
  return formatUnits(number.div(parseUnits('0.01', decimal)), 2)
}

const ConnectWallet = ({ ethBalance, karmicBalance }) => {
  const { state, connect, disconnect } = useContext(Web3Context)
  const { web3Provider, address, chainId } = state

  const chainData = getChainData(chainId)

  return (
    <>
      {web3Provider ? (
        address && (
          <div className="wallet-container rounded-purple-container bg-transparent">
            <span>
              {karmicBalance ? roundOffBN(karmicBalance, 15) : '-'} Karmic
            </span>
            <span style={{ marginLeft: '10px', marginRight: '10px' }}>|</span>
            <span>{ethBalance ? roundOffBN(ethBalance) : '-'} ETH</span>
            <span style={{ marginLeft: '10px', marginRight: '10px' }}>|</span>
            <span>{ellipseAddress(address)}</span>
          </div>
        )
      ) : (
        <Button action={connect} text={'Connect Wallet'} />
      )}
    </>
  )
}

export default ConnectWallet
