import { ethers } from 'ethers'
import { useEffect, useState, useContext } from 'react'
import { Web3Context } from '../context/Web3Context'
import karmicContract from '../contracts/Karmic.json'
import erc20 from '../contracts/ERC20.json'

const Tile = ({ props }) => {
  const { state } = useContext(Web3Context)
  const { web3Provider, address } = state
  const { token, balance, status, handleApprove } = props

  return (
    <>
      <div key={token} className="tile">
        <span>{token}</span>: <span>{balance}</span>{' '}
        {balance > 0 && (
          <button
            onClick={() => handleApprove({ token, balance, status })}
            disabled={status && status != 'initialized'}
          >
            {status == 'pending'
              ? 'pending approval'
              : status == 'approved'
              ? 'Approved'
              : 'Approve'}
          </button>
        )}
      </div>

      <style jsx>{`
        .tile {
          background-color: yellow;
          border: 1px solid black;
        }
      `}</style>
    </>
  )
}

export default Tile
