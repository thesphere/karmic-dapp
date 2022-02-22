import { Card, Button } from 'react-bootstrap'

const BoxCard = ({
  title = 'Box Token Name',
  status,
  mirrorUrl,
  reclaim,
  donate,
  govTokenBalance,
  balance,
  isTargetReached,
  token,
  image = 'https://picsum.photos/200/300',
}) => {
  const handleReclaim = async () => {
    reclaim(token)
  }

  const handleDonate = async () => {
    await donate(token)
  }
  return (
    <Card className="box-token-container">
      <Card.Img
        style={{ maxHeight: '251px', objectFit: 'cover' }}
        variant="top"
        src={image}
      />
      <Card.Body>
        <Card.Title className="box-token-title">{title}</Card.Title>
        <Card.Text className="box-token-status">
          Status: {isTargetReached ? 'Target reached' : 'Target not reached'}
        </Card.Text>
        <>
          {govTokenBalance == 0 && balance == 0 ? (
            <p className="box-token-info">
              You don't have any governance token.
            </p>
          ) : govTokenBalance == 0 && balance > 0 ? (
            status !== 'approved' ? (
              <p className="box-token-info">
                In order to receive GOV, please approve all of your tokens first
                and then claim them.
              </p>
            ) : isTargetReached ? (
              <p className="box-token-info">You can claim the KARMIC tokens.</p>
            ) : (
              <>
                <Button
                  className="box-token-button action-hover"
                  variant="primary"
                  onClick={handleReclaim}
                >
                  Reclaim ETH
                </Button>
                <Card.Text className="box-token-or">or</Card.Text>
                <Button
                  className="box-token-button action-hover"
                  variant="primary"
                  onClick={handleDonate}
                >
                  Donate ETH & Claim KARMIC tokens.
                </Button>
              </>
            )
          ) : isTargetReached ? (
            <p className="box-token-info">
              You have successfully claimed all of your KARMIC tokens.
            </p>
          ) : (
            <>
              <Button
                className="box-token-button action-hover"
                variant="primary"
                onClick={handleReclaim}
              >
                Reclaim ETH
              </Button>
              <Card.Text className="box-token-or">or</Card.Text>
              <Button
                className="box-token-button action-hover"
                variant="primary"
                onClick={handleDonate}
              >
                Donate ETH & Claim KARMIC tokens.
              </Button>
            </>
          )}
        </>
        <a href={mirrorUrl} target="_blank" rel="noopener noreferrer" className="box-token-backlink" variant="link">
          Go to Mirror
        </a>
      </Card.Body>
    </Card>
  )
}

export default BoxCard
