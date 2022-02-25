import { ethers } from 'ethers'
import { Card, Button } from 'react-bootstrap'
import DonateForm from './DonateForm'
import KarmicModal from './KarmicModal'
import useModal from './utils/useModal'

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
  const { show, handleShow, handleClose } = useModal(false)
  const handleReclaim = () => {
    return reclaim(token)
  }

  const handleDonate = () => {
    return donate(token)
  }
  return (
    <>
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
                isTargetReached ? (
                  <>
                    <div className="row justify-content-between pl-3 pr-3 pt-0 pb-0">
                      <p className="claimable-amount-info">Claimable KARMIC</p>
                      <p className="claimable-amount-info">
                        {Number(balance)} KARMIC
                      </p>
                    </div>
                    <p className="box-token-info">
                      In order to receive KARMIC tokens, please approve your
                      tokens first and then claim them.
                    </p>
                  </>
                ) : (
                  <p className="box-token-info">
                    In order to reclaim or donate your ETH, please approve all
                    of your tokens first.
                  </p>
                )
              ) : isTargetReached ? (
                <>
                  <div className="row justify-content-between pl-3 pr-3 pt-0 pb-0">
                    <p className="claimable-amount-info">Claimable KARMIC</p>
                    <p className="claimable-amount-info">
                      {Number(balance)} KARMIC
                    </p>
                  </div>
                  <p className="box-token-info">
                    You can claim your KARMIC Tokens.
                  </p>
                </>
              ) : (
                <>
                  <Button
                    className="box-token-button action-hover"
                    variant="primary"
                    onClick={handleReclaim}
                  >
                    Reclaim {Number(balance) / 1000} ETH
                  </Button>
                  <Card.Text className="box-token-or">or</Card.Text>
                  <Button
                    className="box-token-button action-hover"
                    variant="primary"
                    onClick={handleShow}
                  >
                    Donate ETH & Claim KARMIC Tokens
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
                  onClick={handleShow}
                >
                  Donate ETH & Claim KARMIC tokens.
                </Button>
              </>
            )}
          </>
          <a
            href={mirrorUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="box-token-backlink"
            variant="link"
          >
            Go to Mirror
          </a>
        </Card.Body>
      </Card>
      <KarmicModal
        show={show}
        handleClose={handleClose}
        title={'Donate ETH'}
        description={
          'Donate your ETH to the Sphere Pool to receive KARMIC tokens'
        }
        action={handleDonate}
        actionName={'Donate ETH & claim KARMIC Tokens'}
        actionProgressName={'Donating...'}
      >
        <DonateForm title={title} balance={balance} />
      </KarmicModal>
    </>
  )
}

export default BoxCard
