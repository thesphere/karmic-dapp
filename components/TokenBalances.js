import { ethers } from 'ethers'
import { useEffect, useState, useContext } from 'react'
import ClaimArea from './ClaimArea'
import { Web3Context } from '../context/Web3Context'
import karmicContract from '../contracts/Karmic.json'
import erc20 from '../contracts/ERC20.json'
import TokenTiles from './TokenTiles'
import { parseUnits } from 'ethers/lib/utils'
import Header from './Header'

const TokenBalances = () => {
  const [fetchingTokens, setFetchingTokens] = useState(true)
  const [claiming, setClaiming] = useState(false)
  // [address, balance, status, name, image]
  const [tokens, setTokens] = useState([])
  const [govTokenBalances, setGovTokenBalances] = useState([])
  const { state } = useContext(Web3Context)
  const { web3Provider, address } = state

  const fetchTokenBalances = async () => {
    console.log(web3Provider)
    const boxTokenAddresses = await karmicInstance.getBoxTokens()

    const boxTokens = await Promise.all(
      boxTokenAddresses.map(async (token) => {
        const isBoxToken =
          token != '0x0000000000000000000000000000000000000000'
        let balance = ethers.BigNumber.from(0),
          isKarmicApproved = ethers.BigNumber.from(0)
        if (isBoxToken) {
          console.log('no error')
          const tokenInstance = new ethers.Contract(
            token,
            erc20.abi,
            web3Provider
          )
          console.log(tokenInstance)
          balance = await tokenInstance.balanceOf(state.address)
          console.log('Error')

          isKarmicApproved = await tokenInstance.allowance(
            address,
            karmicContract.address
          )
        }
        const boxToken = await karmicInstance.boxTokenTiers(token)
        const metadata = await karmicInstance.uri(boxToken.id)

        // TODO: fetch metadata (e.g. with axios)
        // const { title, image } = metadata
        const title = 'evil cat'
        const image = 'http://localhost:3000/cat.jpg'

        const status = isKarmicApproved > 0 ? 'approved' : null

        return {
          token,
          balance: isBoxToken ? ethers.utils.formatEther(balance) : balance,
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

  useEffect(() => {
    const karmicInstance = new ethers.Contract(
      karmicContract.address,
      karmicContract.abi,
      web3Provider
    )
    window.karmicInstance = karmicInstance

    if (web3Provider) {
      fetchTokenBalances()
    }
  }, [web3Provider, address])

  const approveAllTokens = async () => {
    console.log('Approving all the tokens')
    const tokensCopy = tokens.filter(
      (token) => token.token != '0x0000000000000000000000000000000000000000'
    )
    Promise.all(tokensCopy.map(async (token) => {
      if (parseFloat(token.balance) > 0 && token.status !== 'approved') {
        console.log('Approving token ', token.token)
        return await handleApprove(token)
      }
    })).then(fetchTokenBalances);
  }

  const supportSphere = async (amount) => {
    await (
      await web3Provider.getSigner()
    ).sendTransaction({
      from: address,
      to: karmicInstance.address,
      value: amount,
    })
  }

  const donate = async (token) => {
    const signer = await web3Provider.getSigner(address)
    await karmicInstance.connect(signer).claimGovernanceTokens([token])
  }

  const reclaim = async (token, amount) => {
    const signer = await web3Provider.getSigner(address)
    const amountToWithdraw = parseUnits(amount, 18)
    await karmicInstance
      .connect(signer)
      .withdraw(token, amountToWithdraw.toString())
  }

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
      <Header 
      handleClaim={handleClaim}
      approveAllTokens={approveAllTokens}
      supportSphere={supportSphere}
      claimableTokens={claimableTokens}
      approvedTokens={approvedTokens}
      govTokenBalances={govTokenBalances}
      tokens={tokens}
      />
      <TokenTiles
        address={address}
        fetchingTokens={fetchingTokens}
        reclaim={reclaim}
        donate={donate}
        tokens={tokens}
        govTokenBalances={govTokenBalances}
        handleApprove={handleApprove}
      />
    </>
  )
}

export default TokenBalances
