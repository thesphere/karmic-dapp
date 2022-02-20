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
    isTargetReached
  } = props

  return (
    <BoxCard
      reclaim={reclaim}
      donate={donate}
      mirrorUrl={`https://g.mirror.xyz/crowdfunds/${token}`}
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
//https://g.mirror.xyz/crowdfunds/0x1B7D237406f51978d48BFCEc2211c5EB97a344AA
export default Tile
