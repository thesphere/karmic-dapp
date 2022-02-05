import Tile from './Tile'

const TokenTiles = (props) => {
  const { address, fetchingTokens, tokens, govTokenBalances, handleApprove } =
    props
  return (
    <>
      <div className="main-container">
        {address ? (
          fetchingTokens ? (
            <p>fetching box tokens..</p>
          ) : (
            <div className="tile-container">
              {tokens.map((tokenBalance, idx) => {
                const { token, balance, status, title, image } = tokenBalance
                return (
                  <Tile
                    props={{
                      token,
                      balance,
                      status,
                      title,
                      image,
                      govTokenBalance: govTokenBalances[idx],
                      handleApprove,
                    }}
                    key={token}
                  />
                )
              })}
            </div>
          )
        ) : (
          <p>connect wallet to see NFTs</p>
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
