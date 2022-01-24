import { ethers } from 'ethers'
import { useEffect, useState, useContext } from 'react'
import { Web3Context } from '../context/Web3Context'
import karmicContract from '../contracts/Karmic.json'
import erc20 from '../contracts/ERC20.json'

const TokenBalances = () => {
  const [fetchingTokens, setFetchingTokens] = useState(true)
  // [address, balance, approvedSum, pendingApproval]
  const [tokenBalances, setTokenBalances] = useState([])
  const { state } = useContext(Web3Context)
  const { web3Provider, address } = state

  useEffect(() => {
    const karmicInstance = new ethers.Contract(
      karmicContract.address,
      karmicContract.abi,
      web3Provider
    )

    const fetchTokenBalances = async () => {
      const tokens = await karmicInstance.getBoxTokens()
      const balances = await Promise.all(
        tokens.map(async (tokenAddress) => {
          const tokenInstance = new ethers.Contract(
            tokenAddress,
            erc20.abi,
            web3Provider
          )
          const balance = await tokenInstance.balanceOf(state.address)
          const isKarmicApproved = await tokenInstance.allowance(
            address,
            karmicContract.address
          )

          const pendingApproval = false

          return [
            tokenAddress,
            ethers.utils.formatEther(balance),
            ethers.utils.formatEther(isKarmicApproved),
            pendingApproval,
          ]
        })
      )
      setTokenBalances(balances)
      setFetchingTokens(false)
    }

    if (web3Provider) {
      fetchTokenBalances()
    }
  }, [web3Provider, address])

  const handleApprove = async (tokenBalance) => {
    let [tokenAddress, balance] = tokenBalance
    const signer = await web3Provider.getSigner(address)
    const tokenInstance = new ethers.Contract(tokenAddress, erc20.abi, signer)
    const idx = tokenBalances.findIndex((arr) => arr[0] === tokenAddress)

    const tx = await tokenInstance.approve(
      karmicContract.address,
      ethers.utils.parseEther(balance)
    )

    tokenBalance[3] = true
    let tokensCopy = [...tokenBalances]
    tokensCopy[idx] = tokenBalance
    setTokenBalances(tokensCopy)

    tx.wait()
      .then(() => {
        tokenBalance[2] = balance
        tokenBalance[3] = false
        tokensCopy = [...tokenBalances]
        tokensCopy[idx] = tokenBalance
        setTokenBalances(tokensCopy)
      })
      .catch((e) => console.log(e))
  }

  const handleClaim = async () => {
    const signer = await web3Provider.getSigner(address)
    const karmicInstance = new ethers.Contract(
      karmicContract.address,
      karmicContract.abi,
      signer
    )
    const tokenAddresses = tokenBalances
      .filter((token) => token[1] > 0)
      .map((token) => token[0])

    const tx = await karmicInstance.claimGovernanceTokens(tokenAddresses)
  }

  return (
    <div>
      <h1>Token Balances</h1>
      {fetchingTokens ? (
        <div>fetching tokens..</div>
      ) : (
        <div>
          {tokenBalances.map((tokenBalance) => {
            const [address, balance, approvedSum, pendingApproval] =
              tokenBalance
            return (
              balance > 0 && (
                <>
                  <div key={address}>
                    <span>{address}</span>: <span>{balance}</span>{' '}
                    <button
                      onClick={() => handleApprove(tokenBalance)}
                      disabled={approvedSum >= balance || pendingApproval}
                    >
                      {pendingApproval
                        ? 'pendingApproval'
                        : approvedSum >= balance
                        ? 'Approved'
                        : 'Approve'}
                    </button>
                  </div>
                </>
              )
            )
          })}
          <button onClick={() => handleClaim()}>Claim</button>
        </div>
      )}
    </div>
  )
}

export default TokenBalances
