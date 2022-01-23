import { ethers } from 'ethers'
import { useEffect, useState, useContext } from 'react'
import { Web3Context } from '../context/Web3Context'
import karmicContract from '../contracts/Karmic.json'
import erc20 from '../contracts/ERC20.json'

const TokenBalances = () => {
  const [loading, setLoading] = useState(true)
  const [tokenBalances, setTokenBalances] = useState([])
  const { state } = useContext(Web3Context)

  useEffect(() => {
    const karmicInstance = new ethers.Contract(
      karmicContract.address,
      karmicContract.abi,
      state.web3Provider
    )

    const fetchTokenBalances = async () => {
      const tokens = await karmicInstance.getBoxTokens()
      const balances = await Promise.all(
        tokens.map(async (tokenAddress) => {
          const tokenInstance = new ethers.Contract(
            tokenAddress,
            erc20.abi,
            state.web3Provider
          )
          const balance = await tokenInstance.balanceOf(state.address)
          return [tokenAddress, ethers.utils.formatEther(balance)]
        })
      )
      setTokenBalances(balances)
      setLoading(false)
    }

    if (state.web3Provider) {
      fetchTokenBalances()
    }
  }, [state.web3Provider, state.address])

  return (
    <div>
      <h1>Token Balances</h1>
      {loading ? (
        <div>loading</div>
      ) : (
        <div>
          {tokenBalances.map((tokenBalance) => (
            <div key={tokenBalance[0]}>
              <span>{tokenBalance[0]}</span>: <span>{tokenBalance[1]}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default TokenBalances
