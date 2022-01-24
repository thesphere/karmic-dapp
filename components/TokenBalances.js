import { ethers } from 'ethers'
import { useEffect, useState, useContext } from 'react'
import { Web3Context } from '../context/Web3Context'
import karmicContract from '../contracts/Karmic.json'
import erc20 from '../contracts/ERC20.json'

const TokenBalances = () => {
  const [fetchingTokens, setFetchingTokens] = useState(true)
  // [address, balance, status]
  const [tokens, setTokens] = useState([])
  const { state } = useContext(Web3Context)
  const { web3Provider, address } = state

  useEffect(() => {
    const karmicInstance = new ethers.Contract(
      karmicContract.address,
      karmicContract.abi,
      web3Provider
    )

    const fetchTokenBalances = async () => {
      const boxTokens = await karmicInstance.getBoxTokens()

      const tokens = await Promise.all(
        boxTokens.map(async (token) => {
          const tokenInstance = new ethers.Contract(
            token,
            erc20.abi,
            web3Provider
          )
          const balance = await tokenInstance.balanceOf(state.address)
          const isKarmicApproved = await tokenInstance.allowance(
            address,
            karmicContract.address
          )

          const status = isKarmicApproved > 0 ? 'approved' : 'initialized'

          return {
            token,
            balance: ethers.utils.formatEther(balance),
            status,
          }
        })
      )

      setTokens(tokens)
      setFetchingTokens(false)
    }

    if (web3Provider) {
      fetchTokenBalances()
    }
  }, [web3Provider, address])

  const handleApprove = async (token) => {
    let tokenCopy = { ...token }
    const signer = await web3Provider.getSigner(address)
    const tokenInstance = new ethers.Contract(token.token, erc20.abi, signer)
    const tx = await tokenInstance.approve(
      karmicContract.address,
      ethers.utils.parseEther(token.balance)
    )

    tokenCopy.status = 'pending'
    let tokensCopy = [...tokens]
    const idx = tokens.findIndex((tokenObj) => tokenObj.token === token.token)
    tokensCopy[idx] = tokenCopy

    setTokens(tokensCopy)

    tx.wait()
      .then(() => {
        tokenCopy.status = 'approved'
        tokensCopy = [...tokens]
        tokensCopy[idx] = tokenCopy

        setTokens(tokensCopy)
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
    const tokenAddresses = tokens
      .filter((token) => token.balance > 0)
      .map((token) => token.token)

    const tx = await karmicInstance.claimGovernanceTokens(tokenAddresses)

    let tokensCopy = [...tokens]
  }

  return (
    <div>
      <h1>Token Balances</h1>
      {fetchingTokens ? (
        <div>fetching tokens..</div>
      ) : (
        <div>
          {tokens.map((tokenBalance) => {
            const { token, balance, status } = tokenBalance
            return (
              balance > 0 && (
                <>
                  <div key={token}>
                    <span>{token}</span>: <span>{balance}</span>{' '}
                    <button
                      onClick={() => handleApprove(tokenBalance)}
                      disabled={status != 'initialized'}
                    >
                      {status == 'pending'
                        ? 'pending approval'
                        : status == 'approved'
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
