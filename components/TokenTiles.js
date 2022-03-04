import Tile from './Tile'

const TokenTiles = (props) => {
  const {
    address,
    fetchingTokens,
    tokens,
    govTokenBalances,
    handleApprove,
    reclaim,
    donate,
  } = props
  return (
    <>
      <h1 style={{ marginTop: '0px' }} className="box-token-deck-title">
        Sphere Campaigns
      </h1>
      <div className="main-container">
        {address ? (
          fetchingTokens ? (
            <p className="card-not-loaded-desc">fetching box tokens..</p>
          ) : (
            <div className="tile-container">
              {tokens.map((tokenBalance, idx) => {
                const {
                  token,
                  balance,
                  status,
                  title,
                  image,
                  isTargetReached,
                } = tokenBalance
                return (
                  <Tile
                    props={{
                      reclaim,
                      donate,
                      token,
                      balance,
                      status,
                      title,
                      image,
                      govTokenBalance: govTokenBalances[idx + 1],
                      isTargetReached,
                      handleApprove,
                    }}
                    key={token}
                  />
                )
              })}
            </div>
          )
        ) : (
          <p className="card-not-loaded-desc">connect wallet to see NFTs</p>
        )}
      </div>

      <style jsx>{`
        .main-container {
          flex-grow: 1;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .tile-container {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          max-width: 1200px;
        }
      `}</style>
    </>
  )
}

export default TokenTiles
