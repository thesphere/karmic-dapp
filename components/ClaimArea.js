const ClaimArea = (props) => {
  const { claimableTokens, approvedTokens, govTokenBalances, handleClaim } =
    props

  const renderClaimArea = () => {
    if (claimableTokens.length > 0) {
      return (
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
      )
    } else if (govTokenBalances.find((balance) => balance > 0)) {
      return <p>already claimed gov tokens</p>
    } else {
      return <p>no tokens to claim</p>
    }
  }

  return (
    <>
      <div className="claim-container">{renderClaimArea()}</div>
      <style jsx>{`
        .claim-container {
          flex-grow: 1;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          align-items: center;
        }

        .claim-button {
          width: 200px;
          height: 50px;
        }
      `}</style>
    </>
  )
}

export default ClaimArea
