import { useEffect, useState, useContext } from 'react'
import { Web3Context } from '../context/Web3Context'
import BoxCard from './BoxCard'

const Tile = ({ props }) => {
  const { state } = useContext(Web3Context)
  const { web3Provider, address } = state
  const {
    reclaim,
    donate,
    token,
    balance,
    status,
    image,
    title,
    govTokenBalance,
    isTargetReached,
  } = props

  return (
    <BoxCard
      reclaim={reclaim}
      donate={donate}
      mirrorUrl={`https://mirror.xyz/digitalsoul.eth/crowdfunds/${token}`}
      govTokenBalance={govTokenBalance}
      balance={balance}
      status={status}
      image={image}
      title={title}
      isTargetReached={isTargetReached}
      token={token}
    />
  )
}
export default Tile
