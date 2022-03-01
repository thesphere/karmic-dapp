import { useContext, useEffect } from 'react'
import { Web3Context } from '../context/Web3Context'
import { ellipseAddress, getChainData } from '../lib/utilities'
import CTA from './CTA'
import DappNav from './DappNav'

const Header = ({
  handleClaim,
  approveAllTokens,
  supportSphere,
  tokens,
  claimableTokens,
  approvedTokens,
  govTokenBalances,
  ethBalance,
  karmicBalance,
}) => {
  const { state } = useContext(Web3Context)
  const { address, chainId } = state
  const chainData = getChainData(chainId)

  return (
    <>
      <DappNav ethBalance={ethBalance} karmicBalance={karmicBalance} />
      <CTA
        handleClaim={handleClaim}
        approveAllTokens={approveAllTokens}
        supportSphere={supportSphere}
        tokens={tokens}
        claimableTokens={claimableTokens}
        approvedTokens={approvedTokens}
        govTokenBalances={govTokenBalances}
      />

      <style jsx>{`
        header {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          height: 50px;
        }

        .wallet-container {
          width: 300px;
          display: flex;
          align-items: center;
          justify-content: space-evenly;
        }
      `}</style>
    </>
  )
}

export default Header
