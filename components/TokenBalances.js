import { BigNumber, ethers } from 'ethers'
import { useEffect, useState, useContext } from 'react'
import { Web3Context } from '../context/Web3Context'
import karmicContract from '../contracts/Karmic.json'
import erc20 from '../contracts/ERC20.json'
import TokenTiles from './TokenTiles'
import { parseUnits } from 'ethers/lib/utils'
import Header from './Header'
import axios from 'axios'

const TokenBalances = () => {
  const [fetchingTokens, setFetchingTokens] = useState(true)
  const [claiming, setClaiming] = useState(false)
  // [address, balance, status, name, image]
  const [tokens, setTokens] = useState([])
  const [govTokenBalances, setGovTokenBalances] = useState([])
  const [ethBalance, setEthBalance] = useState()
  const [karmicBalance, setKarmicBalance] = useState()
  const { state } = useContext(Web3Context)
  const { web3Provider, address } = state

  const fetchTokenBalances = async () => {
    const boxTokenAddresses = await karmicInstance.getBoxTokens()

    let boxTokens = await Promise.all(
      boxTokenAddresses.map(async (token) => {
        const isBoxToken = token != '0x0000000000000000000000000000000000000000'
        let balance = ethers.BigNumber.from(0),
          isKarmicApproved = ethers.BigNumber.from(0)
        let name
        if (isBoxToken) {
          console.log('no error')
          const tokenInstance = new ethers.Contract(
            token,
            erc20.abi,
            web3Provider
          )
          name = await tokenInstance.name()
          balance = await tokenInstance.balanceOf(state.address)

          isKarmicApproved = await tokenInstance.allowance(
            address,
            karmicContract.address
          )
        }
        const boxToken = await karmicInstance.boxTokenTiers(token)
        const metadata = await karmicInstance.uri(boxToken.id)
        const fees = await karmicInstance.fee()
        const fee_precision = await karmicInstance.FEE_PRECISION()
        const totalFunding = boxToken.funds
          .mul(fee_precision)
          .div(fee_precision.sub(fees))
        const isTargetReached = totalFunding.gte(boxToken.threshold)

        const status = isKarmicApproved > 0 ? 'approved' : null
        try {
          return {
            token,
            balance: isBoxToken ? ethers.utils.formatEther(balance) : balance,
            status,
            title: name,
            image: 'https://picsum.photos/200/300',
            isTargetReached,
          }
        } catch (error) {
          return {
            token,
            balance: isBoxToken ? ethers.utils.formatEther(balance) : balance,
            status,
            title: name,
            image: 'https://picsum.photos/200/300',
            isTargetReached,
          }
        }
      })
    )

    boxTokens = boxTokens.filter(
      (box) => box.token !== ethers.constants.AddressZero
    )

    const govTokenBalances = (await karmicInstance.allBalancesOf(address)).map(
      (balance) => ethers.utils.formatEther(balance)
    )

    setTokens(boxTokens)
    setGovTokenBalances(govTokenBalances)
    setFetchingTokens(false)
  }

  useEffect(() => {
    if (web3Provider && karmicInstance?.address && address) {
      userBalance()
    }
  }, [web3Provider, address, fetchingTokens])

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

    tokensCopy.reduce((previousApprove, tokenCopy) => {
      return previousApprove.then(() => {
        console.log('Approving token ', tokenCopy.token)
        return handleApprove(tokenCopy)
      }).catch(() => {
        console.log("Approving previous token failed");
        console.log('Approving token ', tokenCopy.token)
        return handleApprove(tokenCopy)})
    }, Promise.resolve())
    await userBalance()
    await fetchTokenBalances()
  }

  const supportSphere = async (amount) => {
    ;(await web3Provider.getSigner())
      .sendTransaction({
        from: address,
        to: karmicInstance.address,
        value: amount,
      })
      .then((tx) => tx.wait().then(userBalance))
  }

  const userBalance = async () => {
    try {
      const userBalances = await karmicInstance?.allBalancesOf(address)
      const totalBalance = userBalances?.reduce(
        (prev, balance) => prev.add(balance),
        BigNumber.from(0)
      )
      const ethBalance = await web3Provider.getBalance(address)
      setEthBalance(ethBalance)
      setKarmicBalance(totalBalance)
    } catch (error) {
      setEthBalance(BigNumber.from(0))
      setKarmicBalance(BigNumber.from(0))
      console.error(error)
    }
  }

  const donate = async (token) => {
    const signer = await web3Provider.getSigner(address)
    const tokenInstance = new ethers.Contract(token, erc20.abi, web3Provider)
    const amount = await tokenInstance.balanceOf(address)
    if (amount.eq(0)) {
      alert('No tokens remaining to donate')
      return
    }
    karmicInstance
      .connect(signer)
      .claimGovernanceTokens([token])
      .then((tx) => tx.wait().then(userBalance))
  }

  const reclaim = async (token) => {
    const signer = await web3Provider.getSigner(address)
    const tokenInstance = new ethers.Contract(token, erc20.abi, web3Provider)
    const amount = await tokenInstance.balanceOf(address)
    if (amount.eq(0)) {
      alert('Nothing remaining to withdraw')
      return
    }
    karmicInstance
      .connect(signer)
      .withdraw(token, amount)
      .then((tx) => tx.wait().then(userBalance))
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
        userBalance()
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
        ethBalance={ethBalance}
        karmicBalance={karmicBalance}
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
