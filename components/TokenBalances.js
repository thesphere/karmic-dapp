import { ethers } from 'ethers'
import { useEffect, useState, useContext } from 'react'
import { Web3Context } from '../context/Web3Context'
import karmicContract from '../contracts/Karmic.json'
import erc20 from '../contracts/ERC20.json'

const TokenBalances = () => {
  const [fetchingTokens, setFetchingTokens] = useState(true)
  // [address, balance, approvedSum, pendingApproval]
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
      const tokens = await karmicInstance.getBoxTokens()

      const balances = await Promise.all(
        tokens.map(async (token) => {
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

          const pendingApproval = false

          return {
            token,
            balance: ethers.utils.formatEther(balance),
            approved: ethers.utils.formatEther(isKarmicApproved),
            pendingApproval,
          }
        })
      )

      setTokens(balances)
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
    // console.log(await tokenInstance.balanceOf(address))
    const idx = tokens.findIndex((tokenObj) => tokenObj.token === token.token)
    console.log(idx)
    const tx = await tokenInstance.approve(
      karmicContract.address,
      ethers.utils.parseEther(token.balance)
    )

    console.log(tx)
    console.log
    console.log(idx)

    tokenCopy.pendingApproval = true
    let tokensCopy = [...tokens]
    tokensCopy[idx] = tokenCopy
    console.log('heya')
    setTokens(tokensCopy)

    tx.wait()
      .then(() => {
        console.log('bu')
        tokenCopy.approved = tokenCopy.balance
        tokenCopy.pendingApproval = false
        tokensCopy = [...tokens]
        tokensCopy[idx] = tokenCopy
        console.log(tokensCopy)
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
      .filter((token) => token[1] > 0)
      .map((token) => token[0])

    const tx = await karmicInstance.claimGovernanceTokens(tokenAddresses)
  }

  console.log(tokens)

  return (
    <div>
      <h1>Token Balances</h1>
      {fetchingTokens ? (
        <div>fetching tokens..</div>
      ) : (
        <div>
          {tokens.map((tokenBalance) => {
            const { token, balance, approved, pendingApproval } = tokenBalance
            return (
              balance > 0 && (
                <>
                  <div key={token}>
                    <span>{token}</span>: <span>{balance}</span>{' '}
                    <button
                      onClick={() => handleApprove(tokenBalance)}
                      disabled={approved >= balance || pendingApproval}
                    >
                      {pendingApproval
                        ? 'pendingApproval'
                        : approved >= balance
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
