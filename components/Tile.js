import { ethers } from 'ethers'
import { useEffect, useState, useContext } from 'react'
import { Web3Context } from '../context/Web3Context'
import karmicContract from '../contracts/Karmic.json'
import erc20 from '../contracts/ERC20.json'

const Tile = ({ props }) => {
  const { state } = useContext(Web3Context)
  const { web3Provider, address } = state
  const { token, balance, status, image, title, handleApprove } = props

  return (
    <>
      <div key={token} className="tile">
        <span>{title}</span>
        <img src="http://localhost:3000/cat.jpeg" />
        {balance > 0 ? (
          <>
            <p>{balance}</p>
            <button
              onClick={() =>
                handleApprove({ token, balance, status, image, title })
              }
              disabled={status && status != 'initialized'}
            >
              {status == 'pending'
                ? 'pending approval'
                : status == 'approved'
                ? 'Approved'
                : 'Approve'}
            </button>
          </>
        ) : (
          <a href={`https://g.mirror.xyz/crowdfunds/${token}`}>
            go to crowdfund
          </a>
        )}
      </div>

      <style jsx>{`
        .tile {
          background-color: yellow;
          border: 1px solid black;
          display: flex;
          flex-direction: column;
          width: 300px;
          height: 300px;
          margin: 30px;
        }

        img {
          max-height: 200px;
          width: auto;
        }
      `}</style>
    </>
  )
}
//https://g.mirror.xyz/crowdfunds/0x1B7D237406f51978d48BFCEc2211c5EB97a344AA
export default Tile
