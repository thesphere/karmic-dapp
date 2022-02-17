const ClaimArea = (props) => {
  const { claimableTokens, approvedTokens, govTokenBalances, handleClaim } =
    props

  return (
    <>
      <div className="claim-container">
        {claimableTokens.length > 0 ? (
          <>
            <button
              className="claim-button"
              onClick={() => handleClaim()}
              disabled={claimableTokens.length != approvedTokens.length}
            >
              Claim Governance Tokens
            </button>
            {claimableTokens.length != approvedTokens.length && (
              <p>all tokens must be approved</p>
            )}
          </>
        ) : govTokenBalances.find((balance) => balance > 0) ? (
          <p>already claimed gov tokens</p>
        ) : (
          <p>no tokens to claim</p>
        )}
      </div>
      <style jsx>{`
        .claim-container {
          flex-grow: 1;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          align-items: center;
        }
        .claim-button {
          width: 180px;
          height: 40px;
        }
      `}</style>
    </>
  )
}

export default ClaimArea
