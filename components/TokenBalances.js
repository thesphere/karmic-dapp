import { ethers } from 'ethers'
import { useEffect, useState, useContext } from 'react'
import ClaimArea from './ClaimArea'
import { Web3Context } from '../context/Web3Context'
import karmicContract from '../contracts/Karmic.json'
import erc20 from '../contracts/ERC20.json'
import TokenTiles from './TokenTiles'

const TokenBalances = () => {
  const [fetchingTokens, setFetchingTokens] = useState(true)
  const [claiming, setClaiming] = useState(false)
  // [address, balance, status, name, image]
  const [tokens, setTokens] = useState([])
  const [govTokenBalances, setGovTokenBalances] = useState([])
  const { state } = useContext(Web3Context)
  const { web3Provider, address } = state
  console.log(govTokenBalances)
  useEffect(() => {
    const karmicInstance = new ethers.Contract(
      karmicContract.address,
      karmicContract.abi,
      web3Provider
    )

    const fetchTokenBalances = async () => {
      const boxTokenAddresses = await karmicInstance.getBoxTokens()

      const boxTokens = await Promise.all(
        boxTokenAddresses.map(async (token) => {
          const tokenInstance = new ethers.Contract(
            token,
            erc20.abi,
            web3Provider
          )
          const balance = await tokenInstance.balanceOf(state.address)
          const id = await karmicInstance.boxTokenTiers(token)
          const metadata = await karmicInstance.uri(id)

          // TODO: fetch metadata (e.g. with axios)
          // const { title, image } = metadata
          const title = 'evil cat'
          const image = 'http://localhost:3000/cat.jpg'

          const isKarmicApproved = await tokenInstance.allowance(
            address,
            karmicContract.address
          )

          const status = isKarmicApproved > 0 ? 'approved' : null

          return {
            token,
            balance: ethers.utils.formatEther(balance),
            status,
            title,
            image,
          }
        })
      )

      const govTokenBalances = (
        await karmicInstance.allBalancesOf(address)
      ).map((balance) => ethers.utils.formatEther(balance))

      setTokens(boxTokens)
      setGovTokenBalances(govTokenBalances)
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

    setClaiming(true)
    let tokensCopy = [...tokens]

    tx.wait()
      .then(async () => {
        const govTokenBalances = (
          await karmicInstance.allBalancesOf(address)
        ).map((balance) => ethers.utils.formatEther(balance))
        setTokens(
          tokensCopy.map((token) => ({
            ...token,
            balance: 0,
            status: 'claimed',
          }))
        )
        setGovTokenBalances(govTokenBalances)
      })
      .catch((e) => console.log(e))
  }

  const claimableTokens = tokens.filter((token) => token.balance > 0)
  const approvedTokens = tokens.filter((token) => token.status == 'approved')

  return (
    <>
      <ClaimArea
        claimableTokens={claimableTokens}
        approvedTokens={approvedTokens}
        govTokenBalances={govTokenBalances}
        handleClaim={handleClaim}
      />
      <TokenTiles
        address={address}
        fetchingTokens={fetchingTokens}
        tokens={tokens}
        govTokenBalances={govTokenBalances}
        handleApprove={handleApprove}
      />
    </>
  )
}

export default TokenBalances
